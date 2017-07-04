// @flow

import analysisStoreInstance$, {
  clearStore$ as clearAnalysisStore$
} from '../analysisStore';

import { Observable, Subject } from 'rxjs';

import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import {
  getHeadersForType,
  getResultHeadersForType,
  createExchangeTemplate
} from './exchangeTemplate';

import type { AnalysisType } from 'types/analysis';
import type { AnalysisResultTypes } from 'types/analysisResult';
import type { ResultExchangeTemplates } from './exchangeTemplate';

type Actions = {
  importResult$: Subject,
  uploadResultFailed$: Subject,
  clearStore$: Subject,
  setAnalysisTypes$: Subject
};

//todo this should be declared in the analysis store
export type Event = {
  id: number,
  objectType: 'collection' | 'sample',
  objectId: string,
  museumNo?: ?string,
  subNo?: ?string,
  arkFindingNo?: ?string,
  term?: ?string,
  originatedObjectUuid?: ?string,
  sampleNum?: ?number,
  sampleId?: ?string,
  sampleType?: ?string
};

//todo this should be declared in the analysis store
export type AnalysisCollectionFromStore = {
  id: number,
  analysisTypeId: number,
  events?: ?Array<Event>
};

//todo this should be declared in the analysis store
export type AnalysisStoreState = {
  analysis?: ?AnalysisCollectionFromStore
};

export type StoreState = {
  exportTemplate: Array<ResultExchangeTemplates>,
  importHeaders: Array<string>,
  resultHeaders: Array<string>,
  importResult: {
    rows: Array<ResultExchangeTemplates>
  },
  importErrors: Array<string>,
  analysisTypes: Array<AnalysisType>,
  analysisResultType: ?AnalysisResultTypes
} & AnalysisStoreState;

export const importResult$ = createAction('importResult');
export const uploadResultFailed$ = createAction('uploadResultFailed');
export const clearStore$ = createAction('clearStore').do(clearAnalysisStore$);
export const setAnalysisTypes$ = createAction('setAnalysisTypes');

const findAnalysisResultType = (
  analysisStore: AnalysisStoreState,
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
    { analysis: analysisStore.analysis },
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
  const analysisResultType = findAnalysisResultType(
    { analysis: state.analysis },
    analysisTypes || []
  );

  return {
    ...state,
    analysisTypes,
    analysisResultType: analysisResultType,
    importHeaders: analysisResultType ? getHeadersForType(analysisResultType) : [],
    resultHeaders: analysisResultType ? getResultHeadersForType(analysisResultType) : [],
    exportTemplate: createExchangeTemplate(state.analysis, analysisResultType)
  };
};

export const reducer$ = (actions: Actions, analysisStore$: Observable) =>
  Observable.merge(
    analysisStore$.map(analysisStore => state =>
      mapAnalysisStoreToState(analysisStore, state)),
    actions.importResult$.map(mapImportResult),
    actions.clearStore$.map(() => () => initStoreState()),
    actions.uploadResultFailed$.map(importErrors => state => ({
      ...state,
      importErrors
    })),
    actions.setAnalysisTypes$.map(analysisTypes => state =>
      mapAnalysisTypesToState(state, analysisTypes))
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
    clearStore$,
    setAnalysisTypes$
  },
  analysisStore$: Observable = analysisStoreInstance$
) =>
  createStore(
    'analysisExchangeStore',
    reducer$(actions$, analysisStore$),
    Observable.of(initStoreState())
  );

const analysisExchangeStoreSingleton = analysisExchangeStore$();
export default analysisExchangeStoreSingleton;
