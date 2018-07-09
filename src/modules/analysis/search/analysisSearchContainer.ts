// @flow

import { Observable } from 'rxjs';
import { inject } from 'react-rxjs';
import { analysisSearch } from '../../../models/analysis/analysisSearch';
import createSearchStore from '../../../search/searchStore';
import { ChangePage } from '../../../search/searchStore';
import appSession$ from '../../../stores/appSession';
import { simpleGet } from '../../../shared/RxAjax';
import AnalysisSearchComponent from './analysisSearchComponent';
import { SearchResult } from '../../../types/search';
import { AnalysisSearchProps } from '../../../models/analysis/analysisSearch';
import { History } from 'history';
import Config from '../../../config';
import { loadPredefinedTypes } from '../../../stores/predefinedLoader';
import predefined$ from '../../../stores/predefined';
import { AnalysisType } from '../../../types/analysis';
import { TODO, Maybe } from '../../../types/common';

const searchEndpoint: (
  p: AnalysisSearchProps
) => Observable<SearchResult> = analysisSearch(simpleGet);

const { store$, actions } = createSearchStore(
  'analysis',
  searchEndpoint,
  (props: TODO) => ({
    queryParam: props.queryParam,
    from: props.from,
    limit: props.limit,
    museumId: props.museumId,
    collectionIds: props.collectionIds,
    token: props.token
  })
);

const stores = () =>
  Observable.combineLatest(appSession$, store$, predefined$, (a, s, p) => ({
    appSession: a,
    searchStore: s,
    predefined: p
  }));

const props = (storeProps: TODO, upstream: { history: History }) => {
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
      actions.setQueryParam$.next(storeProps.searchStore.queryParam);
    },
    onChangePage: (page: ChangePage) => {
      actions.setLoadingSelectPage$.next();
      actions.selectPage$.next({ page, appSession: storeProps.appSession });
      actions.setQueryParam$.next(storeProps.searchStore.queryParam);
    },
    onChangeQueryParam: (name: string, value: string) => {
      actions.setStore$.next(storeProps.searchStore);
      actions.changeQuery$.next({ name, value });
    },
    goToAnalysis: (id: number) => {
      upstream.history.push(
        Config.magasin.urls.client.analysis.viewAnalysis(storeProps.appSession, id)
      );
    },
    goToObject: (id: string, type: string) => {
      if (type === 'collection') {
        upstream.history.push(
          Config.magasin.urls.client.object.gotoObject(storeProps.appSession, id)
        );
      } else if (type === 'sample') {
        upstream.history.push(
          Config.magasin.urls.client.analysis.gotoSample(storeProps.appSession, id)
        );
      }
    },
    getAnalysisTypeText: (id: number): Maybe<string> => {
      const type: Maybe<AnalysisType> =
        storeProps.predefined.analysisTypes &&
        storeProps.predefined.analysisTypes.find((at: AnalysisType) => at.id === id);
      return type
        ? storeProps.appSession.language.isEn
          ? type.enName
          : type.noName
        : null;
    },
    searchStore: storeProps.searchStore,
    history: (url: TODO) => url && upstream.history.push(url),
    appSession: storeProps.appSession
  };
};

export default loadPredefinedTypes(inject(stores, props)(AnalysisSearchComponent));
