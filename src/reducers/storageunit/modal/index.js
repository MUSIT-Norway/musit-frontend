import Config from '../../../config'
import { apiUrl } from '../../../util'
import { getPath } from '../../helper'

export const LOAD_SEVERAL = 'musit/storageunit-modal/LOAD_SEVERAL'
export const LOAD_SEVERAL_SUCCESS = 'musit/storageunit-modal/LOAD_SEVERAL_SUCCESS'
export const LOAD_SEVERAL_FAIL = 'musit/storageunit-modal/LOAD_SEVERAL_FAIL'
export const LOAD_ROOT = 'musit/storageunit-modal/LOAD_ROOT'
export const LOAD_ROOT_SUCCESS = 'musit/storageunit-modal/LOAD_ROOT_SUCCESS'
export const LOAD_ROOT_FAIL = 'musit/storageunit-modal/LOAD_ROOT_FAIL'
export const CLEAR_ROOT = 'musit/storageunit-modal/CLEAR_ROOT'
export const SET_CURRENT = 'musit/storageunit-modal/SET_CURRENT'
export const CLEAR_CURRENT = 'musit/storageunit-modal/CLEAR_CURRENT'

const initialState = { root: {} }

const storageUnitModalReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_CURRENT:
      return {
        ...state,
        currentId: action.id
      }
    case CLEAR_CURRENT:
      return {
        ...state,
        currentId: null
      }
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
        data: action.result
      }
    case LOAD_SEVERAL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }

    case LOAD_ROOT:
      return {
        ...state,
        loading: true
      }
    case LOAD_ROOT_SUCCESS:
      return {
        ...state,
        root: {
          ...state.root,
          loading: false,
          loaded: true,
          data: {
            ...action.result,
            path: getPath(action.result.path, action.result.pathNames)
          }
        }
      }
    case LOAD_ROOT_FAIL:
      return {
        ...state,
        root: {
          ...state.root,
          loading: false,
          loaded: false,
          error: action.error
        }
      }
    case CLEAR_ROOT: {
      return {
        ...state,
        root: {}
      }
    }
    default:
      return state
  }
}

export default storageUnitModalReducer;

export const loadNode = (id) => {
  return {
    types: [LOAD_ROOT, LOAD_ROOT_SUCCESS, LOAD_ROOT_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}`))
  }
}

export const loadChildren = (id, callback) => {
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}/children`)),
    callback
  };
}

export const clearRoot = () => {
  return {
    type: CLEAR_ROOT
  }
}

export const setCurrent = (id) => {
  return {
    type: SET_CURRENT,
    id
  }
}

export const clearCurrent = () => {
  return {
    type: CLEAR_CURRENT
  }
}
