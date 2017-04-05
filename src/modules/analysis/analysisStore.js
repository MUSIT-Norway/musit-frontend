import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

import Analysis from '../../models/analysis';

const objectsData = [
  {
    museumNumber: 'MusK58',
    subNumber: '2',
    term: 'Mansjettknapp',
    uuid: 'adea8141-8099-4f67-bff9-ea5090e18335'
  },
  {
    museumNumber: 'MusK58',
    subNumber: '3',
    term: 'Spenne',
    uuid: '798181c9-a6d9-46d7-8d71-b39d4f3e0c96'
  },
  {
    museumNumber: 'MusK58',
    subNumber: '4',
    term: 'Briller',
    uuid: 'e1f5efa5-4c91-4c5d-83a7-280c6d2f0e05'
  }
];

export const loadAnalysisTypes$ = createAction('loadAnalysisTypes$').switchMap(
  Analysis.getAllAnalysisTypes()
);
export const loadAnalysis$ = createAction('loadAnalysis$').switchMap(
  Analysis.getAnalysisWithDeatils()
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
    Observable.of({ objectsData, analysisTypes: [], analysis: [] })
  );

export default store$();
