import { mapToFrontend, mapToBackend } from '../mapper'
const INSERT = 'musit/storageunit-container/INSERT';
const UPDATE = 'musit/storageunit-container/UPDATE';
const INSERT_SUCCESS = 'musit/storageunit-container/INSERT_SUCCESS';
const INSERT_FAIL = 'musit/storageunit-container/INSERT_FAIL';
const LOAD = 'musit/storageunit-container/LOAD';
const LOAD_SUCCESS = 'musit/storageunit-container/LOAD_SUCCESS';
const LOAD_FAIL = 'musit/storageunit-container/LOAD_FAIL';

const initialState = {}

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
        data: mapToFrontend(action.result)
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

export const load = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/storagefacility/v1/storagenodes/${id}`),
    callback
  };
}

export const update = (data, callback) => {
  const url = `/api/storagefacility/v1/storagenodes/${data.id}`;
  const dataToPost = mapToBackend(data)
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client.put(url, { data: dataToPost }),
    callback
  };
}

export const insert = (parentId, data, callback) => {
  const url = `/api/storagefacility/v1/storagenodes${!parentId ? '/root' : ''}`;
  const dataToPost = mapToBackend(data, parentId)
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client.post(url, { data: dataToPost }),
    callback
  };
}
