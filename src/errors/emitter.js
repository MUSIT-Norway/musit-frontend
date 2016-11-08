import { Subject } from 'rxjs/Rx';

const event$ = new Subject();
export default event$;

export const emitSuccess = (event) =>
  event$.next({ type: 'musitNotification', payload: event });
export const emitError = (event) =>
  event$.next({ type: 'musitError', payload: event });