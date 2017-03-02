import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const clearRootNode$ = createAction('clearRootNode$');
export const setLoading$ = createAction('setLoading$');
export const loadNodes$ = createAction('loadNodes$').switchMap(MusitNode.getNodes());
export const loadObjects$ = createAction('loadObjects$').switchMap(MusitObject.getObjects());
export const loadStats$ = createAction('loadStats$').switchMap(MusitNode.getStats());
export const loadRootNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNode());

export const reducer$ = (actions) => Observable.merge(
  actions.clearRootNode$.map(() => (state) => ({ ...state, rootNode: null, stats: null })),
  actions.loadStats$.map((stats) => (state) => ({ ...state, stats})),
  actions.loadRootNode$.map((rootNode) => (state) => ({...state, rootNode})),
  actions.setLoading$.map(() => state => ({...state, children: { data: null, loading: true }})),
  actions.loadNodes$.map((data) => (state) => ({...state, children: { data, loading: false }})),
  actions.loadObjects$.map((data) => (state) => ({...state, children: { data, loading: false }}))
);

export default createStore('storageFacility', reducer$({clearRootNode$, setLoading$, loadStats$, loadRootNode$, loadObjects$, loadNodes$}));
