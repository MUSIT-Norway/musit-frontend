import Config from '../../config';
import { apiUrl } from '../../util';
import mapToBackEnd from './mapper/to_backend';
import mapToFrontEnd from './mapper/to_frontend';
import uniq from 'lodash/uniq';
import Actor from '../../models/actor';

export const ADD = 'musit/observation/ADD';
export const ADD_SUCCESS = 'musit/observation/ADD_SUCCESS';
export const ADD_FAIL = 'musit/observation/ADD_FAIL';
export const LOAD = 'musit/observation/LOAD';
export const LOAD_SUCCESS = 'musit/observation/LOAD_SUCCESS';
export const LOAD_FAIL = 'musit/observation/LOAD_FAIL';
export const initialState = {
  data: {
    observations: []
  }
};

const observationReducer = (state = initialState, action = {}) => {
  let d = {};
  switch (action.type) {
  case ADD:
    return {
      ...state,
      loading: true,
      loaded: false,
      data: {}
    };
  case ADD_SUCCESS:
    d = mapToFrontEnd(action.result);
    return {
      ...state,
      loading: false,
      loaded: true,
      data: d
    };
  case ADD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      data: action.error
    };
  case LOAD:
    return {
      ...state,
      loading: true,
      loaded: false,
      data: {}
    };
  case LOAD_SUCCESS:
    d = mapToFrontEnd(action.result);
    return {
      ...state,
      loading: false,
      loaded: true,
      data: d
    };
  case LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      data: action.error
    };
  default:
    return state;
  }
};

export default observationReducer;

export const addObservation = (nodeId, data, callback) => {
  const action = 'post';
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(99)}/${nodeId}/observations`);
  const dataToPost = mapToBackEnd(data, nodeId);
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client[action](url, { data: dataToPost }),
    callback
  };
};

export const loadObservation = (nodeId, observationId, callback) => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(99)}/${nodeId}/observations/${observationId}`);
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(url).then(observation => {
        client.post(apiUrl(`${Config.magasin.urls.actor.baseUrl}/details`), { data: uniq([observation.doneBy, observation.registeredBy]) })
            .then(actors =>
              resolve({
                ...observation,
                ...Actor.getActorNames(actors, observation.doneBy, observation.registeredBy)
              })
            ).catch(error => reject(error));
      }).catch(error => reject(error));
    }),
    callback
  };
};
