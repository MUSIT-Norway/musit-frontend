import Config from '../../../../config';
import { apiUrl } from '../../../../shared/util';

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

const getUpdatedBy = (client, node, resolve) => {
  client.get(apiUrl(`${Config.magasin.urls.actor.baseUrl}/${node.updatedBy}`))
    .then(actor => resolve({
      ...node,
      updatedByName: actor.fn
    })).catch(() => resolve(node));
};

export const load = (id, museumId, callback) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`))
        .then(node => getUpdatedBy(client, node, resolve, reject))
        .catch(error => reject(error));
    }),
    callback
  };
};

export const update = (data, museumId, callback) => {
  const dataToPost = mapToBackend(data);
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.put(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${data.id}`), { data: dataToPost })
          .then(node => getUpdatedBy(client, node, resolve, reject))
          .catch(error => reject(error));
    }),
    callback
  };
};

export const insert = (parentId, museumId, data, callback) => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}${!parentId ? '/root' : ''}`);
  const dataToPost = mapToBackend(data, parentId);
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client.post(url, { data: dataToPost }),
    callback
  };
};
