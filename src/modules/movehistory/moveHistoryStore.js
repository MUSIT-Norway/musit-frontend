import { Observable, Subject } from 'rxjs';
import MusitObject from '../../models/object';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const clear$ = new Subject();

export const getLocationHistory = MusitObject.getLocationHistory;

export const loadMoveHistory$ = createAction('loadMoveHistory$').switchMap(getLocationHistory());

export const initialState = { data: [] };

export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadMoveHistory$.map((data) => (state) => ({...state, data}))
  );

export default (actions$ = {clear$, loadMoveHistory$}) =>
  createStore('moveHistory', reducer$(actions$), Observable.of(initialState));
