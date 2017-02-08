import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { simpleGet, simplePost } from '../../shared/RxAjax';

export const clearRootNode$ = createAction('clearRootNode$');

export const setLoading$ = createAction('setLoading$');

export const loadNodes$ = createAction('loadNodes$').switchMap(cmd =>
  MusitNode.getNodes(cmd.nodeId, cmd.page, cmd.museumId, cmd.token, cmd)
);

export const loadObjects$ = createAction('loadObjects$').switchMap(cmd =>
  MusitObject.getObjects(cmd.nodeId, cmd.page, cmd.museumId, cmd.collectionId, cmd.token, cmd)
);

export const loadStats$ = createAction('loadStats$').switchMap((cmd) =>
  MusitNode.getStats(cmd.nodeId, cmd.museumId, cmd.token, cmd)
);

export const loadRootNode$ = createAction('loadRootNode$').switchMap((cmd) =>
  MusitNode.getNode(simpleGet)(cmd.nodeId, cmd.museumId, cmd.token, cmd)
);

export const addNode$ = createAction('addNode$').switchMap((cmd) =>
  MusitNode.addNode(simplePost) (cmd.nodeId, cmd.museumId, cmd.token, cmd.data, cmd)
);

export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clearRootNode$.map(() => () => ({ rootNode: null, stats: null })),
    actions.loadStats$.map((stats) => (state) => ({ ...state, stats})),
    actions.loadRootNode$.map((rootNode) => (state) => ({...state, rootNode})),
    actions.setLoading$.map(() => state => ({...state, children: { data: null, loading: true }})),
    actions.loadNodes$.map((data) => (state) => ({...state, children: { data, loading: false }})),
    actions.loadObjects$.map((data) => (state) => ({...state, children: { data, loading: false }})),
    actions.addNode$.map((data) => (state) => ({ ...state, data, loading: false }))
  );

export default createStore('storageFacility', reducer$({clearRootNode$, setLoading$, loadStats$, loadRootNode$, loadObjects$, addNode$, loadNodes$}));
