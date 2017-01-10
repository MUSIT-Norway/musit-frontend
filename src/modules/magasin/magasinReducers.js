import { combineReducers } from 'redux';
import { toFrontend } from './magasinMapper';
import * as types from './magasinTypes';
import MusitObject from '../../models/object';

const initialRoot = {
  root: {
    data: {
      matches: [],
      totalMatches: 0
    }
  }
};

export const nodeReducer = (state = initialRoot, action = {}) => {
  switch (action.type) {
  case types.LOAD_SEVERAL:
    return {
      ...state,
      loading: true
    };
  case types.LOAD_SEVERAL_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result
    };
  case types.LOAD_SEVERAL_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  case types.LOAD_ONE_SUCCESS:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: true,
        data: toFrontend(action.result)
      }
    };
  case types.LOAD_ONE_FAIL:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: false,
        error: action.error
      }
    };
  case types.CLEAR_ROOT: {
    return {
      ...state,
      root: {}
    };
  }
  case types.DELETE:
    return {
      ...state,
      loading: true
    };
  case types.DELETE_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: []
    };
  case types.DELETE_FAIL:
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

const initialObjects = {
  data: {
    matches: [],
    totalMatches: 0
  }
};

export const objectReducer = (state = initialObjects, action = {}) => {
  switch (action.type) {
  case types.LOAD_OBJECTS:
    return {
      ...state,
      loading: true
    };
  case types.LOAD_OBJECTS_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: {
        ...action.result,
        matches: action.result.matches.map(o => new MusitObject(o))
      }
    };
  case types.LOAD_OBJECTS_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      data: []
    };
  default:
    return state;
  }
};

const initialStats = {
  nodes: null,
  objects: null,
  totalObjects: null
};

export const statsReducer = (state = initialStats, action = {}) => {
  switch (action.type) {
  case types.CLEAR_STATS:
    return initialStats;
  case types.LOAD_STATS:
    return {
      ...initialStats,
      loading: true,
      loaded: false
    };
  case types.LOAD_STATS_SUCCESS:
    return {
      loading: false,
      loaded: true,
      ...action.result
    };
  case types.LOAD_STATS_FAILURE:
    return {
      ...initialStats,
      loading: false,
      loaded: false,
      error: action.error
    };
  default:
    return state;
  }
};

export default combineReducers({
  nodeReducer,
  objectReducer,
  statsReducer
});