import { parseFloatFromString, formatFloatToString } from '../../../util'

const INSERT = 'musit/storageunit-container/INSERT';
const UPDATE = 'musit/storageunit-container/UPDATE';
const INSERT_SUCCESS = 'musit/storageunit-container/INSERT_SUCCESS';
const INSERT_FAIL = 'musit/storageunit-container/INSERT_FAIL';
const LOAD = 'musit/storageunit-container/LOAD';
const LOAD_SUCCESS = 'musit/storageunit-container/LOAD_SUCCESS';
const LOAD_FAIL = 'musit/storageunit-container/LOAD_FAIL';

const initialState = {}

const mapToFrontend = (data) => {
  return {
    ...data,
    area: formatFloatToString(data.area),
    areaTo: formatFloatToString(data.areaTo),
    height: formatFloatToString(data.height),
    heightTo: formatFloatToString(data.heightTo),
    environmentRequirement: { ...data.environmentRequirement,
      temperature: formatFloatToString(data.environmentRequirement.temperature),
      temperatureTolerance: formatFloatToString(data.environmentRequirement.temperatureTolerance),
      hypoxicAir: formatFloatToString(data.environmentRequirement.hypoxicAir),
      hypoxicAirTolerance: formatFloatToString(data.environmentRequirement.hypoxicAirTolerance),
      relativeHumidity: formatFloatToString(data.environmentRequirement.relativeHumidity),
      relativeHumidityTolerance: formatFloatToString(data.environmentRequirement.relativeHumidityTolerance)
    }
  }
}

const mapToBackend = (data, parentId) => {
  return {
    ...data,
    groupRead: 'foo', // Must be removed
    isPartOf: parentId ? parentId * 1 : data.isPartOf,
    area: parseFloatFromString(data.area),
    areaTo: parseFloatFromString(data.areaTo),
    height: parseFloatFromString(data.height),
    heightTo: parseFloatFromString(data.heightTo),
    environmentRequirement: data.environmentRequirement ? { ...data.environmentRequirement,
      temperature: parseFloatFromString(data.environmentRequirement.temperature),
      temperatureTolerance: parseFloatFromString(data.environmentRequirement.temperatureTolerance),
      hypoxicAir: parseFloatFromString(data.environmentRequirement.hypoxicAir),
      hypoxicAirTolerance: parseFloatFromString(data.environmentRequirement.hypoxicAirTolerance),
      relativeHumidity: parseFloatFromString(data.environmentRequirement.relativeHumidity),
      relativeHumidityTolerance: parseFloatFromString(data.environmentRequirement.relativeHumidityTolerance)
    } : {},
    environmentAssessment: data.environmentAssessment || {},
    securityAssessment: data.securityAssessment || {}
  }
}

const storageUnitContainerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case INSERT:
      return {
        ...state,
        loading: true,
      };
    case INSERT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case INSERT_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: action.error
      };
    case UPDATE:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data
      };
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: mapToFrontend(action.result)
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    default:
      return state
  }
}

export default storageUnitContainerReducer;

export const load = (id) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/storageadmin/v1/storageunit/${id}`)
  };
}

export const update = (data, callback) => {
  const url = `/api/storageadmin/v1/storageunit/${data.id}`;
  const dataToPost = mapToBackend(data)
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client.put(url, { data: dataToPost }),
    callback
  };
}

export const insert = (parentId, data, callback) => {
  const url = '/api/storageadmin/v1/storageunit';
  const dataToPost = mapToBackend(data, parentId)
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client.post(url, { data: dataToPost }),
    callback
  };
}
