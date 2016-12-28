import { getPath, getState } from '../../util';
import * as types from './moveDialogTypes';

const initialState = {
  root: {
    data: {}
  }
};

const storageUnitModalReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.LOAD_CHILDREN:
    return {
      ...state,
      loading: true
    };
  case types.LOAD_CHILDREN_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result
    };
  case types.LOAD_CHILDREN_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };

  case types.LOAD_NODE:
    return {
      ...state,
      loading: true
    };
  case types.LOAD_NODE_SUCCESS:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: true,
        data: {
          ...action.result,
          breadcrumb: getPath(action.result)
        }
      }
    };
  case types.LOAD_NODE_FAIL:
    return {
      ...state,
      root: {
        ...state.root,
        loading: false,
        loaded: false,
        error: action.error
      }
    };
  case types.CLEAR: {
    return {
      ...state,
      root: {},
      data: []
    };
  }
  default:
    return state;
  }
};

export default storageUnitModalReducer;

export const isMoveDialogActive = () => {
  const state = getState();
  const data = state.moveDialog.data;
  const hasData = data && data.length > 0;
  const hasRoot = Object.keys(state.moveDialog.root).length > 0;
  return hasData || hasRoot;
};
