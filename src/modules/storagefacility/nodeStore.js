// @flow
import MusitNode from '../../models/node';
import type { Node } from '../../models/node';
import { Observable, Subject } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

const initialState = {
  unit: {
    environmentRequirement: {},
    environmentAssessment: {},
    securityAssessment: {}
  },
  loaded: false
};

export const clearNode$: Subject<*> = createAction('clearNode$');
export const loadNode$: Subject<Node> = createAction('loadRootNode$').switchMap(
  MusitNode.getNodeWithUpdatedBy()
);
export const updateState$: Subject<Node> = createAction('updateState$');

type Actions = {
  loadNode$: Subject<*>,
  clearNode$: Subject<*>,
  updateState$: Subject<*>
};

export const reducer$ = (actions: Actions) =>
  Observable.merge(
    actions.loadNode$.map(rootNode => state => ({ ...state, rootNode, loaded: true })),
    actions.clearNode$.map(() => () => initialState),
    actions.updateState$.map(unit => state => ({
      ...state,
      unit: { ...initialState.unit, ...unit }
    }))
  );

export const store$ = (actions$: Actions = { clearNode$, updateState$, loadNode$ }) =>
  createStore('node', reducer$(actions$), Observable.of(initialState));

export default store$();
