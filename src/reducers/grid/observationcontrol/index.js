import Config from '../../../config';
import { apiUrl } from '../../../util';
import { getActorNames } from '../../../util/actor';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

export const LOAD = 'musit/observationcontrol/LOAD';
export const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS';
export const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL';
export const LOAD_ACTOR = 'musit/observationcontrol/LOAD_ACTOR';
export const LOAD_ACTOR_SUCCESS = 'musit/observationcontrol/LOAD_ACTOR_SUCCESS';
export const LOAD_ACTOR_FAILURE = 'musit/observationcontrol/LOAD_ACTOR_FAILURE';

const initialState = { data: [] };

const observationControlGridReducer = (state = initialState, action) => {
  switch (action.type) {
  case LOAD:
    return {
      ...state,
      loading: true,
      loaded: false
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
      error: action.error
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
      data: state.data.map((data) => ({
        ...data,
        ...getActorNames(action.result, data.doneBy, data.registeredBy)
      }))
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

export const loadActors = (rows) => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAILURE],
    promise: (client) =>
      client.post(apiUrl('/api/actor/v1/person/details'), { data: uniq(flatten(rows.map(r => [r.doneBy, r.registeredBy]))) })
  };
};

export const loadControlsAndObservationsForNode = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(99)}/${id}/events`)),
    callback
  };
};

export default observationControlGridReducer;
