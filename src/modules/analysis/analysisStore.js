import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';

export const clearAnalysisTypes$ = createAction('clearAnalysisTypes$');
export const loadAnalysisTypes$ = createAction('loadAnalysisTypes$').switchMap(MusitAnalysis.getAllAnalysisTypes());

export const reducer$ = (actions) => Observable.merge(
  actions.clearAnalysisTypes$.map(() => (state) => ({...state, data: [], loading: true})),
  actions.loadAnalysisTypes$.map((data) => (state) => ({...state, data, loading: false})),
);

export const store$ = (actions$ = {clearAnalysisTypes$, loadAnalysisTypes$}) =>
  createStore('analysisStore', reducer$(actions$), Observable.of({ data: [] }));

export default store$();