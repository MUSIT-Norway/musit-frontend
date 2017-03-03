import { Observable } from 'rxjs';
import MusitNode from '../../models/node';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const PER_PAGE = 10;

export const clear$ = createAction('clear$');
export const setPage$ = createAction('setPage$');
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

export const updateMoveDialog = (response, museumId, token) => {
  loadNode$.next({
    id: response.id,
    museumId,
    token
  });
  loadChildren$.next({
    id: response.id,
    museumId,
    token,
    page: {
      page: 1,
      limit: PER_PAGE
    }
  });
};

export const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.setLoading$.map((loading) => (state) => ({...state, data: { ...state.data, loading }})),
  actions.loadNode$.map((node) => (state) => ({...state, selectedNode: node})),
  actions.loadChildren$.map((data) => (state) => ({...state, data: { ...data, loading: false }})),
  actions.setPage$.map((page) => (state) => ({...state, page}))
);

export default (actions$ = {clear$, setPage$, loadNode$, loadChildren$, setLoading$}) =>
  createStore('moveDialog', reducer$(actions$), Observable.of(initialState));
