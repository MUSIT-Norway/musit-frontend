import { omit } from 'lodash';
import { getPath } from '../helper';
import MusitObject from '../../models/object';
import * as types from './constants';

const initialState = {
  data: {
    totalMatches: 0,
    matches: []
  },
  params: {
    currentPage: 1,
    perPage: 50
  },
  loaded: true
};

export default (state = initialState, action) => {
  switch(action.type) {
  case types.CHANGE_FIELD:
    return {
      ...state,
      params: {
        ...state.params,
        [action.field]: action.value
      }
    };
  case types.SEARCH_OBJECTS:
    return {
      ...omit(state, 'error'),
      loading: true,
      loaded: false,
      data: {
        totalMatches: 0,
        matches: []
      },
      params: {
        ...state.params,
        currentPage: action.page
      }
    };
  case types.SEARCH_OBJECTS_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      data: [],
      error: action.error
    };
  case types.SEARCH_OBJECTS_SUCCESS:
    return {
      ...omit(state, 'error'),
      loading: false,
      loaded: true,
      data: {
        totalMatches: action.result.totalMatches,
        matches: action.result.matches.map(data => {
          return new MusitObject({
            ...data,
            breadcrumb: getPath(data)
          });
        })
      }
    };
  default:
    return state;
  }
};