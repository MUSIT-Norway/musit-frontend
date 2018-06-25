import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import Control from '../../models/control';
import MusitNode from '../../models/node';
import { TODO } from '../../types/common';

export const clear$ = createAction('clear$');
export const loadRootNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNode());
export const getControl$ = createAction('getControl$').switchMap(Control.getControl());

export const initialState = {};

export const reducer$ = (actions:TODO) =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadRootNode$.map((rootNode:TODO) => (state:TODO) => ({ ...state, rootNode })),
    actions.getControl$.map((data:TODO) => (state:TODO) => ({ ...state, data }))
  );

export const store$ = (actions$ = { clear$, loadRootNode$, getControl$ }) =>
  createStore('controlStore$', reducer$(actions$) as TODO, initialState);

export default store$();
