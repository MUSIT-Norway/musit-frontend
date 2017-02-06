import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export const scanForUUID$ = createAction('scanForUUID$');

export const toggleEnabled$ = createAction('toggleEnabled$');

const keyPress$ = Observable.fromEvent(window.document.body, 'keypress');

const scheduledClear$ = keyPress$.debounce(() => Observable.timer(500));

export const reducer$ = (actions) => Observable.merge(
  actions.scheduledClear$.map(() => (state) => {
    const code = /^[0-9]+$/.test(state.buffer) ? state.buffer : '';
    return {...state, buffer: null, code};
  }),
  actions.scanForUUID$.map((matches) => (state) => ({...state, matches})),
  actions.toggleEnabled$.map(() => (state) => ({...state, enabled: !state.enabled })),
  actions.keyPress$.map((e) => (state) => {
    if (!state.enabled) {
      return state;
    }
    let buffer = `${state.buffer || ''}${String.fromCharCode(e.which).replace('\\+', '-')}`;
    if (UUID_REGEX.test(buffer)) {
      scanForUUID$.next(buffer);
      buffer = '';
    } else if (buffer.length > 32) {
      buffer = '';
    }
    return {...state, buffer };
  })
);

const store$ = createStore('scanner', reducer$({
  scanForUUID$,
  scheduledClear$,
  toggleEnabled$,
  keyPress$
}), Observable.of({ enabled: false, buffer: null, code: null, matches: [] }));

export default store$;