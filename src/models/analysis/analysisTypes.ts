// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet } from '../../shared/RxAjax';
import  { Callback, AjaxGet } from '../../types/ajax';
import  { AnalysisType } from '../../types/analysis';
import  { Purposes, Category, AnalysisLabList } from '../../types/predefined';
import { Star, mixed, MUSTFIX } from '../../types/common';

export const getAnalysisTypesForCollection: (
  ajaxGet: AjaxGet<Star>
) => (props: {
  museumId: number,
  collectionId: string,
  token: string,
  callback?: Callback<Star>
}) => Observable<Array<AnalysisType>> = (ajaxGet = simpleGet) => ({
  museumId,
  collectionId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysisType.getAnalysisTypesForCollection(
    museumId,
    collectionId
  );
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

export const getAnalysisTypes: (
  ajaxGet: AjaxGet<Star>
) => (props: {
  museumId: number,
  token: string,
  callback?: Callback<Star>
}) => Observable<Array<AnalysisType>> = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysisType.getAllAnalysisTypes(museumId);
  return ajaxGet(url, token, callback).map(r => r.response);
};

export const getAnalysisCategories: (
  ajaxGet: AjaxGet<Star>
) => (props: {
  museumId: number,
  token: string,
  callback?: Callback<Star>
}) => Observable<Array<Category>> = (ajaxGet = simpleGet) => ({ museumId, token }) => {
  const url = Config.magasin.urls.api.analysisType.getAnalysisCategories(museumId);
  return ajaxGet(url, token).map(({ response }) => response);
};

export const getAnalysisLabList: (
  ajaxGet: AjaxGet<Star>
) => (props: {
  token: string
}) => Observable<AnalysisLabList> = (ajaxGet = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.actor.getLabList;
  return ajaxGet(url, token)
    .map(({ response }) => response)
    .do(function onError() {
      return [];
    });
};

export const getPurposes: (
  ajaxGet: AjaxGet<Star>
) => (props: {
  token: string,
  callback?: Callback<Star>
}) => Observable<Purposes> = (ajaxGet = simpleGet) => ({ token, callback }) => {
  const url = Config.magasin.urls.api.analysis.getPurposes;
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

export const loadPredefinedTypes: (
  ajaxGet: AjaxGet<Star>
) => (props: {
  museumId: number,
  token: string,
  onComplete: (predefinedTypes: mixed) => void
}) => Observable<Star> = (ajaxGet = simpleGet) => ({ museumId, token, onComplete }) => {
  return Observable.forkJoin(
    getAnalysisCategories(ajaxGet)({ museumId, token }),
    getPurposes(ajaxGet)({ museumId, token } as MUSTFIX),
    getAnalysisTypes(ajaxGet)({ museumId, token }),
    getAnalysisLabList(ajaxGet)({ token })
  )
    .map(([categories, purposes, analysisTypes, analysisLabList]) => ({
      categories: {
        ...categories.reduce((a, c) => Object.assign(a, { [c.id]: c.name }), {}),
        raw: categories
      },
      purposes,
      analysisTypes,
      analysisLabList
    }))
    .do(onComplete);
};
