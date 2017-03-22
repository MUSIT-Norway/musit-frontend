// @flow
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import Event from '../../models/event';
import MusitObject from '../../models/object';

const initialState = { data: null, currentLocation: null };

export const loadAnalyses$ = createAction('loadAnalyses$').switchMap(Event.concatAnalysesWithMoves());
export const getCurrentLocation$ = createAction('getCurrentLocation$').switchMap(MusitObject.getObjectLocation());

const reducer$ = Observable.merge(
  loadAnalyses$.map((data) => (state) => ({...state, data})),
  getCurrentLocation$.map((currentLocation) => (state) => ({...state, currentLocation}))
);

const eventsStore$ = createStore('allEvents', reducer$, Observable.of(initialState));

export default eventsStore$;