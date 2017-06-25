// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
export const initialState = {
  objectData: {},
  events: [],
  samples: [],
  loadingObjectData: false,
  loadingEvents: false,
  loadingSamples: false
};

const setLoading$ = createAction('setLoading');

const flagLoading = s => () => setLoading$.next(s);

export const loadObject$: Observable = createAction('loadObject$')
  .do(flagLoading({ loadingObjectData: true }))
  .switchMap(params => MusitObject.getObjectWithCurrentLocation()(params));

export const loadSampleEvents$: Observable = createAction('loadSampleEvents$')
  .do(flagLoading({ loadingSamples: true }))
  .switchMap(Sample.loadSampleDataForObject());

export const loadMoveAndAnalysisEvents$: Observable = createAction(
  'loadMoveAndAnalysisEvents$'
)
  .do(flagLoading({ loadingEvents: true }))
  .switchMap(Event.getAnalysesAndMoves());

export const clearStore$: Observable = createAction('clearStore$');

type Actions = {
  loadSampleEvents$: Observable,
  loadMoveAndAnalysisEvents$: Observable,
  loadObject$: Observable,
  clearStore$: Observable,
  setLoading$: Observable
};

const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.clearStore$.map(() => () => initialState),
    actions.setLoading$.map(loading => state => ({ ...state, ...loading })),
    actions.loadObject$.map(objectData => state => ({
      ...state,
      objectData,
      loadingObjectData: false
    })),
    actions.loadSampleEvents$.map(samples => state => ({
      ...state,
      samples,
      loadingSamples: false
    })),
    actions.loadMoveAndAnalysisEvents$.map(events => state => ({
      ...state,
      events,
      loadingEvents: false
    }))
  );

export const store$ = (
  actions: Actions = {
    loadObject$,
    loadSampleEvents$,
    loadMoveAndAnalysisEvents$,
    clearStore$,
    setLoading$
  }
) => createStore('objectStore$', reducer$(actions), Observable.of(initialState));

export default store$();
