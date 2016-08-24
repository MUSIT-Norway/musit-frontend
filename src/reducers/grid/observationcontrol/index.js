const LOAD = 'musit/observationcontrol/LOAD'
const LOAD_SUCCESS = 'musit/observationcontrol/LOAD_SUCCESS'
const LOAD_FAIL = 'musit/observationcontrol/LOAD_FAIL'

const initialState = { data: [] }
const initialState1 = {
  data: [
    {
      id: 1,
      type: 'control',
      doneDate: '01.01.1983',
      types: { temperature: true,
        inertAir: null,
        relativeHumidity: null,
        cleaning: null,
        lightCondition: null,
        alchohol: true,
        gas: null,
        mold: null,
        pest: true,
        envdata: null },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 2,
      type: 'observation',
      doneDate: '01.01.1984',
      types: { temperature: true,
        inertAir: null,
        relativeHumidity: null,
        cleaning: null,
        lightCondition: true,
        alchohol: false,
        gas: null,
        mold: null,
        envdata: null },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 3,
      type: 'observation',
      doneDate: '01.01.1984',
      types: { temperature: true,
        inertAir: true,
        relativeHumidity: true,
        cleaning: true,
        lightCondition: true,
        alchohol: true,
        gas: true,
        mold: true,
        envdata: true },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 4,
      type: 'control',
      doneDate: '01.01.1984',
      types: { temperature: false,
        inertAir: false,
        relativeHumidity: false,
        cleaning: false,
        lightCondition: false,
        alchohol: false,
        gas: false,
        mold: false,
        envdata: false },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 5,
      type: 'observation',
      doneDate: '01.01.1984',
      types: { temperature: null,
        inertAir: null,
        relativeHumidity: null,
        cleaning: null,
        lightCondition: null,
        alchohol: true,
        gas: null,
        mold: null,
        envdata: null },
      doneBy: 'Blablabla...',
      registeredDate: '01.01.1983',
      registeredBy: 'Blabla...'
    },
    {
      id: 6,
      type: 'control',
      doneDate: '01.01.1984',
      types: { temperature: false
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
