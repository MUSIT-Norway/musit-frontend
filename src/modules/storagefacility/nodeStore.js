import MusitNode from '../../models/node';
import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { simpleGet, simplePost } from '../../shared/RxAjax';
import { mapToFrontend } from '../../models/mapper';

export const clearNode$ = createAction('clearNode$');

export const loadNode$ = createAction('loadRootNode$').switchMap((cmd) =>
  MusitNode.getNode(simpleGet)(cmd.nodeId, cmd.museumId, cmd.token, cmd)
);

export const addNode$ = createAction('addNode$').switchMap((cmd) =>
  MusitNode.addNode(simplePost) (cmd.nodeId, cmd.museumId, cmd.token, cmd.data, cmd)
);

export const updateState$ = createAction('updateState$').switchMap((cmd) =>
  Observable.of(mapToFrontend(cmd.data))
);

export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.loadNode$.map((unit) => (state) => ({...state, unit})),
    actions.addNode$.map((data) => (state) => ({ ...state, data, loading: false })),
    actions.clearNode$.map((data) => (state) => ({ ...state, data, loading: false })),
    actions.updateState$.map((data) => (state) => ({ ...state, data, loading: false }))
  );

export default createStore('node', reducer$({clearNode$,  updateState$, loadNode$,  addNode$ }), Observable.of({
  environmentRequirement: {},
  environmentAssessment: {},
  securityAssessment: {}
}));
