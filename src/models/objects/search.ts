// @flow

import { simpleGet } from '../../shared/RxAjax';
import Config from '../../config';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { AjaxGet } from '../../types/ajax';
import { SearchResult } from '../../types/search';
import { MuseumId } from '../../types/ids';
import MusitObject from '../object';
import { Maybe, Star, TODO } from '../../types/common';

type SearchProps = {
  queryParam: {
    museumNo: Maybe<string>;
    museumNoAsANumber: Maybe<string>;
    subNo: Maybe<string>;
    term: Maybe<string>;
    q: Maybe<string>;
  };
  limit: number;
  from: number;
  museumId: MuseumId;
  collectionIds: string;
  token: string;
  storageFacilityReadRole?: boolean;
  databaseSearch?: boolean;
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

export function objectSearch(ajaxGet: AjaxGet<Star> = simpleGet) {
  return (props: SearchProps): Observable<SearchResult> => {
    const dbSearch =
      props.databaseSearch ||
      (localStorage.getItem('objectDatabaseSearch') &&
        localStorage.getItem('objectDatabaseSearch') === 'true')
        ? true
        : false;
    const queryParam = {
      museumNo: localStorage.getItem('museumNo') || props.queryParam.museumNo,
      museumNoAsANumber:
        localStorage.getItem('museumNoAsANumber') || props.queryParam.museumNoAsANumber,
      subNo: localStorage.getItem('subNo') || props.queryParam.subNo,
      term: localStorage.getItem('term') || props.queryParam.term,
      q: localStorage.getItem('q') || props.queryParam.q
    };
    const url = dbSearch
      ? Config.magasin.urls.api.thingaggregate.searchDatabaseObjectUrl(
          queryParam.museumNo,
          queryParam.museumNoAsANumber
            ? queryParam.museumNoAsANumber.replace(/\s/g, '')
            : null, //remove space
          queryParam.subNo,
          queryParam.term,
          queryParam.q,
          props.limit,
          props.from,
          props.collectionIds,
          props.museumId,
          false
        )
      : Config.magasin.urls.api.thingaggregate.searchObjectUrl(
          queryParam.museumNo,
          queryParam.museumNoAsANumber
            ? queryParam.museumNoAsANumber.replace(/\s/g, '')
            : null, //remove space
          queryParam.subNo,
          queryParam.term,
          queryParam.q,
          props.limit,
          props.from,
          props.collectionIds,
          props.museumId,
          false
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

    const mapDbToESResponse = (r: TODO) => ({
      timed_out: false,
      took: 0,
      hits: {
        max_score: 0,
        total: r.totalMatches,
        hits: [...r.matches]
      }
    });

    const mapDbHitsToESHist = (d: {
      uuid: string;
      museumId: number;
      museumNo: string;
      term: string;
      type?: string;
    }) => ({
      _type: d.type ? d.type : 'collection',
      _id: d.uuid,
      _score: 0,
      _source: {
        objectId: d.uuid,
        id: d.uuid,
        museumId: d.museumId,
        museumNo: d.museumNo,
        term: d.term,
        collection: {
          id: null,
          uuid: props.collectionIds
        },
        isDeleted: false,
        museumNoAsANumber: null,
        museumNoAsLowerCase: null,
        objectType: d.type ? d.type : 'collection'
      }
    });

    const res = ajaxGet(url, props.token).flatMap(output => {
      const r = output.response;
      console.log('Response--------------------------- ', r);
      console.log(
        'Mapped response--------------------------- ',
        dbSearch ? mapDbToESResponse(r) : r
      );
      if (!r) {
        return Observable.of(nullOutputForSearch);
      }
      if (
        r.error ||
        (r.hits && r.hits.total === 0) ||
        !props.storageFacilityReadRole ||
        Number(localStorage.getItem('SearchPageSize')) > 1000
      ) {
        return Observable.of(dbSearch ? mapDbToESResponse(r) : r);
      }
      if (dbSearch && r.matches.length === 0) {
        return Observable.of(nullOutputForSearch);
      }
      const response = dbSearch ? mapDbToESResponse(r) : r;
      console.log('Inner response after transform--------------------------- ', response);
      const newObjects: Array<Observable<any>> = response.hits.hits.map((d: TODO) => {
        const a = dbSearch ? mapDbHitsToESHist(d) : d;
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
