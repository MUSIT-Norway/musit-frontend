// @flow
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';
import uniq from 'lodash/uniq';

export const getAnalysisTypes$ = createAction('getAnalysisTypes$').switchMap(
  MusitAnalysis.getAnalysisTypesForCollection()
);

export const getAnalysis$ = createAction('getAnalysis$').switchMap(props =>
  MusitAnalysis.getAnalysisWithDetails()(props).do(props.onComplete)
);

export const loadPredefinedTypes$ = createAction(
  'loadPredefinedTypes$'
).switchMap(props => MusitAnalysis.loadPredefinedTypes()(props));

type Actions = {
  getAnalysis$: Subject,
  getAnalysisTypes$: Subject,
  loadPredefinedTypes$: Subject
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.getAnalysis$.map(analysis => state => ({
      ...state,
      analysis
    })),
    actions.getAnalysisTypes$.map(analysisTypes => state => ({
      ...state,
      analysisTypes,
      analysisTypeCategories: uniq(analysisTypes.map(a => a.category))
    })),
    actions.loadPredefinedTypes$.map(predefinedTypes => state => ({
      ...state,
      categories: predefinedTypes.categories,
      purposes: predefinedTypes.purposes,
      analysisTypes: predefinedTypes.analysisTypes
    }))
  );

export const store$ = (
  actions$: Actions = { getAnalysisTypes$, getAnalysis$, loadPredefinedTypes$ }
) =>
  createStore(
    'analysisStore',
    reducer$(actions$),
    Observable.of({ analysisTypes: [], purposes: [], categories: {} })
  );

export default store$();
