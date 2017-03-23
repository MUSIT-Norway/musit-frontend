import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Event from '../../models/event';
import MusitObject from '../../models/object';

const initialState = {};

export const loadAnalyses$ = createAction('loadAnalyses$').switchMap(Event.concatAnalysesWithMoves());
export const getCurrentLocation$ = createAction('getCurrentLocation$').switchMap(MusitObject.getObjectLocation());
export const setObject$ = createAction('setObject$');
export const clear$ = createAction('clear$');

const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.loadAnalyses$.map((data) => (state) => ({...state, data})),
  actions.getCurrentLocation$.map((currentLocation) => (state) => ({...state, currentLocation})),
  actions.setObject$.map((object) => (state) => ({...state, object}))
);

export const eventsStore$ = (actions = { loadAnalyses$, getCurrentLocation$, setObject$, clear$ }) =>
  createStore('eventsStore', reducer$(actions), Observable.of(initialState));

export default eventsStore$();