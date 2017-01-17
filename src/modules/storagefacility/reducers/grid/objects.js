import { apiUrl } from '../../../../shared/util';
export const LOAD_SEVERAL = 'musit/storageobject-grid/LOAD_SEVERAL';
export const LOAD_SEVERAL_SUCCESS = 'musit/storageobject-grid/LOAD_SEVERAL_SUCCESS';
export const LOAD_SEVERAL_FAIL = 'musit/storageobject-grid/LOAD_SEVERAL_FAIL';
import Config from '../../../../config';
import MusitObject from '../../../../shared/models/object';

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
      data: {
        ...action.result,
        matches: action.result.matches.map(o => new MusitObject(o))
      }
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


export const loadObjects = (id, museumId, collectionId, currentPage, callback) => {
  const url = Config.magasin.urls.thingaggregate.baseUrl;
  return {
    types: [LOAD_SEVERAL, LOAD_SEVERAL_SUCCESS, LOAD_SEVERAL_FAIL],
    promise: (client) => client.get(
      apiUrl(
        `${url(museumId)}/node/${id}/objects?${collectionId.getQuery()}&page=${currentPage || 1}&limit=${Config.magasin.limit}`
      )
    ),
    callback
  };
};
