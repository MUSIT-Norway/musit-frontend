// @flow
import { Observable, Subject } from 'rxjs';
import Analysis from '../models/analysis';
import Sample from '../models/sample';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import { KEEP_ALIVE } from './constants';
import type { Predefined } from 'types/predefined';
import { simpleGet } from '../shared/RxAjax';

export const setLoadingSampleTypes$: Subject<*> = createAction('setLoadingSampleTypes$');
export const loadSampleTypes$: Subject<*> = createAction('loadSampleTypes$');
const loadSampleTypesAction$: Observable<*> = loadSampleTypes$.switchMap(
  Sample.loadPredefinedTypes(simpleGet)
);
export const setLoadingAnalysisTypes$: Subject<*> = createAction(
  'setLoadingAnalysisTypes$'
);
export const loadAnalysisTypes$: Subject<*> = createAction('loadAnalysisTypes$');
const loadAnalysisTypesAction$: Observable<*> = loadAnalysisTypes$.switchMap(
  Analysis.loadPredefinedTypes(simpleGet)
);

type State = Predefined & {
  loadingSampleTypes: boolean,
  loadingAnalysisTypes: boolean
};

export const initialState: State = {
  analysisLabList: null,
  categories: null,
  sampleTypes: null,
  analysisTypes: null,
  purposes: null,
  storageContainers: null,
  storageMediums: null,
  treatments: null,
  loadingSampleTypes: false,
  loadingAnalysisTypes: false
};

export function reducer$(actions: {
  [string]: Observable<*>
}): Observable<Reducer<State>> {
  return Observable.merge(
    actions.setLoadingSampleTypes$.map(() => state => ({
      ...state,
      loadingSampleTypes: true
    })),
    actions.loadSampleTypes$.map(sampleTypes => state => ({
      ...state,
      ...sampleTypes,
      loadingSampleTypes: false
    })),
    actions.setLoadingAnalysisTypes$.map(() => state => ({
      ...state,
      loadingAnalysisTypes: true
    })),
    actions.loadAnalysisTypes$.map(analysisTypes => state => ({
      ...state,
      ...analysisTypes,
      loadingAnalysisTypes: false
    }))
  );
}

export const store$ = (actions: { [string]: Observable<*> }) =>
  createStore('predefined', reducer$(actions), initialState, KEEP_ALIVE);

const predefined$ = store$({
  setLoadingSampleTypes$,
  loadSampleTypes$: loadSampleTypesAction$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$: loadAnalysisTypesAction$
});

export default predefined$;
