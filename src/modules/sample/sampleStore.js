import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import  Sample  from '../../models/sample';

export const initialState = {
  data: {},
  loaded: true,
  loading: false
};

export const clearForm$ = createAction('clearForm$');
export const loadSample$ = createAction('loadSample$').switchMap(Sample.loadSample());
export const editSample$ = createAction('editSample$').switchMap(Sample.editSample());

export const reducer$ = (actions) => Observable.merge(
  actions.clearForm$.map(() => () => initialState),
  Observable.merge(
    actions.loadSample$,
    actions.editSample$
  ).map((data) => (state) => ({ ...state, data, loading: false, loaded: true}))
);

export const store$ = (actions$ = { clearForm$, loadSample$, editSample$ }) =>
  createStore('sample', reducer$(actions$), Observable.of(initialState));

export default store$();