const INSERT = 'musit/storageunit-container/INSERT';
const UPDATE = 'musit/storageunit-container/UPDATE';
const INSERT_SUCCESS = 'musit/storageunit-container/INSERT_SUCCESS';
const INSERT_FAIL = 'musit/storageunit-container/INSERT_FAIL';
const LOAD = 'musit/storageunit-container/LOAD';
const LOAD_SUCCESS = 'musit/storageunit-container/LOAD_SUCCESS';
const LOAD_FAIL = 'musit/storageunit-container/LOAD_FAIL';

const initialState = {}

const storageUnitContainerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case INSERT:
      return {
        ...state,
        loading: true,
      };
    case INSERT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case INSERT_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: action.error
      };
    case UPDATE:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data
      };
    case LOAD:
      return {
        ...state,
        loading: true,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_FAIL:
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

export default storageUnitContainerReducer;

export const isLoaded = (globalState) => {
  return globalState.storageUnitContainer && globalState.storageUnitContainer.loaded;
}

export const load = (id) => {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/api/storageadmin/v1/storageunit/${id}`)
  };
}

const mapToBackend = (id, data) => {
  return {
    ...data,
    groupRead: 'foo', // Must be removed
    isPartOf: id * 1,
    area: data.area * 1,
    areaTo: data.areaTo * 1,
    height: data.height * 1,
    heightTo: data.heightTo * 1
  }
}

export const insert = (id, data, callback) => {
  let action = 'post'
  let url = '/api/storageadmin/v1/storageunit';
  if (data.id) {
    action = 'put'
    url += `/${data.id}`
  }
  data = mapToBackend(id, data)
  return {
    types: [INSERT, INSERT_SUCCESS, INSERT_FAIL],
    promise: (client) => client[action](url, { data }),
    callback
  };
}

export const update = (data) => {
  return {
    type: UPDATE,
    data: data
  }
}
