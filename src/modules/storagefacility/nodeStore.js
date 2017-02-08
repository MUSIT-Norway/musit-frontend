import MusitNode from '../../models/node';
import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import * as ajax from '../../shared/RxAjax';
import { mapToFrontend } from '../../models/mapper';

export const clearNode$ = createAction('clearNode$');



const initialState = {
  environmentRequirement: {},
  environmentAssessment: {},
  securityAssessment: {}
};

const loadNode =  ({ simpleGet }) => (cmd) =>  MusitNode.getNode(simpleGet) (cmd.nodeId, cmd.museumId, cmd.token, cmd);
const addNode =  ({ simplePost }) => (cmd) =>  MusitNode.addNode(simplePost) (cmd.nodeId, cmd.museumId, cmd.token, cmd.data, cmd);

export const loadNode$ = createAction('loadRootNode$').switchMap((cmd) =>
  loadNode(ajax) (cmd)
);

export const addNode$ = createAction('addNode$').switchMap((cmd) =>
  addNode(ajax) (cmd.nodeId, cmd.museumId, cmd.token, cmd.data, cmd)
);

export const updateState$ = createAction('updateState$').switchMap((cmd) =>
  Observable.of(mapToFrontend(cmd.data))
);

export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.loadNode$.map((data) => (state) => ({...state, unit: data})),
    actions.addNode$.map((data) => (state) => ({ ...state, unit: data, loading: false })),
    actions.clearNode$.map(() => () => (initialState)),
    actions.updateState$.map((data) => (state) => ({ ...state, unit: data, loading: false }))
  );

export default createStore('node', reducer$({clearNode$,  updateState$, loadNode$,  addNode$ }), Observable.of(initialState));
