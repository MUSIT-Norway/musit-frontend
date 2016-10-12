
const MOVE_OBJECT = 'musit/move/object/start'
const MOVE_OBJECT_SUCCESS = 'musit/move/object/succes'
const MOVE_OBJECT_FAILURE = 'musit/move/object/failure'
const MOVE_NODE = 'musit/move/node/start'
const MOVE_NODE_SUCCESS = 'musit/move/node/succes'
const MOVE_NODE_FAILURE = 'musit/move/node/failure'

const ACTIONS = {
  [MOVE_OBJECT]: () => ({ loading: true, loaded: false }),
  [MOVE_OBJECT_SUCCESS]: () => ({ loading: false, loaded: true }),
  [MOVE_OBJECT_FAILURE]: (state, action) => ({ loading: false, loaded: false, error: action.error }),
  [MOVE_NODE]: () => ({ loading: true, loaded: false }),
  [MOVE_NODE_SUCCESS]: () => ({ loading: false, loaded: true }),
  [MOVE_NODE_FAILURE]: (state, action) => ({ loading: false, loaded: false, error: action.error })
}

export default (state = {}, action) => {
  if (ACTIONS[action.type]) {
    return ACTIONS[action.type](state, action)
  }
  return state
}

export const moveObject = (objectId, destination, doneBy, callback) => {
  const data = {
    doneBy,
    destination,
    items: [].concat(objectId)
  }
  return {
    types: [MOVE_OBJECT, MOVE_OBJECT_SUCCESS, MOVE_OBJECT_FAILURE],
    promise: (client) => client.put('/api/storagefacility/v1/storagenodes/moveObject', { data }),
    callback
  }
}

export const moveNode = (nodeId, destination, doneBy, callback) => {
  const data = {
    doneBy,
    destination,
    items: [].concat(nodeId)
  }
  return {
    types: [MOVE_OBJECT, MOVE_OBJECT_SUCCESS, MOVE_OBJECT_FAILURE],
    promise: (client) => client.put('/api/storagefacility/v1/storagenodes/moveNode', { data }),
    callback
  }
}
