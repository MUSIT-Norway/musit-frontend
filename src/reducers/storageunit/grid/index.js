import { mapToFrontend } from '../mapper'
const LOAD_SEVERAL = 'musit/storageunit-grid/LOAD_SEVERAL'
const LOAD_SEVERAL_SUCCESS = 'musit/storageunit-grid/LOAD_SEVERAL_SUCCESS'
const LOAD_SEVERAL_FAIL = 'musit/storageunit-grid/LOAD_SEVERAL_FAIL'
const LOAD_ONE = 'musit/storageunit-grid/LOAD_ONE'
const LOAD_ONE_SUCCESS = 'musit/storageunit-grid/LOAD_ONE_SUCCESS'
const LOAD_ONE_FAIL = 'musit/storageunit-grid/LOAD_ONE_FAIL'
const LOAD_PATH = 'musit/storageunit-grid/LOAD_PATH'
const LOAD_PATH_SUCCESS = 'musit/storageunit-grid/LOAD_PATH_SUCCESS'
const LOAD_PATH_FAIL = 'musit/storageunit-grid/LOAD_PATH_FAIL'
const CLEAR_ROOT = 'musit/storageunit-grid/CLEAR_ROOT'
const DELETE = 'musit/storageunit-grid/DELETE'
const DELETE_SUCCESS = 'musit/storageunit-grid/DELETE_SUCCESS'
const DELETE_FAIL = 'musit/storageunit-grid/DELETE_FAIL'

const initialState = { root: {} }

const storageUnitGridReducer = (state = initialState, action = {}) => {
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
        data: action.result
      }
    case LOAD_SEVERAL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    case LOAD_PATH:
      return {
        ...state,
        root: {
          ...state.root,
          loading: true
        }
      }
    case LOAD_PATH_SUCCESS:
      return {
        ...state,
        root: {
          ...state.root,
          path: action.result.map((s) => {
            return {
              id: s.id,
              name: s.name,
              type: s.storageType,
              url: `/magasin/${s.id}`
            }
          }),
          loaded: true,
          loading: false
        }
      }
    case LOAD_PATH_FAIL:
      return {
        ...state,
        root: {
          ...state.root,
          loading: false,
          loaded: false,
          error: action.error
        }
      }
    case LOAD_ONE_SUCCESS:
      return {
        ...state,
        root: {
          ...state.root,
          statistics: {
            objectsOnNode: Number.NaN,
            totalObjectCount: Number.NaN,
            underNodeCount: Number.NaN
          },
          loading: false,
          loaded: true,
          data: mapToFrontend(action.result)
        }
      }
    case LOAD_ONE_FAIL:
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
    case DELETE:
      return {
        ...state,
        loading: true
      }
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: []
      }
    case DELETE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    default:
      return state
  }
}

export default storageUnitGridReducer;

export const loadRoot = (id) => {
  let action = {}
  if (id) {
    action = {
      types: [LOAD_ONE, LOAD_ONE_SUCCESS, LOAD_ONE_FAIL],
      promise: client => client.get(`/api/storageadmin/v1/storageunit/${id}`)
    }
  } else {
    action = {
      types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
      promise: client => client.get('/api/storageadmin/v1/storageunit/root')
    }
  }
  return action
}

export const loadChildren = (id, callback) => {
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: client => client.get(`/api/storageadmin/v1/storageunit/${id}/children`),
    callback
  };
}

export const deleteUnit = (id, callback) => {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    promise: client => client.del(`/api/storageadmin/v1/storageunit/${id}`),
    id,
    callback
  };
}

export const clearRoot = () => {
  return {
    type: CLEAR_ROOT
  }
}

export const loadPath = (id, callback) => {
  const url = `/api/storageadmin/v1/storageunit/${id}/path`
  return {
    types: [LOAD_PATH, LOAD_PATH_SUCCESS, LOAD_PATH_FAIL],
    promise: client => client.get(url),
    callback
  };
}
