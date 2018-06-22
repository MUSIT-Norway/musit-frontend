// @flow
import Config from '../config';
import mapToBackEnd from './mapper/observation/to_backend';
import mapToFrontEnd from './mapper/observation/to_frontend';
import MusitActor from './actor';
import { uniq } from 'lodash';
import { simplePost, simpleGet } from '../shared/RxAjax';
import { Callback, AjaxGet, AjaxPost } from '../types/ajax';
import { Observable } from 'rxjs';
import { Star, mixed } from '../types/common';

class Observation {
  static loadObservations: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      nodeId: number;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static addObservation: (
    ajaxPost?: AjaxPost<Star>
  ) => (
    props: {
      nodeId: number;
      museumId: number;
      data: mixed;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static getObservation: (
    ajaxGet?: AjaxGet<Star>,
    ajaxPost?: AjaxPost<Star>
  ) => (
    props: {
      nodeId: number;
      observationId: number;
      museumId: number;
      token: string;
    }
  ) => Observable<Star>;
}

Observation.loadObservations = (ajaxGet = simpleGet) => ({
  nodeId,
  museumId,
  token,
  callback
}) => {
  return ajaxGet(
    `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/${nodeId}/observations`,
    token,
    callback
  ).map(({ response }) => {
    if (!Array.isArray(response)) {
      return [];
    }
    return response;
  });
};

Observation.addObservation = (ajaxPost = simplePost) => ({
  nodeId,
  museumId,
  data,
  token,
  callback
}) => {
  const url = `${Config.magasin.urls.api.storagefacility.baseUrl(
    museumId
  )}/${nodeId}/observations`;
  const dataToPost = mapToBackEnd(data, nodeId);
  return ajaxPost(url, dataToPost, token, callback);
};

Observation.getObservation = (ajaxGet = simpleGet, ajaxPost = simplePost) => ({
  nodeId,
  observationId,
  museumId,
  token
}) => {
  const url = `${Config.magasin.urls.api.storagefacility.baseUrl(
    museumId
  )}/${nodeId}/observations/${observationId}`;
  return ajaxGet(url, token).flatMap(observation => {
    const actorIds = uniq([
      observation.response.doneBy,
      observation.response.registeredBy
    ]).filter(p => p);
    return MusitActor.getActors(ajaxPost)({ actorIds, token }).map(actorDetails => {
      return mapToFrontEnd({
        ...observation.response,
        ...MusitActor.getActorNames(
          actorDetails,
          observation.response.doneBy,
          observation.response.registeredBy
        )
      });
    });
  });
};

export default Observation;
