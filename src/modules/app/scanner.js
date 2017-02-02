import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

const UUID_REGEX = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export const scanForUUID$ = createAction('scanForUUID$');

export const toggleEnabled$ = createAction('toggleEnabled$');

const keyPress$ = Observable.fromEvent(window.document.body, 'keypress');

const scheduledClear$ = keyPress$.debounce(() => Observable.timer(500));

export const reducer$ = (actions) => Observable.merge(
  actions.scheduledClear$.map(() => (state) => ({...state, code: ''})),
  actions.scanForUUID$.map((matches) => (state) => ({...state, matches})),
  actions.toggleEnabled$.map(() => (state) => {
    const subscription = Observable.fromEvent(document.getElementsByClassName('oldBarCodeInput'), 'keypress')
      .subscribe((e) => console.log(String.fromCharCode(e.which)));
    return {...state, enabled: !state.enabled, subscription };
  }),
  actions.keyPress$.map((e) => (state) => {
    if (!state.enabled) {
      return state;
    }
    let code = `${state.code || ''}${String.fromCharCode(e.which).replace('\\+', '-')}`;
    if (UUID_REGEX.test(code)) {
      scanForUUID$.next(code);
      code = '';
    } else if (code.length > 32) {
      code = '';
    }
    return {...state, code };
  })
);

const store$ = createStore('scanner', reducer$({
  scanForUUID$,
  scheduledClear$,
  toggleEnabled$,
  keyPress$
}), Observable.of({ enabled: false, code: '', matches: [] }));

export default store$;