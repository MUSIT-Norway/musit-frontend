import Config from '../../config';
import { mapToBackend } from './mapper/to_backend';
import uniq from 'lodash/uniq';
import Actor from '../../models/actor';

const ADD = 'musit/control/ADD';
const ADD_SUCCESS = 'musit/control/ADD_SUCCESS';
const ADD_FAIL = 'musit/control/ADD_FAILURE';
const LOAD = 'musit/control/LOAD';
const LOAD_SUCCESS = 'musit/control/LOAD_SUCCESS';
const LOAD_FAIL = 'musit/control/LOAD_FAIL';

export const initialState = {};

const controlReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case ADD: {
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }
  case ADD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true
    };
  case ADD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  case LOAD:
    return {
      ...state,
      loading: true,
      loaded: false,
      data: {}
    };
  case LOAD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result
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

export default controlReducer;

export const addControl = (nodeId, controlData, observations, callback) => {
  const data = mapToBackend(controlData, observations, nodeId);
  const url = `${Config.magasin.urls.storagefacility.baseUrl(99)}/${nodeId}/controls`;
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post(url, { data }),
    callback
  };
};

export const loadControl = (nodeId, controlId, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(`${Config.magasin.urls.storagefacility.baseUrl(99)}/${nodeId}/controls/${controlId}`)
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
