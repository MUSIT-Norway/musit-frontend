import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
const initialState =  {};

const loadObjectData =  ({simpleGet, simplePost}) => (props) => {
  const object$ = MusitObject.getObjectDetails(simpleGet) (props);
  const events$ = Event.getAnalysesAndMoves({simpleGet, simplePost})(props);
  const samples$ = Sample.loadSamplesForObject(simpleGet) (props);
  return  Observable.forkJoin(object$,events$,samples$).map(([objectData, events, samples]) => ({ objectData, events, samples }));
};


export const loadObject$:any  = createAction('loadObject$').switchMap(loadObjectData);
export const clear$: any = createAction('clear$');


const reducer$: {} = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.loadObject$.map((data) => (state) => ({...state, ...data }))
);

export const objectStore$  = (actions = { loadObject$,  clear$ }) =>
  createStore('objectStore$', reducer$(actions), Observable.of(initialState));

export default objectStore$;