// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simplePost, simpleGet, simplePut } from '../../shared/RxAjax';
import { Callback, AjaxPost, AjaxGet, AjaxPut } from '../../types/ajax';
import { AnalysisCollection } from '../../types/analysis';
import { Result, Restriction } from '../../types/analysis';
import { CollectionId } from '../../types/ids';
import { Maybe, Star } from '../../types/common';

export type AnalysisSavePayload = {
  doneBy?: Maybe<string>;
  doneDate?: Maybe<string>;
  responsible?: Maybe<string>;
  administrator?: Maybe<string>;
  completedBy?: Maybe<string>;
  completedDate?: Maybe<string>;
  caseNumbers?: Maybe<string>;
  restriction?: Maybe<Restriction>;
  result?: Maybe<Result>;
};

export const saveAnalysisEvent: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    museumId: number;
    data: AnalysisSavePayload;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<AnalysisCollection> = (ajaxPost = simplePost) => ({
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response);
};

export const editAnalysisEvent: (
  ajaxPut: AjaxPut<Star>
) => (
  props: {
    id: number;
    museumId: number;
    data: AnalysisSavePayload;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<AnalysisCollection> = (ajaxPut = simplePut) => ({
  id,
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
  return ajaxPut(url, data, token, callback).map(({ response }) => response);
};

export const getAnalysesForObject: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    id: number;
    museumId: number;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<Array<AnalysisCollection>> = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  id,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
  return ajaxGet(url, token, callback).map(({ error, response }) => {
    if (!Array.isArray(response)) {
      return [];
    }
    return response;
  });
};

export const getAnalysisById: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    id: number;
    museumId: number;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<AnalysisCollection> = (ajaxGet = simpleGet) => ({
  museumId,
  id,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

export const getAnalysisEvents: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    museumId: number;
    token: string;
    collectionId: CollectionId;
  }
) => Observable<Array<AnalysisCollection>> = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  collectionId
}) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisEvents(museumId, [
    collectionId
  ]);
  return ajaxGet(url, token).map(extractResponseArray);
};

export const extractResponseArray = (httpResponse: Star) => {
  if (httpResponse.status === 204) {
    return [];
  } else {
    return httpResponse.response;
  }
};
