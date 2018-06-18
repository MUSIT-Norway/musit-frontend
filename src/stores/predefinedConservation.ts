// @flow
import { Observable, Subject } from 'rxjs';
import Conservation from '../models/conservation';
import Sample from '../models/sample';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { KEEP_ALIVE } from './constants';
import { PredefinedConservation } from '../types/predefinedConservation';
import { simpleGet } from '../shared/RxAjax';
import { Star, TODO } from '../types/common';

export const setLoadingSampleTypes$: Subject<Star> = createAction(
  'setLoadingSampleTypes$'
);
export const loadSampleTypes$: Subject<Star> = createAction('loadSampleTypes$');
const loadSampleTypesAction$: Observable<Star> = loadSampleTypes$.switchMap(
  Sample.loadSampleTypes(simpleGet)
);

export const setLoadingConservationTypes$: Subject<Star> = createAction(
  'setLoadingConservationTypes$'
);
export const loadConservationTypes$: Subject<Star> = createAction(
  'loadConservationTypes$'
);
const loadConservationTypesAction$: Observable<Star> = loadConservationTypes$.switchMap(
  Conservation.loadPredefinedConservationTypes(simpleGet)
);

type State = PredefinedConservation & {
  loadingSampleTypes: boolean;
  loadingConservationTypes: boolean;
};

export const initialState: State = {
  sampleTypes: null,
  loadingSampleTypes: false,
  conservationTypes: null,
  loadingConservationTypes: false,
  keywordList: null,
  materialList: null,
  roleList: null,
  conditionCodeList: null,
  materialDeterminationList: null
};

export function reducer$(actions: {
  [key: string]: Observable<Star>;
}): Observable<Reducer<any>> {
  return Observable.merge(
    actions.setLoadingSampleTypes$.map(() => (state: TODO) => ({
      ...state,
      loadingSampleTypes: true
    })),
    actions.loadSampleTypes$.map(sampleTypes => (state: TODO) => ({
      ...state,
      sampleTypes: sampleTypes,
      loadingSampleTypes: false
    })),
    actions.setLoadingConservationTypes$.map(() => (state: TODO) => ({
      ...state,
      loadingConservationTypes: true
    })),
    actions.loadConservationTypes$.map(conservationTypes => (state: TODO) => ({
      ...state,
      ...conservationTypes,
      loadingConservationTypes: false
    }))
  );
}

export const store$ = (actions: { [key: string]: Observable<Star> }) =>
  createStore('predefinedConservation', reducer$(actions), initialState, KEEP_ALIVE);

const predefinedConservation$ = store$({
  setLoadingSampleTypes$,
  loadSampleTypes$: loadSampleTypesAction$,
  setLoadingConservationTypes$,
  loadConservationTypes$: loadConservationTypesAction$
});

export default predefinedConservation$;
