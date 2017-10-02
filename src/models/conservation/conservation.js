// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet, simplePut } from '../../shared/RxAjax';
import type { Callback, AjaxGet, AjaxPut } from '../../types/ajax';
import type { ConservationCollection, ConservationType } from 'types/conservation';
import {
  conservationEventMockData,
  conservationEventViewMockData,
  conservationEventTypeMockData
} from './mockData';

export type ConservationSavePayload = {
  doneBy?: ?string,
  doneDate?: ?string,
  responsible?: ?string,
  administrator?: ?string,
  completedBy?: ?string,
  completedDate?: ?string,
  caseNumbers?: ?string,
  affectedThings?: ?Array<string>,
  note?: ?string
};

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
  try {
    return ajaxGet(url, token, callback).map(({ response }) => {
      if (!Array.isArray(response)) {
        return [];
      }
      return response;
    });
  } finally {
    return Observable.of(conservationEventMockData);
  }
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
  try {
    return ajaxGet(url, token, callback).map(({ response }) => response);
  } finally {
    return Observable.of(conservationEventViewMockData);
  }
};

export const editConservationEvent: (
  ajaxPut: AjaxPut<*>
) => (props: {
  id: number,
  museumId: number,
  data: ConservationSavePayload,
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
  return ajaxPut(url, data, token, callback).map(({ response }) => response);
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
  try {
    return ajaxGet(url, token, callback).map(r => r.response);
  } finally {
    return Observable.of(conservationEventTypeMockData);
  }
};
