import { Observable } from 'rxjs';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import Observation from '../../models/observation';
import MusitNode from '../../models/node';

export const loadRootNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNode());
export const setLoading$ = createAction('setLoading$');
export const getObservation$ = createAction('getObservation$').switchMap(
  Observation.getObservation()
);

export const reducer$ = actions =>
  Observable.merge(
    actions.loadRootNode$.map(rootNode => state => ({ ...state, rootNode })),
    actions.getObservation$.map(data => state => ({ ...state, data, loading: false })),
    actions.setLoading$.map(() =>
      state => ({ ...state, data: {}, rootNode: null, loading: true }))
  );

export const initialState = { data: {}, rootNode: null };

export const store$ = (actions$ = { setLoading$, getObservation$, loadRootNode$ }) =>
  createStore('observation', reducer$(actions$), Observable.of(initialState));

export default store$();
