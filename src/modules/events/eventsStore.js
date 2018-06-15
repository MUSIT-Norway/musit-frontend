import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';

const initialState = {};

export const getCurrentLocation$ = createAction('getCurrentLocation$').switchMap(
  MusitObject.getObjectLocation()
);
export const setObject$ = createAction('setObject$');

const reducer$ = actions =>
  Observable.merge(
    actions.getCurrentLocation$.map(currentLocation => state => ({
      ...state,
      currentLocation
    })),
    actions.setObject$.map(object => state => ({ ...state, object }))
  );

export const eventsStore$ = (actions = { getCurrentLocation$, setObject$ }) =>
  createStore('eventsStore', reducer$(actions), initialState);

export default eventsStore$();
