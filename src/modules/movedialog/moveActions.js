import Config from '../../config';
import { apiUrl } from '../../shared/util';

export const MOVE_OBJECT = 'musit/move/object/start';
export const MOVE_OBJECT_SUCCESS = 'musit/move/object/success';
export const MOVE_OBJECT_FAILURE = 'musit/move/object/failure';
export const MOVE_NODE = 'musit/move/node/start';
export const MOVE_NODE_SUCCESS = 'musit/move/node/success';
export const MOVE_NODE_FAILURE = 'musit/move/node/failure';

export const moveObject = (objectId, destination, doneBy, museumId, callback) => {
  const data = {
    doneBy,
    destination,
    items: [].concat(objectId)
  };
  return {
    types: [MOVE_OBJECT, MOVE_OBJECT_SUCCESS, MOVE_OBJECT_FAILURE],
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
    types: [MOVE_NODE, MOVE_NODE_SUCCESS, MOVE_NODE_FAILURE],
    promise: (client) => client.put(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/moveNode`), { data }),
    callback
  };
};
