import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import Report from '../../models/report';

const initialState = {
  data: {},
  loaded: false
};

export const clear$ = createAction('clear$');

export const loadKDReport$  = createAction('loadKDReport$').switchMap(Report.getKDReport());

export const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.loadKDReport$.map((kdreport) => (state) => ({...state, data: { kdreport }, loaded: true}))
);

export default createStore('reportStore', reducer$({clear$,loadKDReport$}), Observable.of(initialState));