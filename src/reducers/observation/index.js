import { mapToFrontEnd, mapToBackEnd } from './mapper'
const ADD = 'musit/observation/ADD'
const ADD_SUCCESS = 'musit/observation/ADD_SUCCESS'
const ADD_FAIL = 'musit/observation/ADD_FAIL'
const LOAD = 'musit/observation/LOAD'
const LOAD_SUCCESS = 'musit/observation/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/observation/LOAD_FAIL'
const LOAD_ACTOR = 'musit/observation/actor/LOAD'
const LOAD_ACTOR_SUCCESS = 'musit/observation/actor/LOAD_SUCCESS'
const LOAD_ACTOR_FAIL = 'musit/observation/actor/LOAD_FAIL'
export const initialState = {
  data: {
    doneBy: '',
    doneDate: '',
    registeredBy: '',
    registeredDate: '',
    observations: []
  }
}

const observationReducer = (state = initialState, action = {}) => {
  let d = {}
  switch (action.type) {
    case ADD:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: {}
      };
    case ADD_SUCCESS:
      d = mapToFrontEnd(action.result)
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
      }
    case LOAD:
      return {
        ...state,
        loading: true,
        loaded: false,
        data: {}
      };
    case LOAD_SUCCESS:
      d = mapToFrontEnd(action.result)
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
        data: { ...state.data, doneBy: action.result }
      };
    case LOAD_ACTOR_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: { ...state.data, doneBy: action.error }
      };
    default:
      return state;
  }
}

export default observationReducer;

export const addObservation = (data, id, callback) => {
  const action = 'post'
  let url = ''
  if (id) {
    url = `/api/event/v1/node/${id}/observation`
  } else {
    url = '/api/event/v1/event'
  }
  const dataToPost = mapToBackEnd(data)
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client[action](url, { data: dataToPost }),
    callback
  };
}

export const getActorNameFromId = (id) => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAIL],
    promise: (client) => client.get(`/api/actor/v1/person/${id}`)
  }
}

export const loadObservation = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`api/event/v1/event/${id}`),
    callback
  }
}
