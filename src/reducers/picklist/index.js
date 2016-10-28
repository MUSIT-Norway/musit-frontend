import { sortObject, createBreadcrumbPath, apiUrl } from '../../util'
import Config from '../../config'

export const TYPES = {
  NODE: 'NODE',
  OBJECT: 'OBJECT'
}

// Node
export const CLEAR_NODES = 'musit/picklist/CLEAR_NODES';
export const ADD_NODE = 'musit/picklist/ADD_NODE';
export const REMOVE_NODE = 'musit/picklist/REMOVE_NODE';
export const TOGGLE_NODE = 'musit/picklist/TOGGLE_NODE';

// Load Node
export const LOAD_ONE_NODE = 'musit/picklist/LOAD_ONE_NODE'
export const LOAD_ONE_NODE_SUCCESS = 'musit/picklist/LOAD_ONE_NODE_SUCCESS'
export const LOAD_ONE_NODE_FAIL = 'musit/picklist/LOAD_ONE_NODE_FAIL'

// Object
export const CLEAR_OBJECTS = 'musit/picklist/CLEAR_OBJECTS';
export const ADD_OBJECT = 'musit/picklist/ADD_OBJECT';
export const REMOVE_OBJECT = 'musit/picklist/REMOVE_OBJECT';
export const TOGGLE_OBJECT = 'musit/picklist/TOGGLE_OBJECT';

// Load object
export const LOAD_ONE_OBJECT = 'musit/picklist/LOAD_ONE_OBJECT'
export const LOAD_ONE_OBJECT_SUCCESS = 'musit/picklist/LOAD_ONE_OBJECT_SUCCESS'
export const LOAD_ONE_OBJECT_FAIL = 'musit/picklist/LOAD_ONE_OBJECT_FAIL'

// Empty state
const initialState = {
  [TYPES.NODE]: [],
  [TYPES.OBJECT]: []
};

const toggleItem = (type) => (state, action) => {
  const items = [].concat(action.item)
  const toggle = (node) => typeof action.on !== 'undefined' ? action.on : !node.marked
  const nodes = state[type].map(node => ({
    ...node,
    marked: items.indexOf(node.value) > -1 ? toggle(node) : node.marked
  }))
  return { ...state, [type]: nodes };
};

const removeItem = (type) => (state, action) => {
  const items = [].concat(action.item)
  const nodes = state[type].filter(node => items.findIndex(i => i.id === node.value.id) === -1)
  return { ...state, [type]: nodes }
};


const addItem = (type) => (state, action) => {
  if (state[type].findIndex(node => action.item.id === node.value.id) > -1) {
    return state;
  }
  const nodes = state[type].concat({ marked: false, value: action.item, path: action.path})
  console.log(nodes)
  const sortedNodes =  sortObject(nodes, 'value.name')
  console.log(sortedNodes)
  return {
    ...state,
    [type]: sortedNodes
  };
};

const clearItems = (type) => (state) => ({
  ...state,
  [type]: []
});

export const getPath = (pathStr) => {
  const pathStrArr = pathStr.substr(1, pathStr.length - 2).split(',')
  // EX: ,1,2,3,19, will be transformed to 1,2,3,
  return `,${pathStrArr.slice(0, -1).join(',').toString()},`
}


const loadItem = (state) => state

const loadItemFail = (state, action) => ({ ...state, error: action.error })

const loadItemSuccess = (type) => (state, action) => {
  const modifiedItems = state[type].map((n) => {
    if (n.value.id === action.id) {
      const newPath = createBreadcrumbPath(
          type === TYPES.OBJECT ? action.result.path : getPath(action.result.path),
          action.result.pathNames
      )
      return {
        ...n,
        path: newPath
      }
    }
    return n
  })
  return {
    ...state,
    [type]: modifiedItems
  }
};

const NODE_ACTION_HANDLERS = {
  [CLEAR_NODES]: clearItems(TYPES.NODE),
  [ADD_NODE]: addItem(TYPES.NODE),
  [REMOVE_NODE]: removeItem(TYPES.NODE),
  [TOGGLE_NODE]: toggleItem(TYPES.NODE),
  [LOAD_ONE_NODE]: loadItem,
  [LOAD_ONE_NODE_SUCCESS]: loadItemSuccess(TYPES.NODE),
  [LOAD_ONE_NODE_FAIL]: loadItemFail
};

const OBJECT_ACTION_HANDLERS = {
  [CLEAR_OBJECTS]: clearItems(TYPES.OBJECT),
  [ADD_OBJECT]: addItem(TYPES.OBJECT),
  [REMOVE_OBJECT]: removeItem(TYPES.OBJECT),
  [TOGGLE_OBJECT]: toggleItem(TYPES.OBJECT),
  [LOAD_ONE_OBJECT]: loadItem,
  [LOAD_ONE_OBJECT_SUCCESS]: loadItemSuccess(TYPES.OBJECT),
  [LOAD_ONE_OBJECT_FAIL]: loadItemFail
};

export default (state = initialState, action = {}) => {
  if (NODE_ACTION_HANDLERS[action.type]) {
    return NODE_ACTION_HANDLERS[action.type](state, action)
  }
  if (OBJECT_ACTION_HANDLERS[action.type]) {
    return OBJECT_ACTION_HANDLERS[action.type](state, action)
  }
  return state
};

// NODES Actions
export const clearNodes = () => ({ type: CLEAR_NODES })
export const addNode = (item, path = []) => ({ type: ADD_NODE, item, path })
export const removeNode = (item) => ({ type: REMOVE_NODE, item })
export const toggleNode = (item, on) => ({ type: TOGGLE_NODE, item, on })

// OBJECTS Actions
export const clearObjects = () => ({ type: CLEAR_OBJECTS })
export const addObject = (item, path = []) => ({ type: ADD_OBJECT, item, path })
export const removeObject = (item) => ({ type: REMOVE_OBJECT, item })
export const toggleObject = (item, on) => ({ type: TOGGLE_OBJECT, item, on })

// Action for load node
export const refreshNode = (id) => {
  return {
    types: [LOAD_ONE_NODE, LOAD_ONE_NODE_SUCCESS, LOAD_ONE_NODE_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}`)),
    id
  }
}

// Action for load object
export const refreshObject = (id) => {
  return {
    types: [LOAD_ONE_OBJECT, LOAD_ONE_OBJECT_SUCCESS, LOAD_ONE_OBJECT_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/objects/${id}/currentlocation`)),
    id
  }
}
