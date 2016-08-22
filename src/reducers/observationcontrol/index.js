const LOAD = 'musit/observationcontrol/LOAD'
const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL'

export const initialState = {
  data: {
    doneBy: '',
    doneDate: '',
    registeredBy: '',
    registeredDate: '',
    observations: []
  }
}

const observationControlReducer = (state = initialState, action = {}) => {
  switch (action.type) {
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

export default observationControlReducer;

export const loadObservationControl = (id) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`api/event/v1/event/${id}`)
  }
}
