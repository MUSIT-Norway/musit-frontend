// @flow

import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet } from '../../shared/RxAjax';
import { AjaxGet } from '../../types/ajax';
import { SearchResult } from '../../types/search';
import { Star } from '../../types/common';

type SearchQuery = {
  q: string | null; //Was Maybe<string> in original js (flow) code.
};

export type AnalysisSearchProps = {
  queryParam: SearchQuery;
  from: number;
  limit: number;
  museumId: number;
  collectionIds: string;
  token: string;
};

export const analysisSearch: (
  ajaxGet: AjaxGet<Star>
) => (props: AnalysisSearchProps) => Observable<SearchResult> = (
  ajaxGet = simpleGet
) => ({ queryParam, museumId, collectionIds, token, from, limit }) => {
  const url = Config.magasin.urls.api.analysis.search(
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
