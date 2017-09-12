// @flow
import { Observable, Subject } from 'rxjs';
import analysisStoreInstance$, {
  clearStore$ as clearAnalysisStore$
} from '../analysisStore';
import type { AnalysisStoreState } from '../analysisStore';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import {
  getHeadersForType,
  getResultHeadersForType,
  createExchangeTemplate
} from './exchangeTemplate';

import type { AnalysisType } from 'types/analysis';
import type { AnalysisResultTypes } from 'types/analysisResult';
import type { ResultExchangeTemplates } from './exchangeTemplate';

type Actions = {
  importResult$: Observable<*>,
  uploadResultFailed$: Observable<*>,
  clearStoreAction$: Observable<*>,
  setAnalysisTypes$: Observable<*>
};

export type StoreState = {
  exportTemplate: Array<ResultExchangeTemplates>,
  importHeaders: Array<string>,
  resultHeaders: Array<string>,
  importResult: {
    rows: Array<ResultExchangeTemplates>
  },
  importErrors: Array<string>,
  analysisResultType: ?AnalysisResultTypes
} & AnalysisStoreState;

export const importResult$: Subject<*> = createAction('importResult');
export const uploadResultFailed$: Subject<*> = createAction('uploadResultFailed');
export const clearStore$: Subject<*> = createAction('clearStore');
export const clearStoreAction$: Observable<*> = clearStore$.do(() =>
  clearAnalysisStore$.next()
);
export const setAnalysisTypes$: Subject<*> = createAction('setAnalysisTypes');

const findAnalysisResultType = (
  analysisStore: AnalysisStoreState | StoreState,
  analysisTypes: Array<AnalysisType>
): ?AnalysisResultTypes => {
  if (analysisStore.analysis) {
    const analysisTypeId = analysisStore.analysis.analysisTypeId;
    const res = analysisTypes.find(t => t.id === analysisTypeId);
    if (res && res.extraResultType) {
      return res.extraResultType;
    }
    return 'GenericResult';
  }
  return null;
};

export const importGenericResultHeader = ['resultExternalRef', 'resultComment'];

const mapImportResult = (results: Array<ResultExchangeTemplates>) => (
  state: StoreState
) => {
  if (state.importHeaders.length > 0) {
    return { ...state, importResult: { rows: results } };
  } else {
    return { ...state, importResult: { error: 'no.headers', rows: [] } };
  }
};

export const mapAnalysisStoreToState = (
  analysisStore: AnalysisStoreState,
  state: StoreState
) => {
  const analysisResultType = findAnalysisResultType(
    analysisStore,
    state.analysisTypes || []
  );
  return {
    ...state,
    analysis: analysisStore.analysis,
    importHeaders: analysisResultType ? getHeadersForType(analysisResultType) : [],
    resultHeaders: analysisResultType ? getResultHeadersForType(analysisResultType) : [],
    exportTemplate: createExchangeTemplate(analysisStore.analysis, analysisResultType),
    analysisResultType: analysisResultType
  };
};

const mapAnalysisTypesToState = (
  state: StoreState,
  analysisTypes: Array<AnalysisType>
) => {
  const analysisResultType = findAnalysisResultType(state, analysisTypes || []);

  return {
    ...state,
    analysisTypes,
    analysisResultType: analysisResultType,
    importHeaders: analysisResultType ? getHeadersForType(analysisResultType) : [],
    resultHeaders: analysisResultType ? getResultHeadersForType(analysisResultType) : [],
    exportTemplate: createExchangeTemplate(state.analysis, analysisResultType)
  };
};

export const reducer$ = (
  actions: Actions,
  analysisStore$: Observable<*>
): Observable<Reducer<StoreState>> =>
  Observable.merge(
    analysisStore$.map(analysisStore => state =>
      mapAnalysisStoreToState(analysisStore, state)
    ),
    actions.importResult$.map(mapImportResult),
    actions.clearStoreAction$.map(() => () => initStoreState()),
    actions.uploadResultFailed$.map(importErrors => state => ({
      ...state,
      importErrors
    })),
    actions.setAnalysisTypes$.map(analysisTypes => state =>
      mapAnalysisTypesToState(state, analysisTypes)
    )
  );

export const initStoreState = () => ({
  exportTemplate: [],
  importHeaders: [],
  resultHeaders: [],
  importResult: { rows: [] },
  importErrors: [],
  analysisTypes: [],
  analysisResultType: null
});

export const analysisExchangeStore$ = (
  actions$: Actions = {
    importResult$,
    uploadResultFailed$,
    clearStoreAction$,
    setAnalysisTypes$
  },
  analysisStore$: Observable<*> = analysisStoreInstance$
) =>
  createStore(
    'analysisExchangeStore',
    reducer$(actions$, analysisStore$),
    initStoreState()
  );

const analysisExchangeStoreSingleton = analysisExchangeStore$();

export default analysisExchangeStoreSingleton;
