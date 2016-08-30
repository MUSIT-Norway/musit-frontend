const LOAD = 'musit/observationcontrol/LOAD'
const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL'
const LOAD_ACTOR = 'musit/observationcontrol/LOAD_ACTOR'
const LOAD_ACTOR_SUCCESS = 'musit/observationcontrol/LOAD_ACTOR_SUCCESS'
const LOAD_ACTOR_FAILURE = 'musit/observationcontrol/LOAD_ACTOR_FAILURE'

const initialState = { data: [] }

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
        loading: true,
        loaded: false
      };
    case LOAD_ACTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: state.data.map((e) => { return { ...e, doneName: action.result.fn } })
      };
    case LOAD_ACTOR_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const loadActor = () => {
  return {
    types: [LOAD_ACTOR, LOAD_ACTOR_SUCCESS, LOAD_ACTOR_FAILURE],
    promise: (client) => client.post('/api/actor/v1/person/details', { data: [1, 2] })
  }
}

export const loadControlsForNode = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/event/v1/node/${id}/controls`),
    callback
  }
}
export const loadObservationsForNode = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/event/v1/node/${id}/observations`),
    callback
  }
}

export const loadControlsAndObservationsForNode = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/event/v1/node/${id}/controlsAndObservations`),
    callback
  }
}

export default observationControlGridReducer
