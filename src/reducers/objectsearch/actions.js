import * as types from './constants'
import { apiUrl } from'../../util'
import Config from '../../config'

export const searchForObjects = (params, page) => {
  const baseUrl = apiUrl(Config.magasin.urls.objectsearch.baseUrl(1));
  const museumNoQuery = `museumNo=${params.museumNo || ''}`
  const subNoQuery = `subNo=${params.subNo || ''}`
  const termQuery = `term=${params.term || ''}`
  const pageQuery = `page=${page}`
  const limitQuery = `limit=${params.perPage}`
  const url = `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}`
  return {
    types: [types.SEARCH_OBJECTS, types.SEARCH_OBJECTS_SUCCESS, types.SEARCH_OBJECTS_FAIL],
    promise: (client) => client.get(url),
    page
  }
}

export const onChangeField = (field, value) => {
  return {
    type: types.CHANGE_FIELD,
    field,
    value
  }
}