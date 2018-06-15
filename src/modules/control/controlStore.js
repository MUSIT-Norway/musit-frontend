import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import Control from '../../models/control';
import MusitNode from '../../models/node';

export const clear$ = createAction('clear$');
export const loadRootNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNode());
export const getControl$ = createAction('getControl$').switchMap(Control.getControl());

export const initialState = {};

export const reducer$ = actions =>
  Observable.merge(
    actions.clear$.map(() => () => initialState),
    actions.loadRootNode$.map(rootNode => state => ({ ...state, rootNode })),
    actions.getControl$.map(data => state => ({ ...state, data }))
  );

export const store$ = (actions$ = { clear$, loadRootNode$, getControl$ }) =>
  createStore('controlStore$', reducer$(actions$), initialState);

export default store$();
