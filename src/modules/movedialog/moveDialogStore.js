import { Observable } from 'rxjs';
import MusitNode from '../../models/node';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const clear$ = createAction('clear$');
export const setLoading$ = createAction('setLoading$');
export const loadChildren$ = createAction('loadChildren$').switchMap(MusitNode.getNodes());
export const loadNode$ = createAction('loadNode$').switchMap(MusitNode.getNode());

export const initialState = {
  selectedNode: null,
  data: {
    totalMatches: 0,
    matches: [],
    loading: false
  }
};

export const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.setLoading$.map((loading) => (state) => ({...state, data: { ...state.data, loading }})),
  actions.loadNode$.map((node) => (state) => ({...state, selectedNode: node})),
  actions.loadChildren$.map((data) => (state) => ({...state, data: { ...data, loading: false }})),
);

export default createStore('moveDialog', reducer$({clear$, loadNode$, loadChildren$, setLoading$}), Observable.of(initialState));
