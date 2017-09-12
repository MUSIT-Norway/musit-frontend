// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import type { Reducer } from 'react-rxjs/dist/RxStore';
import { Observable, Subject } from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
import type { ObjectData } from '../../types/object';
import { simpleGet, simplePost } from '../../shared/RxAjax';

type State = {
  objectData: ?ObjectData,
  events: ?Array<*>,
  samples: ?Array<*>,
  loadingObjectData: boolean,
  loadingSamples: boolean,
  loadingEvents: boolean
};

export const initialState: State = {
  objectData: null,
  events: [],
  samples: [],
  loadingObjectData: false,
  loadingEvents: false,
  loadingSamples: false
};

type Flag = { [string]: boolean };

const setLoading$: Subject<Flag> = new Subject();

const flagLoading = s => () => setLoading$.next(s);

export const loadObject$: Observable<ObjectData> = createAction('loadObject$')
  .do(flagLoading({ loadingObjectData: true }))
  .switchMap(MusitObject.getObjectWithCurrentLocation(simpleGet));

export const loadSampleEvents$: Observable<*> = createAction('loadSampleEvents$')
  .do(flagLoading({ loadingSamples: true }))
  .switchMap(params => {
    return Sample.loadSampleDataForObject(simpleGet)(params).flatMap(samples => {
      if (!samples || samples.length === 0) {
        return Observable.of([]);
      }
      return Observable.forkJoin(
        samples.map(sample => {
          return MusitObject.getObjectLocation(simpleGet)({
            ...params,
            objectType: 'sample',
            objectId: sample.objectId
          }).map(currentLocation => ({ ...sample, currentLocation }));
        })
      );
    });
  });

export const loadMoveAndAnalysisEvents$: Observable<*> = createAction(
  'loadMoveAndAnalysisEvents$'
)
  .do(flagLoading({ loadingEvents: true }))
  .switchMap(Event.getAnalysesAndMoves(simpleGet, simplePost));

export const clearStore$: Observable<void> = createAction('clearStore$');

type Actions = {
  loadSampleEvents$: Observable<*>,
  loadMoveAndAnalysisEvents$: Observable<*>,
  loadObject$: Observable<*>,
  clearStore$: Observable<*>,
  setLoading$: Subject<Flag>
};

const reducer$ = (actions: Actions): Observable<Reducer<State>> =>
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
) => createStore('objectStore$', reducer$(actions), initialState);

export default store$();
