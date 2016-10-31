import { apiUrl } from '../../../util'
import { sortObject } from '../../../util/sort'
export const LOAD_SEVERAL = 'musit/storageobject-grid/LOAD_SEVERAL'
export const LOAD_SEVERAL_SUCCESS = 'musit/storageobject-grid/LOAD_SEVERAL_SUCCESS'
export const LOAD_SEVERAL_FAIL = 'musit/storageobject-grid/LOAD_SEVERAL_FAIL'

const storageObjectGridReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_SEVERAL:
      return {
        ...state,
        loading: true
      }
    case LOAD_SEVERAL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: sortObject(sortObject(sortObject(action.result, 'term'), 'subNo', 'number'), 'museumNo')
      }
    case LOAD_SEVERAL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: []
      }
    default:
      return state
  }
}

export default storageObjectGridReducer

export const loadObjects = (id, callback) => {
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(apiUrl(`/api/thingaggregate/museum/1/node/${id}/objects`)),
    callback
  };
}
