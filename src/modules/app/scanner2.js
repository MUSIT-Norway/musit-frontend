import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import omit from 'lodash/omit';

const initialState = { buffer: '', code: '', valid: false, uuid: false };

export const clear$ = createAction('clear$').map(() => () => initialState);

const keyPressReducer$ = Observable.fromEvent(window.document, 'keypress')
  .filter((e: Event) => e.which !== 13)
  .map((e: Event) => String.fromCharCode(e.which))
  .map((c: String) => c.replace(/\+/g, '-'))
  .map((c: String) => (state) => ({...state, buffer: state.buffer + c }));

const keyPressTimer$ = keyPressReducer$.debounce(() => Observable.timer(50))
  .map(() => (state) => {
    const buffer = state.buffer;
    const valid = /^[0-9a-f\-]+$/i.test(buffer);
    const uuid = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(buffer);
    return {...state, buffer: '', code: buffer, valid, uuid};
  });

const scanner$ = createStore('scanner', Observable.merge(keyPressReducer$, keyPressTimer$, clear$), Observable.of(initialState))
  .filter(state => state.code !== '')
  .map(state => omit(state, 'buffer'))
  .distinctUntilChanged();

const inc$ = createAction('inc$').map(() => (state) => ({...state, value: state.value + 1}));
const dec$ = createAction('dec$').map(() => (state) => ({...state, value: state.value - 1}));
export const count$ = createStore('count', Observable.merge(inc$, dec$), Observable.of({ value: 0 }));

const subscribe = (onNext, onError, onComplete) => {
  inc$.next();
  const subscription = scanner$.subscribe(onNext, onError, onComplete);
  return {
    unsubscribe: () => {
      subscription.unsubscribe();
      dec$.next();
    }
  };
};

export default subscribe;