// @flow
import { Observable, Subject } from 'rxjs';
import Analysis from '../models/analysis';
import Sample from '../models/sample';
import Conservation from '../models/conservation';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import type { Reducer } from 'react-rxjs';
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

export const setLoadingConservationTypes$: Subject<*> = createAction(
  'setLoadingConservationTypes$'
);
export const loadConservationTypes$: Subject<*> = createAction('loadConservationTypes$');
const loadConservationTypesAction$: Observable<*> = loadConservationTypes$.switchMap(
  Conservation.getConservationTypes(simpleGet)
);

type State = Predefined & {
  loadingSampleTypes: boolean,
  loadingAnalysisTypes: boolean,
  loadingConservationTypes: boolean
};

export const initialState: State = {
  analysisLabList: null,
  categories: null,
  sampleTypes: null,
  analysisTypes: null,
  conservationTypes: null,
  purposes: null,
  storageContainers: null,
  storageMediums: null,
  treatments: null,
  loadingSampleTypes: false,
  loadingAnalysisTypes: false,
  loadingConservationTypes: false
};

export function reducer$(actions: { [string]: Observable<*> }): Observable<Reducer<any>> {
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
    })),
    actions.setLoadingConservationTypes$.map(() => state => ({
      ...state,
      loadingConservationTypes: true
    })),
    actions.loadConservationTypes$.map(conservationTypes => state => ({
      ...state,
      conservationTypes,
      loadingConservationTypes: false
    }))
  );
}

export const store$ = (actions: { [string]: Observable<*> }) =>
  createStore('predefined', reducer$(actions), initialState, KEEP_ALIVE);

const predefined$ = store$({
  setLoadingSampleTypes$,
  loadSampleTypes$: loadSampleTypesAction$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$: loadAnalysisTypesAction$,
  setLoadingConservationTypes$,
  loadConservationTypes$: loadConservationTypesAction$
});

export default predefined$;
