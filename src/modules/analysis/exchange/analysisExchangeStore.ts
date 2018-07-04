// @flow
import { Observable, Subject } from 'rxjs';
import analysisStoreInstance$, {
  clearStore$ as clearAnalysisStore$
} from '../analysisStore';
import { AnalysisStoreState } from '../analysisStore';
import { createStore } from 'react-rxjs';
import { createAction } from '../../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import {
  getHeadersForType,
  getResultHeadersForType,
  createExchangeTemplate
} from './exchangeTemplate';

import { AnalysisType } from '../../../types/analysis';
import { AnalysisResultTypes } from '../../../types/analysisResult';
import { ResultExchangeTemplates } from './exchangeTemplate';
import { Star, Maybe, TODO } from '../../../types/common';

type Actions = {
  importResult$: Observable<Star>;
  uploadResultFailed$: Observable<Star>;
  clearStoreAction$: Observable<Star>;
  setAnalysisTypes$: Observable<Star>;
};

export type StoreState = {
  exportTemplate: Array<ResultExchangeTemplates>;
  importHeaders: Array<string>;
  resultHeaders: Array<string>;
  importResult: {
    rows: Array<ResultExchangeTemplates>;
  };
  importErrors: Array<string>;
  analysisResultType: Maybe<AnalysisResultTypes>;
} & AnalysisStoreState;

export const importResult$: Subject<Star> = createAction('importResult');
export const uploadResultFailed$: Subject<Star> = createAction('uploadResultFailed');
export const clearStore$: Subject<Star> = createAction('clearStore');
export const clearStoreAction$: Observable<Star> = clearStore$.do(() =>
  clearAnalysisStore$.next()
);
export const setAnalysisTypes$: Subject<Star> = createAction('setAnalysisTypes');

const findAnalysisResultType = (
  analysisStore: AnalysisStoreState | StoreState,
  analysisTypes: Array<AnalysisType>
): Maybe<AnalysisResultTypes> => {
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
  analysisStore$: Observable<Star>
): Observable<Reducer<StoreState>> =>
  Observable.merge(
    analysisStore$.map(analysisStore => (state: TODO) =>
      mapAnalysisStoreToState(analysisStore, state)
    ),
    actions.importResult$.map(mapImportResult),
    actions.clearStoreAction$.map(() => () => initStoreState()),
    actions.uploadResultFailed$.map(importErrors => (state: TODO) => ({
      ...state,
      importErrors
    })),
    actions.setAnalysisTypes$.map(analysisTypes => (state: TODO) =>
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
  analysisStore$: Observable<Star> = analysisStoreInstance$
) =>
  createStore(
    'analysisExchangeStore',
    reducer$(actions$, analysisStore$),
    initStoreState()
  );

const analysisExchangeStoreSingleton = analysisExchangeStore$();

export default analysisExchangeStoreSingleton;
