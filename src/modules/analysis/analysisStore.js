// @flow
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitAnalysis from '../../models/analysis';
import uniq from 'lodash/uniq';

const initialState = {
  analysisTypes: [],
  purposes: [],
  categories: {},
  analysisLabList: [],
  loading: false,
  extraDescriptionAttributes: {},
  extraResultAttributes: {},
  analysisTypeCategories: []
};

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

export const clearStore$ = createAction('clearStore$');

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
  updateExtraResultAttribute$: Subject,
  clearStore$: Subject
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.clearStore$.map(() => () => initialState),
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
    updateExtraResultAttribute$,
    clearStore$
  }
) => createStore('analysisStore', reducer$(actions$), Observable.of(initialState));

export default store$();
