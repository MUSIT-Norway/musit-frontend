import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import Observation from '../../models/observation';
import MusitNode from '../../models/node';
import { TODO } from '../../types/common';

export const loadRootNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNode());
export const setLoading$ = createAction('setLoading$');
export const getObservation$ = createAction('getObservation$').switchMap(
  Observation.getObservation()
);

export const reducer$ = (actions: TODO) =>
  Observable.merge(
    actions.loadRootNode$.map((rootNode: TODO) => (state: TODO) => ({
      ...state,
      rootNode
    })),
    actions.getObservation$.map((data: TODO) => (state: TODO) => ({
      ...state,
      data,
      loading: false
    })),
    actions.setLoading$.map(() => (state: TODO) => ({
      ...state,
      data: {},
      rootNode: null,
      loading: true
    }))
  );

export const initialState = { data: {}, rootNode: null };

export const store$ = (actions$ = { setLoading$, getObservation$, loadRootNode$ }) =>
  createStore('observation', reducer$(actions$) as TODO, initialState);

export default store$();
