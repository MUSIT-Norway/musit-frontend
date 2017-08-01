// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simplePost, simpleGet, simplePut } from '../../shared/RxAjax';
import type { Callback, AjaxPost, AjaxGet, AjaxPut } from '../types/ajax';
import type { ImportAnalysisResult } from 'types/analysisResult';
import type { Result, Restriction } from '../../types/analysis';
import type { CollectionId } from 'types/ids';

export type AnalysisSavePayload = {
  doneBy?: ?string,
  doneDate?: ?string,
  responsible?: ?string,
  administrator?: ?string,
  completedBy?: ?string,
  completedDate?: ?string,
  caseNumbers?: ?Array<string>,
  restriction?: ?Restriction,
  result?: ?Result
};

export const getAnalysisTypesForCollection: (
  ajaxGet: AjaxGet
) => (props: {
  museumId: number,
  collectionId: string,
  token: string,
  callback?: Callback
}) => Observable = (ajaxGet = simpleGet) => ({
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

export const saveAnalysisEvent: (
  ajaxPost: AjaxPost
) => (props: {
  museumId: number,
  data: AnalysisSavePayload,
  token: string,
  callback?: Callback
}) => Observable = (ajaxPost = simplePost) => ({ museumId, data, token, callback }) => {
  const url = Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response);
};

export const editAnalysisEvent: (
  ajaxPut: AjaxPut
) => (props: {
  id: number,
  museumId: number,
  data: AnalysisSavePayload,
  token: string,
  callback?: Callback
}) => Observable = (ajaxPut = simplePut) => ({ id, museumId, data, token, callback }) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
  return ajaxPut(url, data, token, callback).map(({ response }) => response);
};

export const getAnalysesForObject: (
  ajaxGet: AjaxGet
) => (props: {
  id: number,
  museumId: number,
  token: string,
  callback?: Callback
}) => Observable = (ajaxGet = simpleGet) => ({ museumId, token, id, callback }) => {
  const url = Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => {
    if (!Array.isArray(response)) {
      return [];
    }
    return response;
  });
};

export const getAnalysisById: (
  ajaxGet: AjaxGet
) => (props: {
  id: number,
  museumId: number,
  token: string,
  callback?: Callback
}) => Observable = (ajaxGet = simpleGet) => ({ museumId, id, token, callback }) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisById(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

export const getAnalysisEvents: (
  ajaxGet: AjaxGet
) => (props: {
  museumId: number,
  token: string,
  collectionId: CollectionId
}) => Observable = (ajaxGet = simpleGet) => ({ museumId, token, collectionId }) => {
  const url = Config.magasin.urls.api.analysis.getAnalysisEvents(museumId, [
    collectionId
  ]);
  return ajaxGet(url, token).map(extractResponseArray);
};

export const extractResponseArray = (httpResponse: any) => {
  if (httpResponse.status === 204) {
    return [];
  } else {
    return httpResponse.response;
  }
};
