// @flow

import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet } from '../../shared/RxAjax';

import type { AjaxGet } from 'types/ajax';
import type { SearchResult } from 'types/search';

type SearchQuery = {
  q: ?string
};

export type ConservationSearchProps = {
  queryParam: SearchQuery,
  from: number,
  limit: number,
  museumId: number,
  collectionIds: string,
  token: string
};

export const conservationSearch: (
  ajaxGet: AjaxGet<*>
) => (props: ConservationSearchProps) => Observable<SearchResult> = (
  ajaxGet = simpleGet
) => ({ queryParam, museumId, collectionIds, token, from, limit }) => {
  const url = Config.magasin.urls.api.conservation.search(
    museumId,
    collectionIds,
    from,
    limit,
    queryParam.q
  );
  const nullOutputForSearch = {
    timed_out: false,
    took: 0,
    hits: {
      total: 0,
      max_score: 0,
      hits: []
    }
  };
  return ajaxGet(url, token).map(({ response }) => {
    if (!response) {
      return nullOutputForSearch;
    }
    return response;
  });
};
