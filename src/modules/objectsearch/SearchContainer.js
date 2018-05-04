// @flow

import inject from 'react-rxjs/dist/RxInject';
import ObjectSearchComponent from './SearchComponent';
//import store$, { actions } from './searchStore';
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

import { Observable } from 'rxjs';
import appSession$ from '../../stores/appSession';
import predefined$ from '../../stores/predefined';
import createSearchStore from '../../search/searchStore';
import { objectSearch } from '../../models/objects/search';
import { simpleGet } from '../../shared/RxAjax';

const searchEndpoint = objectSearch(simpleGet);

const { store$, actions } = createSearchStore('object', searchEndpoint, props => ({
  queryParam: props.queryParam,
  from: props.from,
  limit: props.limit,
  museumId: props.museumId,
  collectionIds: props.collectionIds,
  token: props.token,
  storageFacilityReadRole: props.storageFacilityReadRole
}));

const stores = () =>
  Observable.combineLatest(appSession$, store$, predefined$, pickList$, (a, s, p, l) => ({
    appSession: a,
    searchStore: s,
    predefined: p,
    pickList: l
  }));

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

function props(storeProps, upstream: { history: History }) {
  return {
    onClickBreadcrumb: (node, isObject) => {
      if (node.nodeId) {
        upstream.history.push(
          isObject
            ? Config.magasin.urls.client.storagefacility.goToObjects(
                node.nodeId,
                storeProps.appSession
              )
            : Config.magasin.urls.client.storagefacility.goToSamples(
                node.nodeId,
                storeProps.appSession
              )
        );
      } else {
        upstream.history.push(
          Config.magasin.urls.client.storagefacility.goToRoot(storeProps.appSession)
        );
      }
    },
    onSearch: () => {
      // actions.clear$; have to check this later, what is the meaning of this?(actions.clear$.next()???)
      actions.setLoading$.next();
      actions.search$.next({
        from: 0,
        limit: Number(localStorage.getItem('SearchPageSize') || 100),
        queryParam: storeProps.searchStore.queryParam,
        museumId: storeProps.appSession.museumId,
        collectionIds: storeProps.appSession.collectionId,
        token: storeProps.appSession.accessToken,
        storageFacilityReadRole: storeProps.appSession.rolesForModules.storageFacilityRead
      });
      actions.setQueryParam$.next(storeProps.searchStore.queryParam);
    },
    onChangeQueryParam: (name: string, value: string) => {
      actions.setStore$.next(storeProps.searchStore);
      actions.changeQuery$.next({ name, value });
    },
    onChangePage: (page: ChangePage) => {
      actions.setLoadingSelectPage$.next();
      actions.selectPage$.next({ page, appSession: storeProps.appSession });
      actions.setQueryParam$.next(storeProps.searchStore.queryParam);
    },
    onClickHeader: (hit: SearchHit) => {
      const object = getSource(hit);
      if (object) {
        let url;
        if (hit._type === 'collection') {
          const o: ObjectData = (object: any);
          url = Config.magasin.urls.client.object.gotoObject(
            storeProps.appSession,
            o.id.toString()
          );
        } else if (hit._type === 'sample') {
          const s: SampleData = (object: any);
          url = Config.magasin.urls.client.analysis.gotoSample(
            storeProps.appSession,
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
              storeProps.appSession,
              storeProps.predefined.sampleTypes
                ? storeProps.predefined.sampleTypes.raw
                : [],
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
                storeProps.appSession,
                storeProps.predefined.sampleTypes
                  ? storeProps.predefined.sampleTypes.raw
                  : [],
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
      if (storeProps.predefined.sampleTypes) {
        return getSampleTypeAndSubType(
          storeProps.predefined.sampleTypes.raw,
          sample.sampleTypeId,
          storeProps.appSession
        );
      }
      return `Unknown: ${sample.sampleTypeId.toString()}`;
    },
    searchStore: storeProps.searchStore,

    isObjectAdded: (hit: SearchHit): boolean => {
      return isItemAdded(hit._source, storeProps.pickList && storeProps.pickList.objects);
    },
    onClearSearch: () => {
      actions.setStore$.next(storeProps.searchStore);
      actions.setQueryParam$.next({});
    }
  };
}

export default loadPredefinedTypes(inject(stores, props)(ObjectSearchComponent));
