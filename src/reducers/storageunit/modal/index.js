const LOAD_SEVERAL = 'musit/storageunit-modal/LOAD_SEVERAL'
const LOAD_SEVERAL_SUCCESS = 'musit/storageunit-modal/LOAD_SEVERAL_SUCCESS'
const LOAD_SEVERAL_FAIL = 'musit/storageunit-modal/LOAD_SEVERAL_FAIL'
const LOAD_ROOT = 'musit/storageunit-modal/LOAD_ROOT'
const LOAD_ROOT_SUCCESS = 'musit/storageunit-modal/LOAD_ROOT_SUCCESS'
const LOAD_ROOT_FAIL = 'musit/storageunit-modal/LOAD_ROOT_FAIL'
const LOAD_PATH = 'musit/storageunit-modal/LOAD_PATH'
const LOAD_PATH_SUCCESS = 'musit/storageunit-modal/LOAD_PATH_SUCCESS'
const LOAD_PATH_FAIL = 'musit/storageunit-modal/LOAD_PATH_FAIL'
const CLEAR_ROOT = 'musit/storageunit-modal/CLEAR_ROOT'
const SET_CURRENT = 'musit/storageunit-modal/SET_CURRENT'
const CLEAR_CURRENT = 'musit/storageunit-modal/CLEAR_CURRENT'

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
          path: action.result.filter(s => s.name !== 'root-node').map((s) => {
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
          data: action.result
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

export const loadRoot = (id) => {
  let action = {}
  if (id) {
    action = {
      types: [LOAD_ROOT, LOAD_ROOT_SUCCESS, LOAD_ROOT_FAIL],
      promise: (client) => client.get(`/api/storagefacility/v1/storagenodes/${id}`)
    }
  } else {
    action = {
      types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
      promise: (client) => client.get('/api/storagefacility/v1/storagenodes/1/children')
    }
  }
  return action
}

export const loadChildren = (id, callback) => {
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(`/api/storagefacility/v1/storagenodes/${id}/children`),
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

export const loadPath = (id, callback) => {
  const url = `/api/storageadmin/v1/storageunit/${id}/path`
  return {
    types: [LOAD_PATH, LOAD_PATH_SUCCESS, LOAD_PATH_FAIL],
    promise: (client) => client.get(url),
    callback
  };
}

export const clearPath = () => {
  return {
    type: LOAD_PATH_SUCCESS,
    result: []
  }
}
