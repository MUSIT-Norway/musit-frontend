import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

import Analysis from '../../models/analysis';

export const loadAnalysisTypes$ = createAction('loadAnalysisTypes$').switchMap(
  Analysis.getAllAnalysisTypes()
);

export const loadAnalysis$ = createAction('loadAnalysis$').switchMap(
  Analysis.getAnalysisWithDetails()
);

export const getAnalysisTypesForCollection$ = createAction(
  'getAnalysisTypesForCollection$'
).switchMap(Analysis.getAnalysisTypesForCollection());

export const reducer$ = actions =>
  Observable.merge(
    actions.loadAnalysisTypes$.map(analysisTypes =>
      state => ({ ...state, analysisTypes })),
    actions.loadAnalysis$.map(data =>
      state => ({ ...state, analysis: data, loading: false })),
    actions.getAnalysisTypesForCollection$.map(analysisTypes =>
      state => ({ ...state, analysisTypes }))
  );

export const store$ = (
  actions$ = { getAnalysisTypesForCollection$, loadAnalysisTypes$, loadAnalysis$ }
) =>
  createStore(
    'analysisStore',
    reducer$(actions$),
    Observable.of({ analysisTypes: [], analysis: [] })
  );

export default store$();
