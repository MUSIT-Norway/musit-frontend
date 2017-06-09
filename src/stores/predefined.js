import { Observable } from 'rxjs';
import Analysis from '../models/analysis';
import Sample from '../models/sample';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const setLoadingSampleTypes$ = createAction('setLoadingSampleTypes$');
export const loadSampleTypes$ = createAction('loadSampleTypes$').switchMap(
  Sample.loadPredefinedTypes()
);
export const setLoadingAnalysisTypes$ = createAction('setLoadingAnalysisTypes$');
export const loadAnalysisTypes$ = createAction('loadAnalysisTypes$').switchMap(
  Analysis.loadPredefinedTypes()
);

export const reducer$ = actions =>
  Observable.empty().merge(
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

export const store$ = actions =>
  createStore(
    'predefined',
    reducer$(actions),
    Observable.of({ loadingSampleTypes: false, loadingAnalysisTypes: false })
  );

export default store$({
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$
});
