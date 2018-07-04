// @flow

import { Observable, Subject } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { range, omit } from 'lodash';

import { SearchResult } from '../types/search';
import { MuseumId, CollectionId } from '../types/ids';
import { AppSession } from '../types/appSession';
import { Maybe, TODO } from '../types/common';

/**
 * Store types
 */

export type QueryParam = {
  museumNo?: Maybe<string>;
  museumNoAsANumber?: Maybe<string>;
  subNo?: Maybe<string>;
  term?: Maybe<string>;
  q?: Maybe<string>;
};

export type SearchParam = {
  queryParam: QueryParam;
  from: number;
  limit: number;
  museumId: MuseumId;
  collectionIds: CollectionId;
  token: string;
  storageFacilityReadRole?: boolean;
  databaseSearch?: boolean;
};

export type ChangePage = number | 'next' | 'previous';

export type SelectPage = { page: ChangePage; appSession: AppSession };

export type ChangeQuery = { name: string; value: string };

export type Endpoint<E> = (e: E) => Observable<SearchResult>;

export type Paging = {
  totalPages: number;
  showPages: Array<number>;
  currentPage: Maybe<number>;
};

export type SearchStoreState = {
  loading: boolean;
  from: number;
  limit: number;
  pagination: Maybe<Paging>;
  queryParam: QueryParam;
  result: Maybe<SearchResult>;
};

/**
 * Actions
 *
 * All the actions are provided trough the store factory.
 */
type Actions = {
  clear$: Subject<void>;
  setLoading$: Subject<void>;
  setLoadingSelectPage$: Subject<void>;
  changeQuery$: Subject<ChangeQuery>;
  selectPage$: Subject<SelectPage>;
  search$: Subject<SearchParam>;
  setQueryParam$: Subject<QueryParam>;
  setStore$: Subject<SearchStoreState>;
};

const setLoading$: Subject<void> = createAction('search');
const setLoadingSelectPage$: Subject<void> = createAction('setLoadingSelectPage');
export const clear$: Subject<void> = createAction('clear');
const changeQuery$: Subject<ChangeQuery> = createAction('changeQuery');
const selectPage$: Subject<SelectPage> = createAction('selectPage');
const search$: Subject<SearchParam> = createAction('searchResult');
const setQueryParam$: Subject<QueryParam> = createAction('setQueryParam');
const setStore$: Subject<SearchStoreState> = createAction('setStore');

/**
 * Store setup
 */

export function updatePagination(result: SearchResult, from: number, limit: number) {
  const totalPages = Math.ceil(result.hits.total / limit);
  const currentPage = from / limit + 1;
  const showPageFrom = Math.max(1, currentPage - 5);
  const showPageTo =
    currentPage <= 10
      ? Math.min(totalPages + 1, 11)
      : Math.min(totalPages, currentPage + 5) + 1;

  return {
    totalPages,
    currentPage,
    showPages: totalPages === 0 ? [] : range(showPageFrom, showPageTo)
  };
}

function reducer$<E>(
  actions: Actions,
  searchEndpoint: Endpoint<E>,
  toEndpointParam: (params: SearchParam) => E
) {
  return Observable.merge(
    actions.clear$.map(() => () => initStoreState()),
    actions.setLoading$.map(() => (state: TODO) => ({
      ...state,
      loading: true,
      pagination: null,
      from: 0,
      limit: Number(localStorage.getItem('SearchPageSize') || 10)
    })),
    actions.setLoadingSelectPage$.map(() => (state: TODO) => ({
      ...state,
      loading: true
    })),
    actions.search$
      .map(toEndpointParam)
      .switchMap(searchEndpoint)
      .map(result => (state: TODO) => ({
        ...state,
        loading: false,
        result,
        pagination: updatePagination(result, state.from, state.limit)
      })),
    actions.selectPage$.map(props => (state: SearchStoreState) => {
      const toPage = (page: ChangePage): number => {
        switch (page) {
          case 'next':
            return state.from + state.limit;
          case 'previous':
            return state.from - state.limit;
          default:
            return (page - 1) * state.limit;
        }
      };
      const newState = {
        ...state,
        from: toPage(props.page)
      };
      actions.search$.next({
        queryParam: newState.queryParam,
        from: newState.from,
        limit: newState.limit,
        museumId: props.appSession.museumId,
        collectionIds: props.appSession.collectionId,
        token: props.appSession.accessToken,
        storageFacilityReadRole: props.appSession.rolesForModules.storageFacilityRead
      });
      return newState;
    }),
    actions.changeQuery$.map(param => (state: TODO) => {
      const queryParam = { ...state.queryParam };
      if (param.value === '') {
        return { ...state, queryParam: omit(queryParam, param.name) };
      } else {
        queryParam[param.name] = param.value;
        return { ...state, queryParam };
      }
    }),
    actions.setQueryParam$.map(queryParam => (state: TODO) => {
      return { ...state, queryParam };
    }),
    actions.setStore$.map(store => (state: TODO) => {
      return { ...state, ...store };
    })
  );
}

export function initStoreState(): SearchStoreState {
  return {
    loading: false,
    from: 0,
    limit: Number(localStorage.getItem('SearchPageSize') || 10),
    queryParam: {},
    pagination: null,
    result: null
  };
}

export const defaultActions = {
  clear$,
  setLoading$,
  setLoadingSelectPage$,
  changeQuery$,
  selectPage$,
  search$,
  setQueryParam$,
  setStore$
};

export function createStoreWithActions<E>(
  name: string,
  actions: Actions,
  endpoint: Endpoint<E>,
  toEndpointParam: (params: SearchParam) => E
) {
  const store$ = createStore(
    name + 'SearchStore',
    reducer$(actions, endpoint, toEndpointParam),
    initStoreState()
  );
  return {
    store$,
    actions
  };
}

function createSearchStore<E>(
  name: string,
  endpoint: Endpoint<E>,
  toEndpointParam: (params: SearchParam) => E
) {
  return createStoreWithActions(name, defaultActions, endpoint, toEndpointParam);
}

export default createSearchStore;
