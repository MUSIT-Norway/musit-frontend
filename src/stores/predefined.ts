// @flow
import { Observable, Subject } from 'rxjs';
import Analysis from '../models/analysis';
import Sample from '../models/sample';
import Conservation from '../models/conservation';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { KEEP_ALIVE } from './constants';
import { Predefined } from '../types/predefined';
import { simpleGet } from '../shared/RxAjax';
import { Star, TODO } from '../types/common';

export const setLoadingSampleTypes$: Subject<Star> = createAction(
  'setLoadingSampleTypes$'
);
export const loadSampleTypes$: Subject<Star> = createAction('loadSampleTypes$');
const loadSampleTypesAction$: Observable<Star> = loadSampleTypes$.switchMap(
  Sample.loadPredefinedTypes(simpleGet)
);
export const setLoadingAnalysisTypes$: Subject<Star> = createAction(
  'setLoadingAnalysisTypes$'
);
export const loadAnalysisTypes$: Subject<Star> = createAction('loadAnalysisTypes$');
const loadAnalysisTypesAction$: Observable<Star> = loadAnalysisTypes$.switchMap(
  Analysis.loadPredefinedTypes(simpleGet)
);

export const setLoadingConservationTypes$: Subject<Star> = createAction(
  'setLoadingConservationTypes$'
);
export const loadConservationTypes$: Subject<Star> = createAction(
  'loadConservationTypes$'
);
const loadConservationTypesAction$: Observable<Star> = loadConservationTypes$.switchMap(
  Conservation.getConservationTypes(simpleGet)
);

type State = Predefined & {
  loadingSampleTypes: boolean;
  loadingAnalysisTypes: boolean;
  loadingConservationTypes: boolean;
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

export function reducer$(actions: {
  [key: string]: Observable<Star>;
}): Observable<Reducer<any>> {
  return Observable.merge(
    actions.setLoadingSampleTypes$.map(() => (state: TODO) => ({
      ...state,
      loadingSampleTypes: true
    })),
    actions.loadSampleTypes$.map((sampleTypes: TODO) => (state: TODO) => ({
      ...state,
      ...sampleTypes,
      loadingSampleTypes: false
    })),
    actions.setLoadingAnalysisTypes$.map(() => (state: TODO) => ({
      ...state,
      loadingAnalysisTypes: true
    })),
    actions.loadAnalysisTypes$.map(analysisTypes => (state: TODO) => ({
      ...state,
      ...analysisTypes,
      loadingAnalysisTypes: false
    })),
    actions.setLoadingConservationTypes$.map(() => (state: TODO) => ({
      ...state,
      loadingConservationTypes: true
    })),
    actions.loadConservationTypes$.map(conservationTypes => (state: TODO) => ({
      ...state,
      conservationTypes,
      loadingConservationTypes: false
    }))
  );
}

export const store$ = (actions: { [key: string]: Observable<Star> }) =>
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
