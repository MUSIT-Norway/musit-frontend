// @flow

import { Observable } from 'rxjs';
import createStore from 'react-rxjs/dist/RxStore';
import appSession$ from '../../stores/appSession';
import predefined$ from '../../stores/predefined';
import createSearchStore from '../../search/searchStore';
import { objectSearch as createSearchEndpoint } from '../../models/objects/search';
import { simpleGet } from '../../shared/RxAjax';

const searchEndpoint = createSearchEndpoint(simpleGet);

const objectSearchStore = createSearchStore('objectSearch', searchEndpoint, props => ({
  queryParam: props.queryParam,
  from: props.from,
  limit: props.limit,
  museumId: props.museumId,
  collectionIds: props.collectionIds,
  token: props.token
}));

export const { store$, actions } = objectSearchStore;

const reducer$ = Observable.combineLatest(
  appSession$,
  store$,
  predefined$,
  (a, s, p) => () => ({
    appSession: a,
    searchStore: s,
    predefined: p
  })
);

export default createStore('objectSearchAggregated', reducer$);
