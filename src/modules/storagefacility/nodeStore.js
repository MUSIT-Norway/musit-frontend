import MusitNode from '../../models/node';
import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

const initialState = {
  unit: {
    environmentRequirement: {},
    environmentAssessment: {},
    securityAssessment: {}
  },
  loaded: false
};

export const clearNode$ = createAction('clearNode$');
export const loadNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNodeWithUpdatedBy());
export const updateState$ = createAction('updateState$');

export const reducer$ = (actions) => Observable.merge(
  actions.loadNode$.map((rootNode) => (state) => ({...state, rootNode, loaded: true})),
  actions.clearNode$.map(() => () => initialState),
  actions.updateState$.map((unit) => (state) => ({...state, unit: {...initialState.unit, ...unit}}))
);

export default createStore('node', reducer$({
  clearNode$, updateState$, loadNode$
}), Observable.of(initialState));
