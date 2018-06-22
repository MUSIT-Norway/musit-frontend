// @flow
import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../../shared/react-rxjs-patch';

import Analysis from '../../../models/analysis';
import { simpleGet } from '../../../shared/RxAjax';

export const getAnalysisTypes$: Observable<*> = createAction(
  'getAnalysisTypes$'
).switchMap(Analysis.getAnalysisTypes(simpleGet));

type Actions = {
  getAnalysisTypes$: Observable<*>
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.getAnalysisTypes$.map(analysisTypes => state => ({
      ...state,
      analysisTypes
    }))
  );

export const store$ = (actions$: Actions = { getAnalysisTypes$ }) =>
  createStore('analysisTypeStore', reducer$(actions$), { analysisTypes: [] });

export default store$();
