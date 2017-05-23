import {createStore, createAction} from 'react-rxjs/dist/RxStore';
import {Observable} from 'rxjs';
import Sample from '../../models/sample';
const initialState = {data: []};

export const loadSamplesForObject$ = createAction('loadSamplesForObject$').switchMap(
  Sample.loadSamplesForObject()
);


export const loadPredefinedTypes$ = createAction(
  'loadPredefinedTypes$'
).switchMap(props =>
  Observable.forkJoin([
    Sample.loadStorageContainer()(props),
    Sample.loadStorageMediums()(props),
    Sample.loadTreatments()(props),
    Sample.loadSampleTypes()(props)
  ]).do(predefTypes => props.onComplete(predefTypes)));

export const clear$ = createAction('clear$');

const reducer$ = actions =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadPredefinedTypes$.map(
      ([storageContainers, storageMediums, treatments, sampleTypes]) => state => ({
        ...state,
        storageContainers,
        storageMediums,
        treatments,
        sampleTypes
      })
    ),
    actions.loadSamplesForObject$.map(data => state => ({...state, ...data}))
  );

export const sampleStore$ = (actions = {
  loadSamplesForObject$,
  loadPredefinedTypes$,
  clear$
}) => createStore('sampleStore$', reducer$(actions), Observable.of(initialState));

export default sampleStore$();
