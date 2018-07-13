// @flow
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import  { SearchResult } from '../../models/node';
import { NodeStats, Node } from "../../types/node";
import { ObjectData } from "../../types/object";
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { simpleGet } from '../../shared/RxAjax';
import { TODO } from '../../types/common';

export const clearRootNode$: Observable<void> = createAction('clearRootNode$');
export const setLoading$: Observable<void> = createAction('setLoading$');
export const loadNodes$: Observable<SearchResult> = createAction('loadNodes$').switchMap(
  MusitNode.getNodes(simpleGet)
);
export const loadObjects$: Observable<Array<ObjectData>> = createAction(
  'loadObjects$'
).switchMap(MusitObject.getObjects(simpleGet));
export const loadStats$: Observable<NodeStats> = createAction('loadStats$').switchMap(
  MusitNode.getStats(simpleGet)
);
export const loadRootNode$: Observable<Node> = createAction('loadRootNode$').switchMap(
  MusitNode.getNode(simpleGet)
);

type Actions = {
  clearRootNode$: Observable<void>,
  loadStats$: Observable<NodeStats>,
  loadRootNode$: Observable<Node>,
  setLoading$: Observable<void>,
  loadNodes$: Observable<SearchResult>,
  loadObjects$: Observable<Array<ObjectData>>
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.clearRootNode$.map(() => (state:TODO) => ({
      ...state,
      rootNode: null,
      stats: null
    })),
    actions.loadStats$.map(stats => (state:TODO) => ({ ...state, stats })),
    actions.loadRootNode$.map(rootNode => (state:TODO) => ({ ...state, rootNode })),
    actions.setLoading$.map(() => (state:TODO) => ({
      ...state,
      children: { data: null, loading: true }
    })),
    actions.loadNodes$.map(data => (state:TODO) => ({
      ...state,
      children: { data, loading: false }
    })),
    actions.loadObjects$.map(data => (state:TODO) => ({
      ...state,
      children: { data, loading: false }
    }))
  );

export const store$ = (
  actions$: Actions = {
    clearRootNode$,
    setLoading$,
    loadStats$,
    loadRootNode$,
    loadObjects$,
    loadNodes$
  }
) => createStore('storageFacility', reducer$(actions$), {});

export default store$();
