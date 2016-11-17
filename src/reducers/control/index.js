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
const LOAD_ACTOR = 'musit/observation/actor/LOAD';
const LOAD_ACTOR_SUCCESS = 'musit/control/actor/LOAD_SUCCESS';
const LOAD_ACTOR_FAILURE = 'musit/control/actor/LOAD_FAILURE';

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
  case LOAD_ACTOR:
    return {
      ...state,
      loading: true,
      loaded: false
    };
  case LOAD_ACTOR_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: {
        ...state.data,
        ...Actor.getActorNames(action.result, state.data.doneBy, state.data.registeredBy)
      }
    };
  case LOAD_ACTOR_FAILURE:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
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

export const loadActors = (control) => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAILURE],
    promise: (client) => client.post('/api/actor/v1/person/details', { data: uniq([control.doneBy, control.registeredBy]) })
  };
};

export const loadControl = (nodeId, controlId, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`${Config.magasin.urls.storagefacility.baseUrl(99)}/${nodeId}/controls/${controlId}`),
    callback
  };
};
