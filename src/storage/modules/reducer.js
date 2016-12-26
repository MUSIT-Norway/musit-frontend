import { toFrontend } from '../../magasin/modules/mapper';
import * as types from './types';

const initialState = {
  state: {
    environmentRequirement: {},
    environmentAssessment: {},
    securityAssessment: {}
  }
};

const storageUnitContainerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
  case types.INSERT:
    return {
      ...state,
      loading: true
    };
  case types.INSERT_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: toFrontend(action.result)
    };
  case types.INSERT_FAIL:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.error
    };
  case types.UPDATE:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.data
    };
  case types.LOAD:
    return {
      ...state,
      loading: true
    };
  case types.LOAD_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: toFrontend(action.result)
    };
  case types.LOAD_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      error: action.error
    };
  case types.UPDATE_STATE:
    return {
      ...state,
      state: action.data
    };
  case types.CLEAR_STATE:
    return {
      ...state,
      state: {
        environmentRequirement: {},
        environmentAssessment: {},
        securityAssessment: {}
      }
    };
  default:
    return state;
  }
};

export default storageUnitContainerReducer;