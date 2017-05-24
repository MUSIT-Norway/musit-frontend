import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Sample from '../../models/sample';
const initialState = { data: [] };

export const loadSamplesForObject$ = createAction('loadSamplesForObject$').switchMap(
  Sample.loadSamplesForObject()
);

export const loadPredefinedTypes$ = createAction('loadPredefinedTypes$').switchMap(
  Sample.loadPredefinedTypes()
);

export const clear$ = createAction('clear$');

const reducer$ = actions =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadPredefinedTypes$.map(types => state => ({ ...state, ...types })),
    actions.loadSamplesForObject$.map(data => state => ({ ...state, ...data }))
  );

export const sampleStore$ = (
  actions = {
    loadSamplesForObject$,
    loadPredefinedTypes$,
    clear$
  }
) => createStore('sampleStore$', reducer$(actions), Observable.of(initialState));

export default sampleStore$();
