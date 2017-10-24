// @flow

import { Observable } from 'rxjs';
import Config from '../../config';
import { simpleGet } from '../../shared/RxAjax';

import type { AjaxGet } from 'types/ajax';
import type { SearchResult } from 'types/search';

type SearchQuery = {
  q: ?string
};

export type AnalysisSearchProps = {
  queryParam: SearchQuery,
  from: number,
  limit: number,
  museumId: number,
  collectionIds: string,
  token: string
};

export const analysisSearch: (
  ajaxGet: AjaxGet<*>
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
  return ajaxGet(url, token).map(({ response }) => response);
};
