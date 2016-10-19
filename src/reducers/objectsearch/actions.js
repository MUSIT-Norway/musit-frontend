import * as types from './constants'
import { apiUrl } from'../../util'
import Config from '../../config'

export const searchForObjects = (params) => {
  const url = apiUrl(
    `${Config.magasin.urls.objectsearch.baseUrl(1)}?museumNo=${params.museumNo}&subNo=${params.subNo}&term=${params.term}&page=${params.page || 1}`
  )
  return {
    types: [types.SEARCH_OBJECTS, types.SEARCH_OBJECTS_SUCCESS, types.SEARCH_OBJECTS_FAIL],
    promise: (client) => client.get(url)
  }
}

export const onChangeField = (field, value) => {
  return {
    type: types.CHANGE_FIELD,
    field,
    value
  }
}