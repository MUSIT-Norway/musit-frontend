// @flow

import { simpleGet } from '../../shared/RxAjax';
import Config from '../../config';
import { Observable } from 'rxjs';

import type { AjaxGet } from 'types/ajax';
import type { SearchResult } from 'types/search';
import type { MuseumId } from 'types/ids';

type SearchProps = {
  queryParam: {
    museumNo: ?string,
    subNo: ?string,
    term: ?string,
    q: ?string
  },
  limit: number,
  from: number,
  museumId: MuseumId,
  collectionIds: string,
  token: string
};

export function objectSearch(ajaxGet: AjaxGet<*> = simpleGet) {
  return (props: SearchProps): Observable<SearchResult> => {
    const url = Config.magasin.urls.api.thingaggregate.searchObjectUrl(
      props.queryParam.museumNo,
      props.queryParam.subNo,
      props.queryParam.term,
      props.queryParam.q,
      props.limit,
      props.from,
      props.collectionIds,
      props.museumId,
      false

    );
    return ajaxGet(url, props.token).map(({ response }) => response);
  };
}
