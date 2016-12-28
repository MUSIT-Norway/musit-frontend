import * as types from './controlTypes';

export const initialState = {};

const controlReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.ADD: {
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }
  case types.ADD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true
    };
  case types.ADD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  case types.LOAD:
    return {
      ...state,
      loading: true,
      loaded: false,
      data: {}
    };
  case types.LOAD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result
    };
  case types.LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      data: action.error
    };
  default:
    return state;
  }
};

export default controlReducer;