import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';


const initialState = {
  sampleObject: {

  },
  loaded: false
};

export const clearSample$ = createAction('clearSample$');

export const reducer$ = (actions) => Observable.merge(
  actions.clearSample$.map(() => () => initialState)
);

export const store$ = (actions$ = {clearSample$}) =>
  createStore('sample', reducer$(actions$), Observable.of(initialState));

export default store$();