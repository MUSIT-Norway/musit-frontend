import { Observable } from 'rxjs';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import * as ajax from '../../shared/RxAjax';
import Observation from '../../models/observation';
import MusitNode from '../../models/node';

export const loadRootNode = ({ simpleGet }) => (cmd) => {
  return MusitNode.getNode(simpleGet)(cmd.nodeId, cmd.museumId, cmd.token, cmd);
};

export const getObservation = ({ simpleGet, simplePost }) => (cmd) => {
  return Observation.getObservation(simpleGet, simplePost)(cmd.nodeId, cmd.observationId, cmd.museumId, cmd.token);
};

export const addObservation = ({ simplePost }) => (cmd) => {
  return Observation.addObservation(simplePost)(cmd.nodeId, cmd.museumId, cmd.data, cmd.token, cmd);
};

export const addObservation$ = createAction('addObservation$').switchMap(addObservation(ajax));
export const loadRootNode$ = createAction('loadRootNode$').switchMap(loadRootNode(ajax));
export const setLoading$ = createAction('clearObservation$');
export const getObservation$ = createAction('loadObservation$').switchMap(getObservation(ajax));

export const reducer$ = (actions) => Observable.merge(
  actions.addObservation$.map((data) => (state) => ({...state, data})),
  actions.loadRootNode$.map((rootNode) => (state) => ({...state, rootNode})),
  actions.getObservation$.map((data) => (state) => ({...state, data, loading: false})),
  actions.setLoading$.map(() => (state) => ({...state, data: {}, rootNode: null, loading: true}))
);

const store$ = createStore('observation', reducer$({
  setLoading$, getObservation$, loadRootNode$, addObservation$
}), Observable.of({ data: {}, rootNode: null }));

export default store$;