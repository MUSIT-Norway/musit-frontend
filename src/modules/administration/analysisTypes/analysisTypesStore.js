// @flow
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import Analysis from '../../../models/analysis';

export const getAnalysisTypes$: Subject<*> = createAction('getAnalysisTypes$').switchMap(
  Analysis.getAnalysisTypes()
);

type Actions = {
  getAnalysisTypes$: Subject<*>
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.getAnalysisTypes$.map(analysisTypes => state => ({
      ...state,
      analysisTypes
    }))
  );

export const store$ = (actions$: Actions = { getAnalysisTypes$ }) =>
  createStore(
    'analysisTypeStore',
    reducer$(actions$),
    Observable.of({ analysisTypes: [] })
  );

export default store$();
