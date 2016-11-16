import Config from '../../../config';
import { apiUrl } from '../../../util';

import { mapToFrontend, mapToBackend } from '../mapper';
export const INSERT = 'musit/storageunit-container/INSERT';
export const UPDATE = 'musit/storageunit-container/UPDATE';
export const INSERT_SUCCESS = 'musit/storageunit-container/INSERT_SUCCESS';
export const INSERT_FAIL = 'musit/storageunit-container/INSERT_FAIL';
export const LOAD = 'musit/storageunit-container/LOAD';
export const LOAD_SUCCESS = 'musit/storageunit-container/LOAD_SUCCESS';
export const LOAD_FAIL = 'musit/storageunit-container/LOAD_FAIL';

const initialState = {};

const storageUnitContainerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case INSERT:
    return {
      ...state,
      loading: true
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
      loaded: true,
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
      loading: true
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
    };
  default:
    return state;
  }
};

export default storageUnitContainerReducer;

export const load = (id, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}`)),
    callback
  };
};

export const update = (data, callback) => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/${data.id}`);
  const dataToPost = mapToBackend(data);
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client.put(url, { data: dataToPost }),
    callback
  };
};

export const insert = (parentId, data, callback) => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}${!parentId ? '/root' : ''}`);
  const dataToPost = mapToBackend(data, parentId);
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client.post(url, { data: dataToPost }),
    callback
  };
};
