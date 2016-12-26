import Config from '../config';
import { apiUrl } from '../util';
import { mapper } from '../magasin';
const { toFrontend, toBackend } = mapper;
import * as types from './storageTypes';

const getUpdatedBy = (client, node, resolve) => {
  client.get(apiUrl(`${Config.magasin.urls.actor.baseUrl}/${node.updatedBy}`))
    .then(actor => resolve({
      ...node,
      updatedByName: actor.fn
    })).catch(() => resolve(node));
};

export const load = (id, museumId, callback) => {
  return {
    types: [types.LOAD, types.LOAD_SUCCESS, types.LOAD_FAIL],
    promise: (client) => new Promise((resolve, reject) => {
      client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/${id}`))
        .then(node => getUpdatedBy(client, node, resolve, reject))
        .catch(error => reject(error));
    }),
    callback
  };
};

export const update = (data, museumId, callback) => {
  const dataToPost = toBackend(data);
  return {
    types: [types.UPDATE, types.UPDATE_SUCCESS, types.UPDATE_FAIL],
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
  const dataToPost = toBackend(data, parentId);
  return {
    types: [types.INSERT, types.INSERT_SUCCESS, types.INSERT_FAIL],
    promise: (client) => client.post(url, { data: dataToPost }),
    callback
  };
};

export const updateState = (data) => {
  return {
    type: types.UPDATE_STATE,
    data: toFrontend(data)
  };
};

export const clearState = () => {
  return {
    type: types.CLEAR_STATE
  };
};
