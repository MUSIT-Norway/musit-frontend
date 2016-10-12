import Config from '../../../config'

const LOAD = 'musit/observationcontrol/LOAD'
const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL'
const LOAD_ACTOR = 'musit/observationcontrol/LOAD_ACTOR'
const LOAD_ACTOR_SUCCESS = 'musit/observationcontrol/LOAD_ACTOR_SUCCESS'
const LOAD_ACTOR_FAILURE = 'musit/observationcontrol/LOAD_ACTOR_FAILURE'

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
        data: action.result
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
        data: state.data.map((e) => {
          const actor = action.result.find((a) => a.id === e.doneBy.actorId);
          return { ...e,
            doneBy: actor ? actor.fn : e.doneBy
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
    promise: (client) => client.post('/api/actor/v1/person/details', r)
  }
}

export const loadControlsAndObservationsForNode = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => fetch(`${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}/events`).then(result => result.json()),
    callback
  }
}

export default observationControlGridReducer
