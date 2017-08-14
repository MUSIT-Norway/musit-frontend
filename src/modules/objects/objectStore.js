// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable, Subject } from 'rxjs';
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

const setLoading$: Subject<*> = createAction('setLoading');

const flagLoading = s => () => setLoading$.next(s);

export const loadObject$: Subject<*> = createAction('loadObject$')
  .do(flagLoading({ loadingObjectData: true }))
  .switchMap(MusitObject.getObjectWithCurrentLocation());

export const loadSampleEvents$: Subject<*> = createAction('loadSampleEvents$')
  .do(flagLoading({ loadingSamples: true }))
  .switchMap(params => {
    return Sample.loadSampleDataForObject()(params).flatMap(samples => {
      if (!samples || samples.length === 0) {
        return Observable.of([]);
      }
      return Observable.forkJoin(
        samples.map(sample => {
          return MusitObject.getObjectLocation()({
            ...params,
            objectType: 'sample',
            objectId: sample.objectId
          }).map(currentLocation => ({ ...sample, currentLocation }));
        })
      );
    });
  });

export const loadMoveAndAnalysisEvents$: Subject<*> = createAction(
  'loadMoveAndAnalysisEvents$'
)
  .do(flagLoading({ loadingEvents: true }))
  .switchMap(Event.getAnalysesAndMoves());

export const clearStore$: Subject<*> = createAction('clearStore$');

type Actions = {
  loadSampleEvents$: Subject<*>,
  loadMoveAndAnalysisEvents$: Subject<*>,
  loadObject$: Subject<*>,
  clearStore$: Subject<*>,
  setLoading$: Subject<*>
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
