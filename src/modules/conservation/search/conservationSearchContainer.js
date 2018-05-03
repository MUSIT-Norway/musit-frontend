// @flow

import { Observable } from 'rxjs';
import inject from 'react-rxjs/dist/RxInject';
import { conservationSearch } from '../../../models/conservation/conservationSearch';
import createSearchStore from '../../../search/searchStore';
import type { ChangePage } from '../../../search/searchStore';
import appSession$ from '../../../stores/appSession';
import { simpleGet } from '../../../shared/RxAjax';
import ConservationSearchComponent from './conservationSearchComponent';
import type { SearchResult } from 'types/search';
import type { ConservationSearchProps } from 'models/conservation/conservationSearch';
import type { History } from '../../../types/Routes';
import Config from '../../../config';
import { loadPredefinedConservationTypes } from '../../../stores/predefinedConservationLoader';
import predefined$ from '../../../stores/predefinedConservation';
import type { ConservationType } from '../../../types/conservation';

const searchEndpoint: (
  p: ConservationSearchProps
) => Observable<SearchResult> = conservationSearch(simpleGet);

const { store$, actions } = createSearchStore('conservation', searchEndpoint, props => ({
  queryParam: props.queryParam,
  from: props.from,
  limit: props.limit,
  museumId: props.museumId,
  collectionIds: props.collectionIds,
  token: props.token
}));

const stores = () =>
  Observable.combineLatest(appSession$, store$, predefined$, (a, s, p) => ({
    appSession: a,
    searchStore: s,
    predefined: p
  }));

const props = (storeProps, upstream: { history: History }) => {
  return {
    onSearch: () => {
      actions.setLoading$.next();
      actions.search$.next({
        from: 0,
        limit: storeProps.searchStore.limit,
        queryParam: storeProps.searchStore.queryParam,
        museumId: storeProps.appSession.museumId,
        collectionIds: storeProps.appSession.collectionId,
        token: storeProps.appSession.accessToken
      });
    },
    onChangePage: (page: ChangePage) => {
      actions.selectPage$.next({ page, appSession: storeProps.appSession });
    },
    onChangeQueryParam: (name: string, value: string) => {
      actions.setLoadingSelectPage$.next();
      actions.changeQuery$.next({ name, value });
    },
    goToConservation: (id: number, subEventId: number) => {
      id
        ? upstream.history.push(
            Config.magasin.urls.client.conservation.viewConservationForExpandedSubEvent(
              storeProps.appSession,
              id,
              subEventId
            )
          )
        : upstream.history.push(
            Config.magasin.urls.client.conservation.viewConservation(
              storeProps.appSession,
              subEventId
            )
          );
    },
    getConservationTypeText: (id: number): ?string => {
      const type: ?ConservationType =
        storeProps.predefined.conservationTypes &&
        storeProps.predefined.conservationTypes.find(at => at.id === id);
      return type
        ? storeProps.appSession.language.isEn ? type.enName : type.noName
        : null;
    },
    searchStore: storeProps.searchStore
  };
};

export default loadPredefinedConservationTypes(
  inject(stores, props)(ConservationSearchComponent)
);
