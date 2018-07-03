import { Observable, Subject } from 'rxjs';
import MusitNode from '../../models/node';
import { Node } from '../../types/node';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { TODO } from '../../types/common';

export const PER_PAGE = 10;

export const clear$ = createAction('clear$');
export const setPage$ = createAction('setPage$');
export const setLoading$ = createAction('setLoading$');
export const loadChildren$ = (createAction('loadChildren$').switchMap(
  MusitNode.getNodes()
) as TODO) as Subject<TODO>;
/*Doesn't seem like any of the two SearchResult types we have defined matches the usage in this file
  (So either we need to extend one of these, or define a third SearchResult type.
   */

export const loadNode$ = (createAction('loadNode$').switchMap(
  MusitNode.getNode()
) as TODO) as Subject<Node>;

interface MoveDialogStoreStateData {
  totalMatches: number;
  matches: TODO[];
  loading: boolean;
}
export interface MoveDialogStoreState {
  selectedNode: TODO | null;
  data: MoveDialogStoreStateData;
  page?: TODO | null;
}

export const initialState: MoveDialogStoreState = {
  selectedNode: null,
  data: {
    totalMatches: 0,
    matches: [],
    loading: false
  }
};

export const updateMoveDialog = (nodeId: TODO, museumId: TODO, token: TODO) => {
  loadNode$.next({
    id: nodeId,
    museumId,
    token
  });
  loadChildren$.next({
    id: nodeId,
    museumId,
    token,
    page: {
      page: 1,
      limit: PER_PAGE
    }
  });
};

//I've just been guessing that MoveDialogStoreState is the propert type of the state parameter below...
export const reducer$ = (actions: TODO) =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.setLoading$.map((loading: boolean) => (state: MoveDialogStoreState) => ({
      ...state,
      data: { ...state.data, loading }
    })),
    actions.loadNode$.map((node: Node) => (state: MoveDialogStoreState) => ({
      ...state,
      selectedNode: node
    })),
    actions.loadChildren$.map((data: TODO) => (state: MoveDialogStoreState) => ({
      ...state,
      data: { ...data, loading: false }
    })),
    actions.setPage$.map((page: TODO) => (state: MoveDialogStoreState) => ({
      ...state,
      page
    }))
  );

export const store$ = (
  actions$ = { clear$, setPage$, loadNode$, loadChildren$, setLoading$ }
) => createStore('moveDialog', reducer$(actions$) as TODO, initialState);

export default store$();
