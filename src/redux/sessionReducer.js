export const SET_MUSEUM = 'setMuseumId';
export const SET_COLLECTION = 'setCollectionId';

export default (state = {}, action) => {
  switch(action.type) {
  case SET_MUSEUM:
    return {
      ...state,
      museumId: action.museumId
    };
  case SET_COLLECTION:
    return {
      ...state,
      collectionId: action.collectionId
    };
  default:
    return state;
  }
};