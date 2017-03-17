import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import  Sample  from '../../models/sample';


const initialState = {
  sampleObject: {

  },
  loaded: false
};

export const clearForm$ = createAction('clearForm$');
export const loadForm$ = createAction('loadForm$').flatMap(Sample.loadSample());

export const reducer$ = (actions) => Observable.merge(
  actions.clearForm$.map(() => () => initialState),
  actions.loadForm$.map(() => () => initialState)
);

export const store$ = (actions$ = { clearForm$, loadForm$ }) =>
  createStore('sample', reducer$(actions$), Observable.of(initialState));

export default store$();