import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
//import Sample from '../../models/sample';
//import Event from '../../models/event';
const initialState = { objectData: {}, events: [], samples: [] };

const loadObjectData =  () => (val) => {
  console.log('Hei', val);
  const object$ = MusitObject.getObjectDetails() (val);
  const events$ = Observable.of([]);
  const samples$ = Observable.of([]);
  const r = Observable.forkJoin(object$,events$, samples$).map(([objectData, events, samples]) => ({ objectData, events, samples }));
  r.map((d)=> console.log('Map', d));
  return r;
};


export const loadObject$  = createAction('loadObject$').switchMap(loadObjectData());
export const clear$ = createAction('clear$');


const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.loadObject$.map((data) => (state) => ({...state, ...data})));

export const objectStore$  = (actions = { loadObject$,  clear$ }) =>
  createStore('objectStore$', reducer$(actions), Observable.of(initialState));

export default objectStore$();