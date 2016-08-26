import { mapToBackend } from './mapper/to_backend'

const ADD = 'musit/control/ADD'
const ADD_SUCCESS = 'musit/control/ADD_SUCCESS'
const ADD_FAIL = 'musit/control/ADD_FAILURE'

const initialState = {
  doneBy: '',
  doneDate: '',
  data: {
    temperatureOK: null,
    inertAirOK: null,
    gasOK: null,
    lightConditionsOK: null,
    cleaningOK: null,
    alchoholOK: null,
    moldFungusOK: null,
    relativeHumidityOK: null,
    pestOK: null,
    storageUnit: null,
    temperature: '12',
    temperatureTolerance: '2',
    relativeHumidity: '89',
    relativeHumidityInterval: '4',
    inertAir: '56',
    inertAirInterval: '4',
    light: 'Mørkt',
    cleaning: 'Gullende rent',
    doneDate: null, // moment(),
    doneBy: null // this.props.user ? this.props.user.name : ''
  }
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
        loaded: true,
        data: action.result
      };
    case ADD_FAIL:
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

export default controlReducer;

export const addControl = (controlData, callback, id) => {
  const data = mapToBackend(controlData)
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
