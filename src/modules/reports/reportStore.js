import { Observable } from 'rxjs';
import { Reports } from '../../models/report';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { simpleGet } from '../../shared/RxAjax';


const initialState = {
  data: {
  }
};

export const clear$ = createAction('clear$');

export const loadKDReport$  = createAction('loadKDReport$').switchMap( cmd => Reports.getKDReport(simpleGet, cmd.token, cmd.museumId.id));


export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadKDReport$.map((data) => (state) => ({...state, kdreport: data, error: null}))
  );

export default createStore('Reports', reducer$({clear$, loadKDReport$}), Observable.of(initialState));