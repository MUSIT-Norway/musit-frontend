import * as types from './constants';
import { apiUrl } from'../../util';
import Config from '../../config';

export const searchForObjects = (params, page, museumId) => {
  const baseUrl = apiUrl(`${Config.magasin.urls.thingaggregate.baseUrl(museumId)}/objects/search`);
  const museumNoQuery = `museumNo=${params.museumNo || ''}`;
  const subNoQuery = `subNo=${params.subNo || ''}`;
  const termQuery = `term=${params.term || ''}`;
  const pageQuery = `page=${page}`;
  const collectionIds = 'collectionIds=2e4f2455-1b3b-4a04-80a1-ba92715ff613';
  const limitQuery = `limit=${params.perPage}`;
  const url = `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}&${collectionIds}`;
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