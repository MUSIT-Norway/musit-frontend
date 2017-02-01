import { Observable, Subject } from 'rxjs';
import { Reports } from '../../models/report';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';


const initialState= { data: [] }

export const clear$ = new Subject();

export const loadKDReport$  = createAction('loadKDReport$').switchMap( cmd => Reports(cmd.museumId).getKDReport(cmd.token));


export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadKDReport$.map((data) => (state) => ({...state, data, error: null}))
  );

export default createStore('Reports', reducer$({clear$, loadKDReport$}), Observable.of(initialState));