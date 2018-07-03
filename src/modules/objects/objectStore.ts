// @flow
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { Reducer } from 'react-rxjs';
import { Observable, Subject } from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
import { ObjectData } from '../../types/object';
import { simpleGet, simplePost } from '../../shared/RxAjax';
import { Maybe, Star, MUSTFIX, TODO } from '../../types/common';

export type ObjectStoreState = {
  objectData: Maybe<ObjectData>;
  events: Maybe<Array<Star>>;
  samples: Maybe<Array<Star>>;
  loadingObjectData: boolean;
  loadingSamples: boolean;
  loadingEvents: boolean;
};

export const initialState: ObjectStoreState = {
  objectData: null,
  events: [],
  samples: [],
  loadingObjectData: false,
  loadingEvents: false,
  loadingSamples: false
};

type Flag = { [key: string]: boolean };

const setLoading$: Subject<Flag> = new Subject();

const flagLoading = (s: Flag) => () => setLoading$.next(s);

export const loadObject$: Observable<ObjectData> = createAction('loadObject$')
  .do(flagLoading({ loadingObjectData: true }))
  .switchMap(MusitObject.getObjectWithCurrentLocation(simpleGet));

export const loadSampleEvents$: Observable<Star> = createAction('loadSampleEvents$')
  .do(flagLoading({ loadingSamples: true }))
  .switchMap(params => {
    return Sample.loadSampleDataForObject(simpleGet)(params as MUSTFIX).flatMap(
      samples => {
        if (!samples || samples.length === 0) {
          return Observable.of([]);
        }
        return Observable.forkJoin(
          samples.map((sample: TODO) => {
            return MusitObject.getObjectLocation(simpleGet)({
              ...params,
              objectType: 'sample',
              objectId: sample.objectId
            } as MUSTFIX).map(currentLocation => ({ ...sample, currentLocation }));
          })
        );
      }
    );
  });

export const loadMoveAndAnalysisEvents$: Observable<Star> = createAction(
  'loadMoveAndAnalysisEvents$'
)
  .do(flagLoading({ loadingEvents: true }))
  .switchMap(Event.getAnalysesAndMoves(simpleGet, simplePost));

export const clearStore$: Observable<void> = createAction('clearStore$');

type Actions = {
  loadSampleEvents$: Observable<Star>;
  loadMoveAndAnalysisEvents$: Observable<Star>;
  loadObject$: Observable<Star>;
  clearStore$: Observable<Star>;
  setLoading$: Subject<Flag>;
};

const reducer$ = (actions: Actions): Observable<Reducer<ObjectStoreState>> =>
  Observable.merge(
    actions.clearStore$.map(() => () => initialState),
    actions.setLoading$.map(loading => (state: ObjectStoreState) => ({
      ...state,
      ...loading
    })),
    actions.loadObject$.map(objectData => (state: ObjectStoreState) => ({
      ...state,
      objectData,
      loadingObjectData: false
    })),
    actions.loadSampleEvents$.map(samples => (state: ObjectStoreState) => ({
      ...state,
      samples,
      loadingSamples: false
    })),
    actions.loadMoveAndAnalysisEvents$.map(events => (state: ObjectStoreState) => ({
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
