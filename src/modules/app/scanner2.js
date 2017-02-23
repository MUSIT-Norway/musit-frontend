import { Observable, Subject } from 'rxjs';

const initialState = { buffer: '', code: '', invalid: false, uuid: false };

const clear$ = new Subject().map(() => () => initialState);

const keyPressReducer$ = Observable.fromEvent(window.document, 'keypress')
  .filter((e: Event) => e.which !== 13)
  .map((e: Event) => String.fromCharCode(e.which))
  .map((c: String) => c.replace(/\+/g, '-'))
  .map((c: String) => (state) => ({...state, buffer: state.buffer + c }));

const keyPressTimeout$ = keyPressReducer$.debounce(() => Observable.timer(50))
  .map(() => (state) => {
    const buffer = state.buffer;
    let invalid = false;
    if (!/^[0-9a-f\-]+$/.test(buffer)) {
      invalid = true;
    }
    let uuid = false;
    if (/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(buffer)) {
      uuid = true;
    }
    return {...state, buffer: '', code: buffer, invalid, uuid};
  });

const scanner$ = Observable.of(initialState)
  .merge(keyPressReducer$, keyPressTimeout$, clear$)
  .scan((value, reducer) => reducer(value))
  .distinctUntilChanged()
  .do((state) => console.log(JSON.stringify(state)))
  .publishReplay(1)
  .refCount();

export const isScannerActive = () => scanner$.operator.connectable._refCount > 0;

export default scanner$;