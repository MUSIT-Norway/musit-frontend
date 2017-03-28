import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Sample from '../../models/sample';
const initialState =  { data: [] };


export const loadSamplesForObject$ = createAction('loadSamplesForObject$').switchMap(Sample.loadSamplesForObject());
export const clear$ = createAction('clear$');



const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.loadSamplesForObject$.map((data) => () => ({data}))
);

export const sampleStore$ = (actions = { loadSamplesForObject$,  clear$ }) =>
  createStore('sampleStore$', reducer$(actions), Observable.of(initialState));

export default sampleStore$();