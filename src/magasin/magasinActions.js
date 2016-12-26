import { apiUrl } from '../util';
import Config from '../config';
import * as types from './magasinTypes';

export const loadRoot = (id, museumId, currentPage, callback) => {
  let action = {};
  if (id) {
    action = {
      types: [types.LOAD_ONE, types.LOAD_ONE_SUCCESS, types.LOAD_ONE_FAIL],
      promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`)),
      callback
    };
  } else {
    action = {
      types: [types.LOAD_SEVERAL, types.LOAD_SEVERAL_SUCCESS, types.LOAD_SEVERAL_FAIL],
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
    types: [types.LOAD_SEVERAL, types.LOAD_SEVERAL_SUCCESS, types.LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(url),
    callback
  };
};

export const deleteUnit = (id, museumId, callback) => {
  return {
    types: [types.DELETE, types.DELETE_SUCCESS, types.DELETE_FAIL],
    promise: (client) => client.del(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`)),
    id,
    callback
  };
};

export const clearRoot = () => {
  return {
    type: types.CLEAR_ROOT
  };
};

export const loadObjects = (id, museumId, collectionId, currentPage, callback) => {
  const url = Config.magasin.urls.thingaggregate.baseUrl;
  return {
    types: [types.LOAD_OBJECTS, types.LOAD_OBJECTS_SUCCESS, types.LOAD_OBJECTS_FAIL],
    promise: (client) => client.get(
      apiUrl(
        `${url(museumId)}/node/${id}/objects?${collectionId.getQuery()}&page=${currentPage || 1}&limit=${Config.magasin.limit}`
      )
    ),
    callback
  };
};

export const loadStats = (id, museumId) => {
  return {
    types: [types.LOAD_STATS, types.LOAD_STATS_SUCCESS, types.LOAD_STATS_FAILURE],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/storagenodes/${id}/stats`))
  };
};

export const clearStats = () => {
  return {
    type: types.CLEAR_STATS
  };
};