import * as types from './searchTypes';
import { apiUrl } from'../../util';
import Config from '../../config';

export const searchForObjects = (params, page, museumId, collectionId) => {
  const baseUrl = apiUrl(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/objects/search`);
  const museumNoQuery = `museumNo=${params.museumNo || ''}`;
  const subNoQuery = `subNo=${params.subNo || ''}`;
  const termQuery = `term=${params.term || ''}`;
  const pageQuery = `page=${page}`;
  const limitQuery = `limit=${params.perPage}`;
  const url = `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}&${collectionId.getQuery()}`;
  return {
    types: [types.SEARCH_OBJECTS, types.SEARCH_OBJECTS_SUCCESS, types.SEARCH_OBJECTS_FAIL],
    promise: (client) => client.get(url),
    page
  };
};

export const onChangeField = (field, value) => {
  return {
    type: types.CHANGE_FIELD,
    field,
    value
  };
};

export const clearSearch = () => ({ type: types.CLEAR_SEARCH });