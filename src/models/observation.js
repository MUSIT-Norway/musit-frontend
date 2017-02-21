import entries from 'object.entries';
import Config from '../config';
import mapToBackEnd from './mapper/observation/to_backend';
import mapToFrontEnd from './mapper/observation/to_frontend';
import MusitActor from './actor';
import uniq from 'lodash/uniq';
import { simplePost, simpleGet } from '../shared/RxAjax';

class Observation {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Observation.loadObservations = (ajaxGet = simpleGet) => ({ nodeId, museumId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations`, token, callback)
    .map(({ response }) => {
      if (!Array.isArray(response)) {
        return [];
      }
      return response.map(json => new Observation(json));
    });
};

Observation.addObservation = (ajaxPost = simplePost) => ({ nodeId, museumId, data, token, callback }) => {
  const url = `${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations`;
  const dataToPost = mapToBackEnd(data, nodeId);
  console.log('Model observation: ', dataToPost);
  return ajaxPost(url, dataToPost, token, callback);
};

Observation.getObservation = (ajaxGet = simpleGet, ajaxPost = simplePost) => ({ nodeId, observationId, museumId, token }) => {
  const url =`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations/${observationId}`;
  return ajaxGet(url, token)
    .flatMap(observation => {
      const actorIds = uniq([observation.response.doneBy, observation.response.registeredBy]).filter(p => p);
      return MusitActor.getActors(ajaxPost)(actorIds, token)
        .map(actorDetails => {
          return new Observation(mapToFrontEnd({
            ...observation.response,
            ...MusitActor.getActorNames(actorDetails, observation.response.doneBy, observation.response.registeredBy)
          }));
        });
    });
};


export default Observation;