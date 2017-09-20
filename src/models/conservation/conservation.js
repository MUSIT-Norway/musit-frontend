// @flow
import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet } from '../../shared/RxAjax';
import type { Callback, AjaxGet } from '../../types/ajax';
import type { ConservationCollection } from 'types/conservation';
import { conservationEventMockData } from './mockData';

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
  return ajaxGet(url, token, callback).map(({ response }) => response);
};
