// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Event from '../../models/event';
import MusitObject from '../../models/object';

const initialState = {};

export const loadAnalyses$ = createAction('loadAnalyses$').switchMap(Event.concatAnalysesWithMoves());
export const getCurrentLocation$ = createAction('getCurrentLocation$').switchMap(MusitObject.getObjectLocation());
export const setObject$ = createAction('setObject$');
export const clear$ = createAction('clear$');

const reducer$ = Observable.merge(
  clear$.map(() => () => initialState),
  loadAnalyses$.map((data) => (state) => ({...state, data})),
  getCurrentLocation$.map((currentLocation) => (state) => ({...state, currentLocation})),
  setObject$.map((object) => (state) => ({...state, object}))
);

const eventsStore$ = createStore('eventsStore', reducer$, Observable.of(initialState));

export default eventsStore$;