const LOAD = 'musit/observationcontrol/LOAD'
const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL'

const initialState = {
  data: [
    {
      id: 1,
      type: 'control',
      doneDate: '01.01.1983',
      types: { ControlTemperature: true,
        ControlHypoxicAir: null,
        ControlRelativeHumidity: null,
        ControlCleaning: null,
        ControlLightingCondition: null,
        ControlAlcohol: true,
        ControlGas: null,
        ControlMold: null,
        ControlPest: true,
        envdata: null },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 2,
      type: 'observation',
      doneDate: '01.01.1984',
      types: { ControlTemperature: true,
        ControlHypoxicAir: null,
        ControlRelativeHumidity: null,
        ControlCleaning: null,
        ControlLightingCondition: true,
        ControlAlcohol: false,
        ControlGas: null,
        ControlMold: null,
        envdata: null },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 3,
      type: 'observation',
      doneDate: '01.01.1984',
      types: { ControlTemperature: true,
        ControlHypoxicAir: true,
        ControlRelativeHumidity: true,
        ControlCleaning: true,
        ControlLightingCondition: true,
        ControlAlcohol: true,
        ControlGas: true,
        ControlMold: true,
        envdata: true },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 4,
      type: 'control',
      doneDate: '01.01.1984',
      types: { ControlTemperature: false,
        ControlHypoxicAir: false,
        ControlRelativeHumidity: false,
        ControlCleaning: false,
        ControlLightingCondition: false,
        ControlAlcohol: false,
        ControlGas: false,
        ControlMold: false,
        envdata: false },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 5,
      type: 'observation',
      doneDate: '01.01.1984',
      types: { ControlTemperature: null,
        ControlHypoxicAir: null,
        ControlRelativeHumidity: null,
        ControlCleaning: null,
        ControlLightingCondition: null,
        ControlAlcohol: true,
        ControlGas: null,
        ControlMold: null,
        envdata: null },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 6,
      type: 'control',
      doneDate: '01.01.1984',
      types: { ControlTemperature: false
         },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    }
  ]
}


const observationControlGridReducer = (state = initialState, action = { data: [] }) => {
  switch (action.type) {
    case LOAD: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }
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
    default:
      return state;
  }
}

export const loadControlsForNode = (id) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/event/v1/node/${id}/controls`)
  }
}
export const loadObservationsForNode = (id) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/event/v1/node/${id}/observations`)
  }
}

export default observationControlGridReducer
