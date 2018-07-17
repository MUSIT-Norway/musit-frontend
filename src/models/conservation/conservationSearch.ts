// @flow

import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet } from '../../shared/RxAjax';

import { AjaxGet } from '../../types/ajax';
import { SearchResult } from '../../types/search';
import { Maybe, Star, MUSTFIX } from '../../types/common';

type SearchQuery = {
  q?: Maybe<string>;
};

export type ConservationSearchProps = {
  queryParam: SearchQuery;
  from: number;
  limit: number;
  museumId: number;
  collectionIds: string;
  token: string;
};

export const conservationSearch: (
  ajaxGet: AjaxGet<Star>
) => (props: ConservationSearchProps) => Observable<SearchResult> = (
  ajaxGet = simpleGet
) => ({ queryParam, museumId, collectionIds, token, from, limit }) => {
  const url = Config.magasin.urls.api.conservation.search(
    museumId,
    collectionIds,
    from,
    limit,
    queryParam.q as MUSTFIX
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
