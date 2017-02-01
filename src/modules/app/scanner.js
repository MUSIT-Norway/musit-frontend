import { Observable } from 'rxjs';

import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const scanForUUID$ = createAction('scanForUUID$');

export const toggleEnabled$ = createAction('toggleEnabled$');

const keyPress$ = Observable.fromEvent(window.document.body, 'keypress');

const scheduledClear$ = keyPress$.debounce(() => Observable.timer(500));

const reducer$ = Observable.merge(
  scheduledClear$.map(() => (state) => ({...state, code: ''})),
  scanForUUID$.map((matches) => (state) => ({...state, matches})),
  toggleEnabled$.map(() => (state) => ({...state, enabled: !state.enabled})),
  keyPress$.map((e) => (state) => {
    if (!state.enabled) {
      return state;
    }
    let code = `${state.code || ''}${String.fromCharCode(e.which).replace('\\+', '-')}`;
    if (/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(code)) {
      scanForUUID$.next(code);
      code = '';
    } else if (code.length > 32) {
      code = '';
    }
    return {...state, code };
  })
);

const store$ = createStore('scanner', reducer$, Observable.of({ enabled: false, code: '', matches: [] }));

export default store$;