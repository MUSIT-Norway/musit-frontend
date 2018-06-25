import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import { TODO } from '../../types/common';

const initialState = {};

export const getCurrentLocation$ = createAction('getCurrentLocation$').switchMap(
  MusitObject.getObjectLocation()
);
export const setObject$ = createAction('setObject$');

const reducer$ = (actions: TODO) =>
  Observable.merge(
    actions.getCurrentLocation$.map((currentLocation: TODO) => (state: TODO) => ({
      ...state,
      currentLocation
    })),
    actions.setObject$.map((object: TODO) => (state: TODO) => ({ ...state, object }))
  );

export const eventsStore$ = (actions = { getCurrentLocation$, setObject$ }) =>
  createStore('eventsStore', reducer$(actions) as TODO, initialState);

export default eventsStore$();
