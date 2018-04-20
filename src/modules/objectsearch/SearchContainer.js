// @flow

import inject from 'react-rxjs/dist/RxInject';
import ObjectSearchComponent from './SearchComponent';
import store$, { actions } from './searchStore';
import { addObjects$, toggleObject$, isItemAdded } from '../../stores/pickList';
import pickList$ from '../../stores/pickList';
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
    onClickBreadcrumb: (node, isObject) => {
      if (node.nodeId) {
        upstream.history.push(
          isObject
            ? Config.magasin.urls.client.storagefacility.goToObjects(
                node.nodeId,
                p.store.appSession
              )
            : Config.magasin.urls.client.storagefacility.goToSamples(
                node.nodeId,
                p.store.appSession
              )
        );
      } else {
        upstream.history.push(
          Config.magasin.urls.client.storagefacility.goToRoot(p.store.appSession)
        );
      }
    },
    onSearch: () => {
      // actions.clear$; have to check this later, what is the meaning of this?(actions.clear$.next()???)
      actions.setLoading$.next();
      actions.search$.next({
        from: 0,
        limit: Number(localStorage.getItem('SearchPageSize') || 100),
        queryParam: p.store.searchStore.queryParam,
        museumId: p.store.appSession.museumId,
        collectionIds: p.store.appSession.collectionId,
        token: p.store.appSession.accessToken,
        storageFacilityReadRole: p.store.appSession.rolesForModules.storageFacilityRead
      });
    },
    onChangeQueryParam: (name: string, value: string) => {
      // actions.clear$; have to check this later, what is the meaning of this?(actions.clear$.next()???)
      actions.changeQuery$.next({ name, value });
    },
    onChangePage: (page: ChangePage) => {
      // actions.clear$; have to check this later, what is the meaning of this?(actions.clear$.next()???)
      actions.selectPage$.next({ page, appSession: p.store.appSession });
    },
    onClickHeader: (hit: SearchHit) => {
      const object = getSource(hit);
      if (object) {
        let url;
        if (hit._type === 'collection') {
          const o: ObjectData = (object: any);
          url = Config.magasin.urls.client.object.gotoObject(
            p.store.appSession,
            o.id.toString()
          );
        } else if (hit._type === 'sample') {
          const s: SampleData = (object: any);
          url = Config.magasin.urls.client.analysis.gotoSample(
            p.store.appSession,
            s.objectId
          );
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
            path: object.currentLocation
          };
        } else if (hit._type === 'sample') {
          // we know that source is a sample, and that it most likely is not null
          const sample: SampleData = (source: any);
          toAddToPickList = {
            value: flattenSample(
              p.store.appSession,
              p.store.predefined.sampleTypes ? p.store.predefined.sampleTypes.raw : [],
              object,
              sample
            ),
            path: sample.currentLocation
          };
        }
        toggleObject$.next(toAddToPickList);
      }
    },
    onClickAddAllToShoppingCart: (hit: Array<SearchHit>) => {
      const listOfItems = hit.map(h => {
        let toAddToPickList;
        const source = getSource(h);
        const object = getObject(h);
        if (source && object) {
          if (h._type === 'collection') {
            // we know that source is an object, and that it most likely is not null
            const musitObject: ObjectData = (source: any);
            toAddToPickList = {
              marked: true,
              value: {
                ...musitObject,
                uuid: musitObject.id.toString(),
                objectData: { ...musitObject, uuid: musitObject.id }
              },
              path: object.currentLocation
            };
          } else if (h._type === 'sample') {
            // we know that source is a sample, and that it most likely is not null
            const sample: SampleData = (source: any);
            toAddToPickList = {
              marked: true,
              value: flattenSample(
                p.store.appSession,
                p.store.predefined.sampleTypes ? p.store.predefined.sampleTypes.raw : [],
                object,
                sample
              ),
              path: sample.currentLocation
            };
          }
        }
        return toAddToPickList;
      });
      addObjects$.next(listOfItems);
    },
    getObject,
    getSampleTypeStr: (sample: SampleData): string => {
      if (p.store.predefined.sampleTypes) {
        return getSampleTypeAndSubType(
          p.store.predefined.sampleTypes.raw,
          sample.sampleTypeId,
          p.store.appSession
        );
      }
      return `Unknown: ${sample.sampleTypeId.toString()}`;
    },
    searchStore: p.store.searchStore,

    isObjectAdded: (hit: SearchHit): boolean => {
      return isItemAdded(hit._source, p.pickList && p.pickList.objects);
    }
  };
}

const data = {
  store$,
  pickList$
};

export default loadPredefinedTypes(inject(data, props)(ObjectSearchComponent));
