import Config from '../../../config'
import { apiUrl } from '../../../util'
import { sortObject } from '../../../util/sort'

export const LOAD = 'musit/observationcontrol/LOAD'
export const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS'
export const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL'
export const LOAD_ACTOR = 'musit/observationcontrol/LOAD_ACTOR'
export const LOAD_ACTOR_SUCCESS = 'musit/observationcontrol/LOAD_ACTOR_SUCCESS'
export const LOAD_ACTOR_FAILURE = 'musit/observationcontrol/LOAD_ACTOR_FAILURE'

const initialState = { data: [] }
import 'whatwg-fetch';

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
        data: sortObject(sortObject(action.result, 'id', 'number', false), 'doneDate', null, false)
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    case LOAD_ACTOR:
      return {
        ...state,
        loadingActors: true,
        loadedActors: false
      };
    case LOAD_ACTOR_SUCCESS:
      return {
        ...state,
        loadingActors: false,
        loadedActors: true,
        data: state.data.map((data) => {
          const actor = action.result.find((a) => a.id === data.doneBy);
          return {
            ...data,
            doneBy: actor ? actor.fn : data.doneBy
          }
        })
      };
    case LOAD_ACTOR_FAILURE:
      return {
        ...state,
        loadingActors: false,
        loadedActors: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const loadActor = (r) => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAILURE],
    promise: (client) => client.post(apiUrl('/api/actor/v1/person/details'), r)
  }
}

export const loadControlsAndObservationsForNode = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}/events`)),
    callback
  }
}

export default observationControlGridReducer
