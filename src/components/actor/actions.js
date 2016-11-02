import { Observable, Subject } from 'rxjs/Rx';
import * as loglevel from 'loglevel'

// Reducer subjects (for data)
export const update$ = new Subject();
export const clear$ = new Subject();

// Async actions
export const input$ = new Subject();
input$.map(update => update.value)
  .filter((text) => text.length > 2)
  .debounce(() => Observable.timer(700))
  .distinctUntilChanged()
  .switchMap((term) => {
    return global.jQuery.ajax({
      url: `/api/actor/v1/person?search=[${term}]&museumId=1`,
      dataType: 'json'
    }).promise();
  })
  .subscribe(
    (data) => update$.next(data),
    (error) => {
      loglevel.error('Error:' + error)
      clear$.next()
    }
  );