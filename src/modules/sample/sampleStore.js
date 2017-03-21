import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import  Sample  from '../../models/sample';


const initialState = {
  data: {

  },
  loaded: false
};

export const clearForm$ = createAction('clearForm$');
export const loadSample$ = createAction('loadSample$').switchMap(Sample.loadSample());
export const editSample$ = createAction('editSample$').switchMap(Sample.editSample());

export const reducer$ = (actions) => Observable.merge(
  actions.clearForm$.map(() => () => initialState),
  actions.loadSample$.map((data) => (state) => {
    return { ...state, data, loading: false, loaded: true};
  }),
  actions.editSample$.map((data) => (state) => {
    return { ...state, data, loading: false, loaded: true};
  })
);

export const store$ = (actions$ = { clearForm$, loadSample$, editSample$ }) =>
  createStore('sample', reducer$(actions$), Observable.of(initialState));

export default store$();