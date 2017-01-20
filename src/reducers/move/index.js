import Config from '../../config';
import { apiUrl } from '../../util';

export const MOVE_OBJECT = 'musit/move/object/start';
export const MOVE_OBJECT_SUCCESS = 'musit/move/object/success';
export const MOVE_OBJECT_FAILURE = 'musit/move/object/failure';
export const MOVE_NODE = 'musit/move/node/start';
export const MOVE_NODE_SUCCESS = 'musit/move/node/success';
export const MOVE_NODE_FAILURE = 'musit/move/node/failure';

const ACTIONS = {
  [MOVE_OBJECT]: () => ({ loading: true, loaded: false }),
  [MOVE_OBJECT_SUCCESS]: () => ({ loading: false, loaded: true }),
  [MOVE_OBJECT_FAILURE]: (state, action) => ({ loading: false, loaded: false, error: action.error }),
  [MOVE_NODE]: () => ({ loading: true, loaded: false }),
  [MOVE_NODE_SUCCESS]: () => ({ loading: false, loaded: true }),
  [MOVE_NODE_FAILURE]: (state, action) => ({ loading: false, loaded: false, error: action.error })
};

export default (state = {}, action) => {
  if (ACTIONS[action.type]) {
    return ACTIONS[action.type](state, action);
  }
  return state;
};

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