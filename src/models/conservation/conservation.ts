// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet, simplePut, simplePost, simpleDel } from '../../shared/RxAjax';
import { Callback, AjaxGet, AjaxPut, AjaxPost, AjaxDel } from '../../types/ajax';
import {
  ConservationCollection,
  ConservationType,
  ConservationSave,
  ConservatonSubType
} from '../../types/conservation';

import { ajaxGetRequest } from '../../shared/ajaxPromise';
import { Star, Maybe, mixed, MUSTFIX } from '../../types/common';

export const getConservationForObject: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    id: number;
    museumId: number;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<Array<ConservationCollection>> = (ajaxGet = simpleGet) => ({
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
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    id: number;
    museumId: number;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<ConservationCollection> = (ajaxGet = simpleGet) => ({
  museumId,
  id,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getConservationById(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

export const saveConservationEvent: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    museumId: number;
    data: ConservationSave;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<ConservationCollection> = (ajaxPost = simplePost) => ({
  museumId,
  data,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.addConservationEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response);
};

export const editConservationEvent: (
  ajaxPut: AjaxPut<Star>
) => (
  props: {
    id: number;
    museumId: number;
    data: ConservationSave;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<ConservationCollection> = (ajaxPut = simplePut) => ({
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
  ajaxDel: AjaxDel<Star>
) => (
  props: {
    id: number;
    museumId: number;
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<any> = (ajaxDel = simpleDel) => ({ id, museumId, token, callback }) => {
  const url = Config.magasin.urls.api.conservation.getDeleteSubEventUrl(museumId, id);
  return ajaxDel(url, token, callback).map(({ response }) => response);
};

export const getConservationTypes: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    museumId: number;
    token: string;
    callback?: Maybe<Callback<Star>>;
  }
) => Observable<Array<ConservationType>> = (ajaxGet = simpleGet) => ({
  museumId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getAllConservationTypes(museumId);
  return ajaxGet(url, token, callback as MUSTFIX).map(r => r.response);
};

export const getRoleList: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    token: string;
    callback?: Maybe<Callback<Star>>;
  }
) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getRoleList;
  return ajaxGet(url, token, callback as MUSTFIX).map(r => r.response);
};

export const getTreatmentMaterialList: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    token: string;
    callback?: Maybe<Callback<Star>>;
  }
) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getTreatmentMaterialList;
  return ajaxGet(url, token, callback as MUSTFIX).map(r => r.response);
};

export const getKeywordList: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    token: string;
    callback?: Maybe<Callback<Star>>;
  }
) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getKeywordList;
  return ajaxGet(url, token, callback as MUSTFIX).map(r => r.response);
};

export const getConditionCodeList: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    token: string;
    callback?: Maybe<Callback<Star>>;
  }
) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getConditionCodeList;
  return ajaxGet(url, token, callback as MUSTFIX).map(r => r.response);
};

export const getMaterialList: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    museumId: number;
    collectionId: string;
    token: string;
    callback?: Maybe<Callback<Star>>;
  }
) => Observable<Array<ConservatonSubType>> = (ajaxGet = simpleGet) => ({
  museumId,
  collectionId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.conservation.getMaterialList(
    museumId,
    collectionId
  );
  return ajaxGet(url, token, callback as MUSTFIX).map(r => r.response);
};

export const loadPredefinedConservationTypes: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    museumId: number;
    collectionId: string;
    token: string;
    onComplete: (predefinedTypes: mixed) => void;
  }
) => Observable<Star> = (ajaxGet = simpleGet) => ({
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
      ([
        conservationTypes,
        materialList,
        keywordList,
        roleList,
        conditionCodeList,
        materialDeterminationList
      ]) => ({
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
