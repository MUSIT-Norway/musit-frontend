import { mapToBackend } from './mapper/to_backend'

const ADD = 'musit/control/ADD'
const ADD_SUCCESS = 'musit/control/ADD_SUCCESS'
const ADD_FAIL = 'musit/control/ADD_FAILURE'
const LOAD = 'musit/control/LOAD'
const LOAD_SUCCESS = 'musit/control/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/control/LOAD_FAIL'

export const initialState = {

}

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
      }
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
}

export default controlReducer;

export const addControl = (id, controlData, observations, callback) => {
  const data = mapToBackend(controlData, observations)
  let url = ''
  if (id) {
    url = `/api/event/v1/node/${id}/control`
  } else {
    url = '/api/event/v1/event'
  }
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post(url, { data }),
    callback
  }
}

export const loadControl = (id) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`api/event/v1/event/${id}`)
  }
}
