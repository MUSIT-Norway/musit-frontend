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

export const reducer$ = (actions) => Observable.merge(
  actions.clearForm$.map(() => () => initialState),
  actions.loadSample$.map((data) => (state) => {
    console.log('LoadForm',data, state); return { ...state, data, loading: false, loaded: true};
  })
);

export const store$ = (actions$ = { clearForm$, loadSample$ }) =>
  createStore('sample', reducer$(actions$), Observable.of(initialState));

export default store$();