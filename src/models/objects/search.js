// @flow

import { simpleGet } from '../../shared/RxAjax';
import Config from '../../config';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';

import type { AjaxGet } from 'types/ajax';
import type { SearchResult } from 'types/search';
import type { MuseumId } from 'types/ids';
import MusitObject from '../object';

type SearchProps = {
  queryParam: {
    museumNo: ?string,
    museumNoAsANumber: ?string,
    subNo: ?string,
    term: ?string,
    q: ?string
  },
  limit: number,
  from: number,
  museumId: MuseumId,
  collectionIds: string,
  token: string,
  storageFacilityReadRole?: boolean
};

const hentPlassering = (
  id: string,
  objectType: string,
  museumid: number,
  token: string
): Observable<string> =>
  MusitObject.getObjectLocation(simpleGet)({
    museumId: museumid,
    objectType: objectType,
    objectId: id,
    token: token
  }).map(path => path);

export function objectSearch(ajaxGet: AjaxGet<*> = simpleGet) {
  return (props: SearchProps): Observable<SearchResult> => {
    const url = Config.magasin.urls.api.thingaggregate.searchObjectUrl(
      props.queryParam.museumNo,
      props.queryParam.museumNoAsANumber,
      props.queryParam.subNo,
      props.queryParam.term,
      props.queryParam.q,
      props.limit,
      props.from,
      props.collectionIds,
      props.museumId,
      false
    );
    const res = ajaxGet(url, props.token).flatMap(({ response }) => {
      if (
        response.error ||
        (response.hits && response.hits.total === 0) ||
        !props.storageFacilityReadRole ||
        Number(localStorage.getItem('SearchPageSize')) > 1000
      ) {
        return Observable.of(response);
      }
      const newObjects: Array<Observable<any>> = response.hits.hits.map(a => {
        const currentLocation = hentPlassering(
          a._source.id || a._source.objectId,
          a._type,
          props.museumId,
          props.token
        );
        return currentLocation.map(cl => ({
          ...a,
          _source: { ...a._source, currentLocation: cl }
        }));
      });
      const newNewObject = forkJoin(newObjects).map(no => {
        const svar = { ...response, hits: { ...response.hits, hits: no } };

        return svar;
      });
      return newNewObject;
    });

    return res;
  };
}
