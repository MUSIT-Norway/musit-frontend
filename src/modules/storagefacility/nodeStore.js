import MusitNode from '../../models/node';
import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { mapToFrontend } from '../../models/mapper';

const initialState = {
  unit: {
    environmentRequirement: {},
    environmentAssessment: {},
    securityAssessment: {}
  }
};

export const clearNode$ = createAction('clearNode$');
export const loadRootNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNode());
export const addNode$ = createAction('addNode$').switchMap(MusitNode.addNode());
export const updateState$ = createAction('updateState$').map(mapToFrontend);

export const reducer$ = (actions) => Observable.merge(
  actions.loadRootNode$.map((rootNode) => (state) => ({...state, rootNode})),
  actions.addNode$.map((unit) => (state) => ({...state, unit})),
  actions.clearNode$.map(() => () => initialState),
  actions.updateState$.map((unit) => (state) => ({...state, unit}))
);

export default createStore('node', reducer$({
  clearNode$, updateState$, loadRootNode$, addNode$
}), Observable.of(initialState));
