import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import omit from 'lodash/omit';

const initialState = { buffer: '', code: '', uuid: false };

export const clearScanner$ = createAction('clearScanner$').map(() => () => initialState);

const keyPressReducer$ = Observable.fromEvent(window.document, 'keypress')
  .filter((e: Event) => e.which !== 13)
  .map((e: Event) => String.fromCharCode(e.which))
  .map((c: String) => c.replace(/\+/g, '-'))
  .map((c: String) => (state) => ({...state, buffer: state.buffer + c }));

const keyPressTimer$ = keyPressReducer$.debounce(() => Observable.timer(50))
  .map(() => (state) => {
    const buffer = state.buffer;
    const uuid = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(buffer);
    return {...state, buffer: '', code: buffer, uuid};
  });

const scanner$ = createStore('scanner', Observable.merge(keyPressReducer$, keyPressTimer$, clearScanner$), Observable.of(initialState))
  .filter(state => state.code !== '')
  .map(state => omit(state, 'buffer'))
  .distinctUntilChanged();

export default scanner$;