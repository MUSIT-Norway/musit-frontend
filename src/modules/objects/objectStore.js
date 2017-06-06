// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
export const initialState = { objectData: {}, events: [], samples: [] };

export const loadObject$: Observable = createAction('loadObject$').switchMap(params =>
  MusitObject.getObjectDetails()(params).map(({ response }) => response)
);

export const loadSampleEvents$: Observable = createAction('loadSampleEvents$').switchMap(
  Sample.loadSampleDataForObject()
);

export const loadMoveAndAnalysisEvents$: Observable = createAction(
  'loadMoveAndAnalysisEvents$'
).switchMap(Event.getAnalysesAndMoves());

export const clear$: Observable = createAction('clear$');

type Actions = {
  loadSampleEvents$: Observable,
  loadMoveAndAnalysisEvents$: Observable,
  loadObject$: Observable,
  clear$: Observable
};

const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadObject$.map(objectData => state => ({ ...state, objectData })),
    actions.loadSampleEvents$.map(samples => state => ({ ...state, samples })),
    actions.loadMoveAndAnalysisEvents$.map(events => state => ({ ...state, events }))
  );

export const store$ = (
  actions: Actions = {
    loadObject$,
    loadSampleEvents$,
    loadMoveAndAnalysisEvents$,
    clear$
  }
) => createStore('objectStore$', reducer$(actions), Observable.of(initialState));

export default store$();
