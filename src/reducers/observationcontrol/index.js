const LOAD = 'musit/observationcontrol/LOAD'
const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL'

export const initialState = {
  data: [{
    id: 1,
    eventType: 'controlEvent',
    doneBy: '',
    doneDate: '',
    registeredBy: '',
    registeredDate: '',
    observations: []
  },
    {
      id: 2,
      eventType: 'controlEvent',
      doneBy: '',
      doneDate: '',
      registeredBy: '',
      registeredDate: '',
      temperatureOK: false,
      inertAirOK: true,
      gasOK: true,
      lightConditionsOK: false,
      cleaningOK: false,
      alchoholOK: false,
      moldFungusOK: true,
      relativeHumidityOK: true,
      pestOK: false,
      storageUnit: false
    }, {
      id: 3,
      eventType: 'observationEvent',
      doneBy: '',
      doneDate: '',
      registeredBy: '',
      registeredDate: '',
      observations: []
    }, {
      id: 4,
      eventType: 'controlEvent',
      doneBy: '',
      doneDate: '',
      registeredBy: '',
      registeredDate: '',
      temperatureOK: true,
      inertAirOK: true,
      gasOK: false,
      lightConditionsOK: false,
      cleaningOK: true,
      alchoholOK: false,
      moldFungusOK: true,
      relativeHumidityOK: true,
      pestOK: true,
      storageUnit: true
    }, {
      id: 5,
      eventType: 'observationEvent',
      doneBy: '',
      doneDate: '',
      registeredBy: '',
      registeredDate: '',
      observations: []
    }]
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
