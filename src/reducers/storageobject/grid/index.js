import { apiUrl } from '../../../util';
export const LOAD_SEVERAL = 'musit/storageobject-grid/LOAD_SEVERAL';
export const LOAD_SEVERAL_SUCCESS = 'musit/storageobject-grid/LOAD_SEVERAL_SUCCESS';
export const LOAD_SEVERAL_FAIL = 'musit/storageobject-grid/LOAD_SEVERAL_FAIL';
import Config from '../../../config';
import MusitObject from '../../../models/object';

const storageObjectGridReducer = (state = {}, action = {}) => {
  switch (action.type) {
  case LOAD_SEVERAL:
    return {
      ...state,
      loading: true
    };
  case LOAD_SEVERAL_SUCCESS:
    return {
      ...state,
      loading: false,
      loaded: true,
      data: action.result.map(o => new MusitObject(o))
    };
  case LOAD_SEVERAL_FAIL:
    return {
      ...state,
      loading: false,
      loaded: false,
      data: []
    };
  default:
    return state;
  }
};

export default storageObjectGridReducer;


export const loadObjects = (id, museumId, collectionId, callback) => {
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(apiUrl(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/node/${id}/objects?${collectionId.getQuery()}`)),
    callback
  };
};
