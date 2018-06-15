// @flow
import MusitNode from '../../models/node';
import type { Node } from 'types/node';
import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import { simpleGet } from '../../shared/RxAjax';

const initialState = {
  unit: {
    environmentRequirement: {},
    environmentAssessment: {},
    securityAssessment: {}
  },
  loaded: false
};

export const clearNode$: Observable<void> = createAction('clearNode$');
export const loadNode$: Observable<Node> = createAction('loadRootNode$').switchMap(
  MusitNode.getNodeWithUpdatedBy(simpleGet)
);
export const updateState$: Observable<Node> = createAction('updateState$');

type Actions = {
  loadNode$: Observable<Node>,
  clearNode$: Observable<void>,
  updateState$: Observable<Node>
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
  createStore('node', reducer$(actions$), initialState);

export default store$();
