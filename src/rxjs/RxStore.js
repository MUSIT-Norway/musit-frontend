import Rx from 'rxjs';
import Config from '../config';
import deepFreeze from 'deep-freeze';

export function createAction() {
  return new Rx.Subject();
}

export function createActions(...actionNames) {
  return actionNames.reduce((akk, name) => ({...akk, [name]: createAction()}), {});
}

export function createStore(name, reducer$, initialState$ = Rx.Observable.of({})) {
  return initialState$
    .merge(reducer$)
    .scan((state, reducer) => {
      if (Array.isArray(reducer)) {
        const [scope, reducerFn] = reducer;
        return {...state, [scope]: reducerFn(state[scope])};
      }
      return {...state, ...reducer(state)};
    })
    .do((state) => {
      if (Config.isDev) {
        deepFreeze(state);
        // eslint-disable-next-line no-console
        console.debug(name, state);
      }
    })
    .publishReplay(1)
    .refCount();
}