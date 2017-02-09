import { Observable, Subject } from 'rxjs';
import MusitNode from '../../models/node';
import { createStore } from 'react-rxjs/dist/RxStore';

export const clear$ = new Subject();
export const loadChildren$ = new Subject().switchMap(cmd => MusitNode.getNodes()(cmd));
export const loadNode$ = new Subject().switchMap(cmd => MusitNode.getNode()(cmd));

const initialState = {
  selectedNode: null,
  data: {
    totalMatches: 0,
    matches: [],
    loading: true
  }
};

export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadNode$.map((node) => (state) => ({...state, selectedNode: node})),
    actions.loadChildren$.map((data) => (state) => ({...state, data: { ...data, loading: false }})),
  );

export default createStore('moveDialog', reducer$({clear$, loadNode$, loadChildren$}), Observable.of(initialState));
