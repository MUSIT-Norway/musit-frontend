import { simpleGet } from '../shared/RxAjax';
import Config from '../config';
import MuseumId from './museumId';
import CollectionId from './collectionId';
import entries from 'object.entries';

class MusitObjectSearch {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

MusitObjectSearch.searchForObjects = (params: string, page: number, collectionId: CollectionId, museumId: MuseumId, token: string, callback) => {
  const url = Config.magasin.urls.thingaggregate.searchObjectUrl(params, page, collectionId, museumId);
  return simpleGet(url, token, callback)
    .map(({ response }) => response)
    .map(data => {
      if (!data) {
        return {...data, matches: [], totalMatches: 0, error: 'no response body'};
      }
      return {
        ...data,
        matches: data.matches ? data.matches.map(obj => new MusitObjectSearch(obj)) : []
      };
    });
};

export default MusitObjectSearch;