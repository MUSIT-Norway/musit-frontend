import entries from 'object.entries';
import Config from '../config';
import mapToBackEnd from './mapper/observation/to_backend';
import mapToFrontEnd from './mapper/observation/to_frontend';
import MusitActor from './actor';
import uniq from 'lodash/uniq';

class Observation {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Observation.loadObservations = (ajaxGet) => ({ nodeId, museumId, token, callback }) => {
  return ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations`, token, callback)
    .map(({ response }) => response)
    .map(arr => {
      if (!arr) {
        return [];
      }
      return arr.map(json => new Observation(json));
    });
};

Observation.addObservation = (ajaxPost) => (nodeId, museumId, data, token, callback) => {
  const url = `${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations`;
  const dataToPost = mapToBackEnd(data, nodeId);
  return ajaxPost(url, dataToPost, token, callback)
    .map(({ response }) => response && new Observation(mapToFrontEnd(response)));
};

Observation.getObservation = (ajaxGet, ajaxPost) => (nodeId, observationId, museumId, token) => {
  const url =`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/observations/${observationId}`;
  return ajaxGet(url, token)
    .flatMap(observation => {
      const actorIds = uniq([observation.response.doneBy, observation.response.registeredBy]).filter(p => p);
      return MusitActor.getActorDetails(ajaxPost)(actorIds, token)
        .map(actorDetails => new Observation(mapToFrontEnd({
          ...observation.response,
          ...MusitActor.getActorNames(actorDetails, observation.response.doneBy, observation.response.registeredBy)
        })));
    });
};


export default Observation;