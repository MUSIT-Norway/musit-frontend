/* @flow */
export const LOAD_SEVERAL = 'musit/storageobject-grid/LOAD_SEVERAL'
export const LOAD_SEVERAL_SUCCESS = 'musit/storageobject-grid/LOAD_SEVERAL_SUCCESS'
export const LOAD_SEVERAL_FAIL = 'musit/storageobject-grid/LOAD_SEVERAL_FAIL'

const mockData = [
  {
    id: 1,
    displayName: 'Carex',
    identifier: {
      museumNo: 'TRH-V-233',
      subNo: 1 }
  },
  {
    id: 2,
    displayName: 'Salix',
    identifier: {
      museumNo: 'TRH-V-2333',
      subNo: 1 }
  },
  {
    id: 3,
    displayName: 'Betula',
    identifier: {
      museumNo: 'TRH-V-33',
      subNo: 1 }
  },
  {
    id: 4,
    displayName: 'Pinus',
    identifier: {
      museumNo: 'TRH-V-11',
      subNo: 1 }
  }
]

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
        data: action.result
      }
    case LOAD_SEVERAL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: mockData
      }
    default:
      return state
  }
}

export default storageObjectGridReducer

export const loadObjects = (id, callback) => {
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(`/api/thingaggregate/node/${id}/objects`),
    callback
  };
}
