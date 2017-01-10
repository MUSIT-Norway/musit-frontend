import Config from '../../config';
import { mapToBackend } from './controlMapper';
import uniq from 'lodash/uniq';
import Actor from '../../models/actor';
import * as types from './controlTypes';

const postControl = (data, nodeId, museumId, callback) => {
  const url = `${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls`;
  return {
    types: [types.ADD, types.ADD_SUCCESS, types.ADD_FAIL],
    promise: (client) => client.post(url, { data }),
    callback
  };
};

export const addControl = (nodeId, museumId, controlData, callback) => {
  return postControl(mapToBackend(controlData, {}, nodeId), nodeId, museumId, callback);
};

export const addControlWithObservations = (nodeId, controlData, observationsData, museumId, callback) => {
  return postControl(mapToBackend(controlData, observationsData, nodeId), nodeId, museumId, callback);
};

export const loadControl = (nodeId, controlId, museumId, callback) => {
  return {
    types: [types.LOAD, types.LOAD_SUCCESS, types.LOAD_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${nodeId}/controls/${controlId}`)
        .then(control => {
          client.post(`${Config.magasin.urls.actor.baseUrl}/details`, { data: uniq([control.doneBy, control.registeredBy]) })
            .then(actors => resolve({
              ...control,
              ...Actor.getActorNames(actors, control.doneBy, control.registeredBy)
            })).catch(error => reject(error));
        }).catch(error => reject(error));
    }),
    callback
  };
};
