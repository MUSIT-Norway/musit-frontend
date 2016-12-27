import { combineReducers } from 'redux';
import { createStructuredSelector } from 'reselect';
import { toFrontend } from './magasinMapper';
import * as types from './magasinTypes';
import MusitObject from '../../models/object';
import { customSortingStorageNodeType } from '../../util';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';

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

const getGridData = (state) => {
  if (!state.data) {
    return [];
  }
  return state.data.length ? state.data : state.data.matches || [];
};

export const nodesSelector = createSelector(
  [state => getGridData(state.nodeReducer)],
  (storageGridUnit) => orderBy(storageGridUnit, [
    (o) => customSortingStorageNodeType(o.type),
    (o) => toLower(o.name)
  ])
);

export const totalNodesSelector = (state) => state.nodeReducer.data && state.nodeReducer.data.totalMatches;

export const objectsSelector = createSelector(
  [state => getGridData(state.objectReducer)],
  (storageObjectGrid) => orderBy(storageObjectGrid, [
    (o) => toLower(o.museumNo),
    (o) => toLower(o.subNo),
    (o) => toLower(o.term)
  ])
);

export const totalObjectsSelector = (state) => state.objectReducer.data && state.objectReducer.data.totalMatches;

export const rootNodeSelector = (state) => state.nodeReducer.root.data;

export const statsSelector = (state) => state.statsReducer;

export const selector = createStructuredSelector({
  stats: statsSelector,
  nodes: nodesSelector,
  totalNodes: totalNodesSelector,
  objects: objectsSelector,
  totalObjects: totalObjectsSelector,
  rootNode: rootNodeSelector
});