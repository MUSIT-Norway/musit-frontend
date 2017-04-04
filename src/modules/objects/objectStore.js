import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { Observable } from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
const initialState = { objectData: {}, events: [], samples: [] };

const loadObjectData =  () => (val) => {

  const object$ = MusitObject.getObjectDetails() (val);
  object$.map(({ response }) => {
    const v = {id: response.id, objectId: response.uuid, token: val.token, museumId: val.museumId, callBack:val.callBack};
    const events$=Event.getAnalysesAndMoves() (v);
    const samples$=Sample.loadSamplesForObject2() (v);
    return Observable.forkJoin(events$,samples$).map(([e,s])=> ({objectData: response,events: e, samples: s})).map(r => r);
  });
};


export const loadObject$  = createAction('loadObject$').switchMap(loadObjectData());
export const clear$ = createAction('clear$');


const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.loadObject$.map((data) => (state) => ({...state, ...data})));

export const objectStore$  = (actions = { loadObject$,  clear$ }) =>
  createStore('objectStore$', reducer$(actions), Observable.of(initialState));

export default objectStore$();