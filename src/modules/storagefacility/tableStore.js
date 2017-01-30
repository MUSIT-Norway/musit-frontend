import { Observable, Subject } from 'rxjs';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import { createStore } from 'react-rxjs/dist/RxStore';

export const clearRootNode$ = new Subject();

export const setLoading$ = new Subject();

export const loadNodes$ = new Subject().switchMap(cmd =>
  MusitNode.getNodes(cmd.nodeId, cmd.page, cmd.museumId, cmd.token, cmd)
);

export const loadObjects$ = new Subject().switchMap(cmd =>
  MusitObject.getObjects(cmd.nodeId, cmd.page, cmd.museumId, cmd.collectionId, cmd.token, cmd)
);

export const loadStats$ = new Subject().switchMap((cmd) =>
  MusitNode.getStats(cmd.nodeId, cmd.museumId, cmd.token, cmd)
);

export const loadRootNode$ = new Subject().switchMap((cmd) =>
  MusitNode.getNode(cmd.nodeId, cmd.museumId, cmd.token, cmd)
);

export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clearRootNode$.map(() => () => ({ rootNode: null, stats: null })),
    actions.loadStats$.map((stats) => (state) => ({ ...state, stats})),
    actions.loadRootNode$.map((rootNode) => (state) => ({...state, rootNode})),
    actions.setLoading$.map(() => state => ({...state, children: { data: null, loading: true }})),
    actions.loadNodes$.map((data) => (state) => ({...state, children: { data, loading: false }})),
    actions.loadObjects$.map((data) => (state) => ({...state, children: { data, loading: false }}))
  );

export default createStore('storageFacility', reducer$({clearRootNode$, setLoading$, loadStats$, loadRootNode$, loadObjects$, loadNodes$}));
