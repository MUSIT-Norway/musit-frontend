/* @flow */
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
export const initialState = { objectData: {}, events: [], samples: [] };
import type { ObjectProps } from '../../types/object';

const loadObjectData = () =>
  (val: ObjectProps) =>
    MusitObject.getObjectDetails()(val).flatMap(response => {
      const v = {
        ...val,
        id: response.uuid,
        objectId: response.id
      };
      return Observable.forkJoin(
        Observable.of(response),
        Event.getAnalysesAndMoves()(v),
        Sample.loadSampleDataForObject()(v)
      ).map(([o, e, s]) => ({ objectData: o, events: e, samples: s }));
    });

export const loadObject$: Observable = createAction('loadObject$').switchMap(
  loadObjectData()
);
export const clear$: Observable = createAction('clear$');

const reducer$ = (actions: { loadObject$: Observable, clear$: Observable }) =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadObject$.map(data => state => ({ ...state, ...data }))
  );

export const objectStore$ = (
  actions: { loadObject$: Observable, clear$: Observable } = { loadObject$, clear$ }
) => createStore('objectStore$', reducer$(actions), Observable.of(initialState));

export default objectStore$();
