import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import Report from '../../models/report';
import { TODO } from '../../types/common';

const initialState = {
  data: {},
  loaded: false
};

export const clear$ = createAction('clear$');

export const loadKDReport$ = createAction('loadKDReport$').switchMap(
  Report.getKDReport()
);

export const reducer$ = (actions: TODO) =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadKDReport$.map((kdreport: TODO) => (state: TODO) => ({
      ...state,
      data: { kdreport },
      loaded: true
    }))
  );

export const store$ = (actions$ = { clear$, loadKDReport$ }) =>
  createStore('reportStore', reducer$(actions$) as TODO, initialState);

export default store$();
