// @flow

import inject from 'react-rxjs/dist/RxInject';
import ObjectSearchComponent from './SearchComponent';
import store$, { actions } from './searchStore';
import { toggleObject$ } from '../../stores/pickList';
import type { ChangePage } from '../../search/searchStore';
import type { Hit, InnerHits, SearchHit } from '../../types/search';
import type { History } from '../../types/Routes';
import Config from '../../config';
import type { ObjectData } from '../../types/object';
import type { SampleData } from '../../types/samples';
import { flattenSample, getSampleTypeAndSubType } from '../sample/shared/types';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';

function getObject(hit: SearchHit): ?ObjectData {
  switch (hit._type) {
    case 'collection':
      return (hit._source: ?ObjectData);
    case 'sample':
      if (!hit.inner_hits.musit_object) {
        return null;
      }
      const hits: { total: number, hits: Array<Hit & InnerHits> } =
        hit.inner_hits.musit_object.hits;
      if (hits.total === 0) {
        return null;
      }
      return (hits.hits[0]._source: ?ObjectData);
    default:
      return null;
  }
}

function getSource(hit: SearchHit): ?ObjectData | ?SampleData {
  switch (hit._type) {
    case 'collection':
      return (hit._source: ?ObjectData);
    case 'sample':
      return (hit._source: ?SampleData);
    default:
      return null;
  }
}

function props(p, upstream: { history: History }) {
  return {
    onSearch: () => {
      actions.clear$;
      actions.setLoading$.next();
      actions.search$.next({
        from: 0,
        limit: p.searchStore.limit,
        queryParam: p.searchStore.queryParam,
        museumId: p.appSession.museumId,
        collectionIds: p.appSession.collectionId,
        token: p.appSession.accessToken
      });
    },
    onChangeQueryParam: (name: string, value: string) => {
      actions.clear$;
      actions.changeQuery$.next({ name, value });
    },
    onChangePage: (page: ChangePage) => {
      actions.clear$;
      actions.selectPage$.next({ page, appSession: p.appSession });
    },
    onClickHeader: (hit: SearchHit) => {
      const object = getSource(hit);
      if (object) {
        let url;
        if (hit._type === 'collection') {
          const o: ObjectData = (object: any);
          url = Config.magasin.urls.client.object.gotoObject(
            p.appSession,
            o.id.toString()
          );
        } else if (hit._type === 'sample') {
          const s: SampleData = (object: any);
          url = Config.magasin.urls.client.analysis.gotoSample(p.appSession, s.objectId);
        }
        if (url) {
          upstream.history.push(url);
        }
      }
    },
    onClickShoppingCart: (hit: SearchHit) => {
      const source = getSource(hit);
      const object = getObject(hit);
      if (source && object) {
        let toAddToPickList;
        if (hit._type === 'collection') {
          // we know that source is an object, and that it most likely is not null
          const musitObject: ObjectData = (source: any);
          toAddToPickList = {
            value: {
              ...musitObject,
              uuid: musitObject.id.toString(),
              objectData: { ...musitObject, uuid: musitObject.id }
            },
            path: []
          };
        } else if (hit._type === 'sample') {
          // we know that source is a sample, and that it most likely is not null
          const sample: SampleData = (source: any);
          toAddToPickList = {
            value: flattenSample(
              p.appSession,
              p.predefined.sampleTypes ? p.predefined.sampleTypes.raw : [],
              object,
              sample
            ),
            path: []
          };
        }
        toggleObject$.next(toAddToPickList);
      }
    },
    getObject,
    getSampleTypeStr: (sample: SampleData): string => {
      if (p.predefined.sampleTypes) {
        return getSampleTypeAndSubType(
          p.predefined.sampleTypes.raw,
          sample.sampleTypeId,
          p.appSession
        );
      }
      return `Unknown: ${sample.sampleTypeId.toString()}`;
    },
    searchStore: p.searchStore
  };
}

export default loadPredefinedTypes(inject(store$, props)(ObjectSearchComponent));
