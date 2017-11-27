// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet, simplePut, simplePost } from '../../shared/RxAjax';
import type { Callback, AjaxGet, AjaxPut, AjaxPost } from '../../types/ajax';
import type {
  ConservationCollection,
  ConservationType,
  ConservationSave,
  ConservatonSubType
} from 'types/conservation';

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
  const url = Config.magasin.urls.api.conservation.getConservationForObject(museumId, id);
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

export const getMaterialList: (
  ajaxGet: AjaxGet<*>
) => (props: {
  token: string,
  callback?: ?Callback<*>
}) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getMaterialList;
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

export const loadPredefinedConservationTypes: (
  ajaxGet: AjaxGet<*>
) => (props: {
  museumId: number,
  token: string,
  onComplete: (predefinedTypes: mixed) => void
}) => Observable<*> = (ajaxGet = simpleGet) => ({ museumId, token, onComplete }) => {
  return Observable.forkJoin(
    getConservationTypes(ajaxGet)({ museumId, token }),
    getMaterialList(ajaxGet)({ token }),
    getKeywordList(ajaxGet)({ token }),
    getRoleList(ajaxGet)({ token })
  )
    .map(([conservationTypes, materialList, keywordList, roleList]) => ({
      conservationTypes: conservationTypes || [],
      materialList: materialList || [],
      keywordList: keywordList || [],
      roleList: roleList || []
    }))
    .do(onComplete);
};
