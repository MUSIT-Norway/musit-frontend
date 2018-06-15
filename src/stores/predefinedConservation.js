// @flow
import { Observable, Subject } from 'rxjs';
import Conservation from '../models/conservation';
import Sample from '../models/sample';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import type { Reducer } from 'react-rxjs';
import { KEEP_ALIVE } from './constants';
import type { PredefinedConservation } from 'types/predefinedConservation';
import { simpleGet } from '../shared/RxAjax';

export const setLoadingSampleTypes$: Subject<*> = createAction('setLoadingSampleTypes$');
export const loadSampleTypes$: Subject<*> = createAction('loadSampleTypes$');
const loadSampleTypesAction$: Observable<*> = loadSampleTypes$.switchMap(
  Sample.loadSampleTypes(simpleGet)
);

export const setLoadingConservationTypes$: Subject<*> = createAction(
  'setLoadingConservationTypes$'
);
export const loadConservationTypes$: Subject<*> = createAction('loadConservationTypes$');
const loadConservationTypesAction$: Observable<*> = loadConservationTypes$.switchMap(
  Conservation.loadPredefinedConservationTypes(simpleGet)
);

type State = PredefinedConservation & {
  loadingSampleTypes: boolean,
  loadingConservationTypes: boolean
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

export function reducer$(actions: { [string]: Observable<*> }): Observable<Reducer<any>> {
  return Observable.merge(
    actions.setLoadingSampleTypes$.map(() => state => ({
      ...state,
      loadingSampleTypes: true
    })),
    actions.loadSampleTypes$.map(sampleTypes => state => ({
      ...state,
      sampleTypes: sampleTypes,
      loadingSampleTypes: false
    })),
    actions.setLoadingConservationTypes$.map(() => state => ({
      ...state,
      loadingConservationTypes: true
    })),
    actions.loadConservationTypes$.map(conservationTypes => state => ({
      ...state,
      ...conservationTypes,
      loadingConservationTypes: false
    }))
  );
}

export const store$ = (actions: { [string]: Observable<*> }) =>
  createStore('predefinedConservation', reducer$(actions), initialState, KEEP_ALIVE);

const predefinedConservation$ = store$({
  setLoadingSampleTypes$,
  loadSampleTypes$: loadSampleTypesAction$,
  setLoadingConservationTypes$,
  loadConservationTypes$: loadConservationTypesAction$
});

export default predefinedConservation$;
