import Config from '../../config';
import { apiUrl } from '../../util';
import * as types from './moveDialogTypes';

export const moveObject = (objectId, destination, doneBy, museumId, callback) => {
  const data = {
    doneBy,
    destination,
    items: [].concat(objectId)
  };
  return {
    types: [types.MOVE_OBJECT, types.MOVE_OBJECT_SUCCESS, types.MOVE_OBJECT_FAILURE],
    promise: (client) => client.put(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveObject`), { data }),
    callback
  };
};

export const moveNode = (nodeId, destination, doneBy, museumId, callback) => {
  const data = {
    doneBy,
    destination,
    items: [].concat(nodeId)
  };
  return {
    types: [types.MOVE_NODE, types.MOVE_NODE_SUCCESS, types.MOVE_NODE_FAILURE],
    promise: (client) => client.put(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveNode`), { data }),
    callback
  };
};

export const loadNode = (id, museumId) => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`);
  return {
    types: [types.LOAD_NODE, types.LOAD_NODE_SUCCESS, types.LOAD_NODE_FAIL],
    promise: (client) => client.get(url)
  };
};

export const loadChildren = (id, museumId, currentPage, perPage, callback) => {
  let url;
  if (id) {
    url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}/children?limit=${perPage}&page=${currentPage}`);
  } else {
    url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/root`);
  }
  return {
    types: [types.LOAD_CHILDREN, types.LOAD_CHILDREN_SUCCESS, types.LOAD_CHILDREN_FAIL],
    promise: (client) => client.get(url),
    callback
  };
};

export const clear = () => {
  return {
    type: types.CLEAR
  };
};