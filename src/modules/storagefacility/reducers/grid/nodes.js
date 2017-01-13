import Config from '../../../../config';
import { mapToFrontend } from '../mapper';
import { apiUrl } from '../../../../util';

export const LOAD_SEVERAL = 'musit/storageunit-grid/LOAD_SEVERAL';
export const LOAD_SEVERAL_SUCCESS = 'musit/storageunit-grid/LOAD_SEVERAL_SUCCESS';
export const LOAD_SEVERAL_FAIL = 'musit/storageunit-grid/LOAD_SEVERAL_FAIL';
export const LOAD_ONE = 'musit/storageunit-grid/LOAD_ONE';
export const LOAD_ONE_SUCCESS = 'musit/storageunit-grid/LOAD_ONE_SUCCESS';
export const LOAD_ONE_FAIL = 'musit/storageunit-grid/LOAD_ONE_FAIL';
export const CLEAR_ROOT = 'musit/storageunit-grid/CLEAR_ROOT';
export const DELETE = 'musit/storageunit-grid/DELETE';
export const DELETE_SUCCESS = 'musit/storageunit-grid/DELETE_SUCCESS';
export const DELETE_FAIL = 'musit/storageunit-grid/DELETE_FAIL';

const initialState = {
  root: {
    data: {}
  }
};

const storageUnitGridReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case LOAD_SEVERAL:
    return {
      ...state,
      loading: true
    };
  case LOAD_SEVERAL_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result
    };
  case LOAD_SEVERAL_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  case LOAD_ONE_SUCCESS:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: true,
        data: mapToFrontend(action.result)
      }
    };
  case LOAD_ONE_FAIL:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: false,
        error: action.error
      }
    };
  case CLEAR_ROOT: {
    return {
      ...state,
      root: {}
    };
  }
  case DELETE:
    return {
      ...state,
      loading: true
    };
  case DELETE_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: []
    };
  case DELETE_FAIL:
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

export default storageUnitGridReducer;

export const loadRoot = (id, museumId, currentPage, callback) => {
  let action = {};
  if (id) {
    action = {
      types: [LOAD_ONE, LOAD_ONE_SUCCESS, LOAD_ONE_FAIL],
      promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`)),
      callback
    };
  } else {
    action = {
      types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
      promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/root`)),
      callback
    };
  }
  return action;
};

export const loadChildren = (id, museumId, currentPage, callback) => {
  const baseUrl = Config.magasin.urls.storagefacility.baseUrl(museumId);
  const url = apiUrl(`${baseUrl}/${id}/children?page=${currentPage || 1}&limit=${Config.magasin.limit}`);
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(url),
    callback
  };
};

export const deleteUnit = (id, museumId, callback) => {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: (client) => client.del(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`)),
    id,
    callback
  };
};

export const clearRoot = () => {
  return {
    type: CLEAR_ROOT
  };
};
