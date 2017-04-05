import {createStore, createAction} from 'react-rxjs/dist/RxStore';
import {Observable} from 'rxjs';
import MusitObject from '../../models/object';
import Sample from '../../models/sample';
import Event from '../../models/event';
export const initialState = {objectData: {}, events: [], samples: []};

const loadObjectData = () => (val) => {

  return MusitObject.getObjectDetails()(val)
    .map((response) => {
      const v = {
        id: response.uuid,
        objectId: response.id,
        token: val.token,
        museumId: val.museumId,
        callBack: val.callBack
      };

      return Observable.forkJoin(Observable.of(response), Event.getAnalysesAndMoves()(v), Sample.loadSampleDataForObject()(v))
        .map(([o, e, s]) => ({objectData: o, events: e, samples: s}));
    }).flatMap((r)=> r);
};


export const loadObject$ = createAction('loadObject$').switchMap(loadObjectData());
export const clear$ = createAction('clear$');


const reducer$ = (actions) => Observable.merge(
  actions.clear$.map(() => () => initialState),
  actions.loadObject$.map((data) => (state) => ({...state, ...data})));

export const objectStore$ = (actions = {loadObject$, clear$}) =>
  createStore('objectStore$', reducer$(actions), Observable.of(initialState));

export default objectStore$();