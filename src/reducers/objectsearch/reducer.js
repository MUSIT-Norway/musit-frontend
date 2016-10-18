import { omit } from 'lodash'

import * as types from './constants'

const initialState = {
  data: []
}

export default (state = initialState, action) => {
  switch(action.type) {
    case types.SEARCH_OBJECTS:
      return {
        ...omit(state, 'error'),
        loading: true,
        loaded: false,
        data: []
      }
    case types.SEARCH_OBJECTS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: [],
        error: action.error
      }
    case types.SEARCH_OBJECTS_SUCCESS:
      return {
        ...omit(state, 'error'),
        loading: false,
        loaded: true,
        data: action.result
      }
    default:
      return state;
  }
}