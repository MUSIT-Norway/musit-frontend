import { getPath } from '../../util';
import * as types from './picklistTypes';

// Empty state
const initialState = {
  [types.NODE]: [],
  [types.OBJECT]: []
};

const toggleItem = (type) => (state, action) => {
  const items = [].concat(action.item);
  const toggle = (node) => typeof action.on !== 'undefined' ? action.on : !node.marked;
  const nodes = state[type].map(node => ({
    ...node,
    marked: items.indexOf(node.value) > -1 ? toggle(node) : node.marked
  }));
  return { ...state, [type]: nodes };
};

const toggleObjects = (type) => (state, action) => {
  const mainObjectId = action.item.mainObjectId;
  const toggle = (node) => typeof action.on !== 'undefined' ? action.on : !node.marked;
  const nodes = state[type].map(node => ({
    ...node,
    marked: mainObjectId === node.value.mainObjectId ? toggle(node) : node.marked
  }));
  return { ...state, [type]: nodes };
};

const removeItem = (type) => (state, action) => {
  const items = [].concat(action.item);
  const nodes = state[type].filter(node => items.findIndex(i => i.id === node.value.id) === -1);
  return { ...state, [type]: nodes };
};


const addItem = (type) => (state, action) => {
  if (state[type].findIndex(node => action.item.id === node.value.id) > -1) {
    return state;
  }
  const nodes = state[type].concat({ marked: false, value: action.item, path: action.path});
  return {
    ...state,
    [type]: nodes
  };
};

const clearItems = (type) => (state) => ({
  ...state,
  [type]: []
});

export const getPathString = (pathStr) => {
  const pathStrArr = pathStr.substr(1, pathStr.length - 2).split(',');
  // EX: ,1,2,3,19, will be transformed to 1,2,3,
  return `,${pathStrArr.slice(0, -1).join(',').toString()},`;
};


const loadItem = (state) => state;

const loadItemFail = (state, action) => ({ ...state, error: action.error });

const loadItemSuccess = (type) => (state, action) => {
  const modifiedItems = state[type].map((n) => {
    if (n.value.id === action.id) {
      return {
        ...n,
        path: getPath({
          path: type === types.OBJECT ? action.result.path : getPathString(action.result.path),
          pathNames: action.result.pathNames
        })
      };
    }
    return n;
  });
  return {
    ...state,
    [type]: modifiedItems
  };
};

const NODE_ACTION_HANDLERS = {
  [types.CLEAR_NODES]: clearItems(types.NODE),
  [types.ADD_NODE]: addItem(types.NODE),
  [types.REMOVE_NODE]: removeItem(types.NODE),
  [types.TOGGLE_NODE]: toggleItem(types.NODE),
  [types.LOAD_ONE_NODE]: loadItem,
  [types.LOAD_ONE_NODE_SUCCESS]: loadItemSuccess(types.NODE),
  [types.LOAD_ONE_NODE_FAIL]: loadItemFail
};

const OBJECT_ACTION_HANDLERS = {
  [types.CLEAR_OBJECTS]: clearItems(types.OBJECT),
  [types.ADD_OBJECT]: addItem(types.OBJECT),
  [types.REMOVE_OBJECT]: removeItem(types.OBJECT),
  [types.TOGGLE_OBJECT]: toggleItem(types.OBJECT),
  [types.TOGGLE_MAIN_OBJECT]: toggleObjects(types.OBJECT),
  [types.LOAD_ONE_OBJECT]: loadItem,
  [types.LOAD_ONE_OBJECT_SUCCESS]: loadItemSuccess(types.OBJECT),
  [types.LOAD_ONE_OBJECT_FAIL]: loadItemFail
};

export default (state = initialState, action = {}) => {
  if (NODE_ACTION_HANDLERS[action.type]) {
    return NODE_ACTION_HANDLERS[action.type](state, action);
  }
  if (OBJECT_ACTION_HANDLERS[action.type]) {
    return OBJECT_ACTION_HANDLERS[action.type](state, action);
  }
  return state;
};