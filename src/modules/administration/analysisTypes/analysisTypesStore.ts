// @flow
import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../../shared/react-rxjs-patch';

import Analysis from '../../../models/analysis';
import { simpleGet } from '../../../shared/RxAjax';
import { Star, TODO } from '../../../types/common';

export const getAnalysisTypes$: Observable<Star> = createAction(
  'getAnalysisTypes$'
).switchMap(Analysis.getAnalysisTypes(simpleGet));

type Actions = {
  getAnalysisTypes$: Observable<Star>;
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.getAnalysisTypes$.map(analysisTypes => (state: TODO) => ({
      ...state,
      analysisTypes
    }))
  );

export const store$ = (actions$: Actions = { getAnalysisTypes$ }) =>
  createStore('analysisTypeStore', reducer$(actions$), { analysisTypes: [] });

export default store$();
