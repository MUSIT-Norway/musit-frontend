// @flow
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';
import uniq from 'lodash/uniq';

export const getAnalysisTypes$ = createAction('getAnalysisTypes$').switchMap(
  MusitAnalysis.getAnalysisTypesForCollection()
);

export const setLoading$ = createAction('setLoading$');
export const getAnalysis$ = createAction('getAnalysis$').switchMap(props =>
  MusitAnalysis.getAnalysisWithDetails()(props).do(props.onComplete)
);

export const updateExtraDescriptionAttribute$ = createAction(
  'updateExtraDescriptionAttribute$'
);

export const updateExtraResultAttribute$ = createAction('updateExtraResultAttribute$');

export const loadPredefinedTypes$ = createAction(
  'loadPredefinedTypes$'
).switchMap(props => MusitAnalysis.loadPredefinedTypes()(props));

type Actions = {
  setLoading$: Subject,
  getAnalysis$: Subject,
  getAnalysisTypes$: Subject,
  loadPredefinedTypes$: Subject,
  updateExtraDescriptionAttribute$: Subject,
  updateExtraResultAttribute$: Subject
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.setLoading$.map(() => state => ({ ...state, loading: true })),
    actions.getAnalysis$.map(analysis => state => ({
      ...state,
      analysis,
      loading: false
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
      analysisTypes: predefinedTypes.analysisTypes,
      analysisLabList: predefinedTypes.analysisLabList
    })),
    actions.updateExtraDescriptionAttribute$.map(({ name, value }) => state => ({
      ...state,
      extraDescriptionAttributes: { ...state.extraDescriptionAttributes, [name]: value }
    })),
    actions.updateExtraResultAttribute$.map(({ name, value }) => state => ({
      ...state,
      extraResultAttributes: { ...state.extraResultAttributes, [name]: value }
    }))
  );

export const store$ = (
  actions$: Actions = {
    getAnalysisTypes$,
    setLoading$,
    getAnalysis$,
    loadPredefinedTypes$,
    updateExtraDescriptionAttribute$,
    updateExtraResultAttribute$
  }
) =>
  createStore(
    'analysisStore',
    reducer$(actions$),
    Observable.of({
      analysisTypes: [],
      purposes: [],
      categories: {},
      analysisLabList: []
    })
  );

export default store$();
