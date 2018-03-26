// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet, simplePut, simplePost, simpleDel } from '../../shared/RxAjax';
import type { Callback, AjaxGet, AjaxPut, AjaxPost, AjaxDel } from '../../types/ajax';
import type {
  ConservationCollection,
  ConservationType,
  ConservationSave,
  ConservatonSubType
} from 'types/conservation';

import { ajaxGetRequest } from '../../shared/ajaxPromise';

export const getConservationForObject: (
  ajaxGet: AjaxGet<*>
) => (props: {
  id: number,
  museumId: number,
  token: string,
  callback?: Callback<*>
}) => Observable<Array<ConservationCollection>> = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  id,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getConservationForObjectAggregated(
    museumId,
    id
  );
  return ajaxGet(url, token, callback).map(({ response }) => {
    if (!Array.isArray(response)) {
      return [];
    }
    return response;
  });
};

export const getConservationById: (
  ajaxGet: AjaxGet<*>
) => (props: {
  id: number,
  museumId: number,
  token: string,
  callback?: Callback<*>
}) => Observable<ConservationCollection> = (ajaxGet = simpleGet) => ({
  museumId,
  id,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getConservationById(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

export const saveConservationEvent: (
  ajaxPost: AjaxPost<*>
) => (props: {
  museumId: number,
  data: ConservationSave,
  token: string,
  callback?: Callback<*>
}) => Observable<ConservationCollection> = (ajaxPost = simplePost) => ({
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.addConservationEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response);
};

export const editConservationEvent: (
  ajaxPut: AjaxPut<*>
) => (props: {
  id: number,
  museumId: number,
  data: ConservationSave,
  token: string,
  callback?: Callback<*>
}) => Observable<ConservationCollection> = (ajaxPut = simplePut) => ({
  id,
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getConservationById(museumId, id);
  return ajaxPut(url, { ...data, id: Number(id) }, token, callback).map(
    ({ response }) => response
  );
};

export const deleteConservationEvent: (
  ajaxDel: AjaxDel<*>
) => (props: {
  id: number,
  museumId: number,
  token: string,
  callback?: Callback<*>
}) => Observable<any> = (ajaxDel = simpleDel) => ({ id, museumId, token, callback }) => {
  const url = Config.magasin.urls.api.conservation.getDeleteSubEventUrl(museumId, id);
  return ajaxDel(url, token, callback).map(({ response }) => response);
};

export const getConservationTypes: (
  ajaxGet: AjaxGet<*>
) => (props: {
  museumId: number,
  token: string,
  callback?: ?Callback<*>
}) => Observable<Array<ConservationType>> = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getAllConservationTypes(museumId);
  return ajaxGet(url, token, callback).map(r => r.response);
};

export const getRoleList: (
  ajaxGet: AjaxGet<*>
) => (props: {
  token: string,
  callback?: ?Callback<*>
}) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getRoleList;
  return ajaxGet(url, token, callback).map(r => r.response);
};

export const getTreatmentMaterialList: (
  ajaxGet: AjaxGet<*>
) => (props: {
  token: string,
  callback?: ?Callback<*>
}) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getTreatmentMaterialList;
  return ajaxGet(url, token, callback).map(r => r.response);
};

export const getKeywordList: (
  ajaxGet: AjaxGet<*>
) => (props: {
  token: string,
  callback?: ?Callback<*>
}) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getKeywordList;
  return ajaxGet(url, token, callback).map(r => r.response);
};

export const getConditionCodeList: (
  ajaxGet: AjaxGet<*>
) => (props: {
  token: string,
  callback?: ?Callback<*>
}) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getConditionCodeList;
  return ajaxGet(url, token, callback).map(r => r.response);
};

export const getMaterialList: (
  ajaxGet: AjaxGet<*>
) => (props: {
  museumId: number,
  collectionId: string,
  token: string,
  callback?: ?Callback<*>
}) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  museumId,
  collectionId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getMaterialList(
    museumId,
    collectionId
  );
  return ajaxGet(url, token, callback).map(r => r.response);
};

export const loadPredefinedConservationTypes: (
  ajaxGet: AjaxGet<*>
) => (props: {
  museumId: number,
  collectionId: string,
  token: string,
  onComplete: (predefinedTypes: mixed) => void
}) => Observable<*> = (ajaxGet = simpleGet) => ({
  museumId,
  collectionId,
  token,
  onComplete
}) => {
  return Observable.forkJoin(
    getConservationTypes(ajaxGet)({ museumId, token }),
    getTreatmentMaterialList(ajaxGet)({ token }),
    getKeywordList(ajaxGet)({ token }),
    getRoleList(ajaxGet)({ token }),
    getConditionCodeList(ajaxGet)({ token }),
    getMaterialList(ajaxGet)({ museumId, collectionId, token })
  )
    .map(
      (
        [
          conservationTypes,
          materialList,
          keywordList,
          roleList,
          conditionCodeList,
          materialDeterminationList
        ]
      ) => ({
        conservationTypes: conservationTypes || [],
        materialList: materialList || [],
        keywordList: keywordList || [],
        roleList: roleList || [],
        conditionCodeList: conditionCodeList || [],
        materialDeterminationList: materialDeterminationList || []
      })
    )
    .do(onComplete);
};

export function getCurrentMeasurementDataForObject(
  id: string,
  museumId: number,
  token: string
) {
  const url = Config.magasin.urls.api.conservation.getCurrentMeasurementDataForObject(
    museumId,
    id
  );
  return ajaxGetRequest(url, token);
}

export function getConservationReport(
  eventId: string,
  museumId: number,
  collectionId: string,
  token: string
) {
  const url = Config.magasin.urls.api.conservation.getConservationReport(
    museumId,
    collectionId,
    eventId
  );
  return ajaxGetRequest(url, token);
}
