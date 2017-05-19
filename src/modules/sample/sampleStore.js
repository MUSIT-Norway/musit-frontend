import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Sample from '../../models/sample';
const initialState = { data: [] };

export const loadSamplesForObject$ = createAction('loadSamplesForObject$').switchMap(
  Sample.loadSamplesForObject()
);

export const loadSampleTypes$ = createAction('loadSampleTypes$').switchMap(props =>
  Sample.loadSampleTypes()(props).do(props.onComplete).do(console.log));

export const loadPredefinedTypes$ = createAction(
  'loadPredefinedTypes$'
).switchMap(props =>
  Observable.forkJoin([
    Sample.loadStorageContainer()(props),
    Sample.loadStorageMediums()(props),
    Sample.loadTreatments()(props)
  ]).do(console.log));

export const clear$ = createAction('clear$');

const reducer$ = actions =>
  Observable.merge(
    actions.loadSampleTypes$.map(sampleTypes => state => ({ ...state, sampleTypes })),
    actions.clear$.map(() => () => initialState),
    actions.loadPredefinedTypes$.map(([storageContainers, storageMediums, treatments]) =>
      state => ({ ...state, storageContainers, storageMediums, treatments })),
    actions.loadSamplesForObject$.map(data => state => ({ ...state, ...data }))
  );

export const sampleStore$ = (
  actions = {
    loadSamplesForObject$,
    loadSampleTypes$,
    loadPredefinedTypes$,
    clear$
  }
) => createStore('sampleStore$', reducer$(actions), Observable.of(initialState));

export default sampleStore$();
