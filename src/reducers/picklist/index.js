export const TYPES = {
  NODE: 'NODE',
  OBJECT: 'OBJECT'
}

// Node
const CLEAR_NODES = 'musit/picklist/CLEAR_NODES';
const ADD_NODE = 'musit/picklist/ADD_NODE';
const REMOVE_NODE = 'musit/picklist/REMOVE_NODE';
const TOGGLE_NODE = 'musit/picklist/TOGGLE_NODE';

// Object
const CLEAR_OBJECTS = 'musit/picklist/CLEAR_OBJECTS';
const ADD_OBJECT = 'musit/picklist/ADD_OBJECT';
const REMOVE_OBJECT = 'musit/picklist/REMOVE_OBJECT';
const TOGGLE_OBJECT = 'musit/picklist/TOGGLE_OBJECT';

// Empty state
const initialState = {
  [TYPES.NODE]: [],
  [TYPES.OBJECT]: []
};

const toggleItem = (type) => (state, action) => {
  const items = [].concat(action.item)
  const toggle = (node) => (typeof action.on !== 'undefined' ? action.on : !node.marked)
  const nodes = state[type].map(node => ({
    ...node,
    marked: items.indexOf(node.value) > -1 ? toggle(node) : node.marked
  }))
  return { ...state, [type]: nodes };
};

const removeItem = (type) => (state, action) => {
  const items = [].concat(action.item)
  const nodes = state[type].filter(node => items.indexOf(node.value) === -1)
  return { ...state, [type]: nodes }
};

const addItem = (type) => (state, action) => {
  if (state[type].findIndex(node => action.item.id === node.value.id) > -1) {
    return state;
  }
  return {
    ...state,
    [type]: state[type].concat({ marked: false, value: action.item, path: action.path })
  };
};

const clearItems = (type) => (state) => ({
  ...state,
  [type]: []
});

const NODE_ACTION_HANDLERS = ({
  [CLEAR_NODES]: clearItems(TYPES.NODE),
  [ADD_NODE]: addItem(TYPES.NODE),
  [REMOVE_NODE]: removeItem(TYPES.NODE),
  [TOGGLE_NODE]: toggleItem(TYPES.NODE)
});

const OBJECT_ACTION_HANDLERS = ({
  [CLEAR_OBJECTS]: clearItems(TYPES.OBJECT),
  [ADD_OBJECT]: addItem(TYPES.OBJECT),
  [REMOVE_OBJECT]: removeItem(TYPES.OBJECT),
  [TOGGLE_OBJECT]: toggleItem(TYPES.OBJECT)
});

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
