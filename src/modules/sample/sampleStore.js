import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';


const initialState = {
  sampleObject: {

  },
  loaded: false
};

export const clearForm$ = createAction('clearForm$');

export const reducer$ = (actions) => Observable.merge(
  actions.clearForm$.map(() => () => initialState)
);

export const store$ = (actions$ = { clearForm$ }) =>
  createStore('sample', reducer$(actions$), Observable.of(initialState));

export default store$();