import { toFrontend } from './mapper';
import * as types from './types';

const initialState = {
  root: {
    data: {}
  }
};

const storageUnitGridReducer = (state = initialState, action = {}) => {
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

export default storageUnitGridReducer;