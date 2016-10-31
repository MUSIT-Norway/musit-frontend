import Config from '../../../config'
import { apiUrl } from '../../../util'
import { getPath } from '../../helper'

export const LOAD = 'musit/movehistory/LOAD'
export const LOAD_SUCCESS = 'musit/movehistory/LOAD_SUCCESS'
export const LOAD_FAIL = 'musit/movehistory/LOAD_FAIL'
export const LOAD_ACTOR = 'musit/movehistory/LOAD_ACTOR'
export const LOAD_ACTOR_SUCCESS = 'musit/movehistory/LOAD_ACTOR_SUCCESS'
export const LOAD_ACTOR_FAIL = 'musit/movehistory/LOAD_ACTOR_FAIL'
export const CLEAR_SUCCESS = 'musit/movehistory/CLEAR_SUCCESS'

const initialState = { data:[] }

const moveHistoryReducer = (state = initialState, action) => {
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
        data: action.result.map(data => {
          return {
            ...data,
            from: {
              ...data.from,
              breadcrumb: getPath(data.from.path, data.from.pathNames)
            },
            to: {
              ...data.to,
              breadcrumb: getPath(data.to.path, data.to.pathNames)
            }
          }
        })
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
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
        data: state.data.map((e) => {
          const actor = action.result.find((a) => a.id === e.doneBy);
          return { ...e,
            doneBy: actor ? actor.fn : e.doneBy
          }
        })
      };
    case LOAD_ACTOR_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: { ...state.data, actor: action.error }
      }
    case CLEAR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: action.result
      }
    default:
      return state;
  }
}

export default moveHistoryReducer;

export const loadActor = (r) => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAIL],
    promise: (client) => client.post(apiUrl('/api/actor/v1/person/details'), r)
  }
}

export const loadMoveHistoryForObject = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/objects/${id}/locations`)),
    callback
  }
}

export const clearMoveHistoryForObject = () => {
  return {
    type: CLEAR_SUCCESS,
    result: []
  }
}
