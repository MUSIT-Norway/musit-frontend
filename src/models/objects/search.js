// @flow

import { simpleGet } from '../../shared/RxAjax';
import Config from '../../config';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';

import type { AjaxGet } from 'types/ajax';
import type { SearchResult } from 'types/search';
import type { MuseumId } from 'types/ids';
import MusitObject from '../object';
import { getPath } from '../../shared/util';

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
      props.queryParam.subNo,
      props.queryParam.term,
      props.queryParam.q,
      props.limit,
      props.from,
      props.collectionIds,
      props.museumId,
      false
    );
    let res = ajaxGet(url, props.token).map(({ response }) => response);
if (props.storageFacilityReadRole) {
    res = res.flatMap(r => {
      const newObjects: Array<Observable<any>> = r.hits.hits.map(a => {
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
        const svar = { ...r, hits: { ...r.hits, hits: no } };

        return svar;
      });
      return newNewObject;
    });
  }

    return res;
  };
}
