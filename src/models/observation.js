// @flow
import Config from '../config';
import mapToBackEnd from './mapper/observation/to_backend';
import mapToFrontEnd from './mapper/observation/to_frontend';
import MusitActor from './actor';
import uniq from 'lodash/uniq';
import { simplePost, simpleGet } from '../shared/RxAjax';
import type { Callback, AjaxGet, AjaxPost } from './types/ajax';
import { Observable } from 'rxjs';

class Observation {
  static loadObservations: (
    ajaxGet: AjaxGet
  ) => (props: {
    nodeId: number,
    museumId: number,
    token: string,
    callback?: Callback
  }) => Observable;
  static addObservation: (
    ajaxPost: AjaxPost
  ) => (props: {
    nodeId: number,
    museumId: number,
    data: mixed,
    token: string,
    callback?: Callback
  }) => Observable;
  static getObservation: (
    ajaxGet: AjaxGet,
    ajaxPost: AjaxPost
  ) => (props: {
    nodeId: number,
    observationId: number,
    museumId: number,
    token: string
  }) => Observable;
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
  const url = `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/${nodeId}/observations`;
  const dataToPost = mapToBackEnd(data, nodeId);
  return ajaxPost(url, dataToPost, token, callback);
};

Observation.getObservation = (ajaxGet = simpleGet, ajaxPost = simplePost) => ({
  nodeId,
  observationId,
  museumId,
  token
}) => {
  const url = `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/${nodeId}/observations/${observationId}`;
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
