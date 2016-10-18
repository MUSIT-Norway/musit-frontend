import * as types from './constants'

export const searchForObjects = (/*museumNo, uNo, term*/) => {
  return {
    types: [types.SEARCH_OBJECTS, types.SEARCH_OBJECTS_SUCCESS, types.SEARCH_OBJECTS_FAIL],
    promise: (client) => client.get('')
  }
}