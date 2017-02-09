import { Observable } from 'rxjs';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import Observation from '../../models/observation';
import MusitNode from '../../models/node';
import { simpleGet } from '../../shared/RxAjax';

export const loadRootNode$ = createAction('loadRootNode$').switchMap((cmd) => MusitNode.getNode(simpleGet)(cmd));
export const setLoading$ = createAction('setLoading$');
export const getObservation$ = createAction('getObservation$').switchMap(Observation.getObservation());

export const reducer$ = (actions) => Observable.merge(
  actions.loadRootNode$.map((rootNode) => (state) => ({...state, rootNode})),
  actions.getObservation$.map((data) => (state) => ({...state, data, loading: false})),
  actions.setLoading$.map(() => (state) => ({...state, data: {}, rootNode: null, loading: true}))
);

const store$ = createStore('observation', reducer$({
  setLoading$, getObservation$, loadRootNode$
}), Observable.of({ data: {}, rootNode: null }));

export default store$;