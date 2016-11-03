import { Observable, Subject } from 'rxjs/Rx';
import * as loglevel from 'loglevel';
import 'whatwg-fetch';
import { getToken } from '../../middleware/ApiClient'

// Reducer subjects (for data)
export const update$ = new Subject();
export const clear$ = new Subject();

// Async actions
export const input$ = new Subject();
input$.map(update => update.value)
  .filter((text) => text.length > 2)
  .debounce(() => Observable.timer(700))
  .distinctUntilChanged()
  .switchMap((term) =>
    fetch(`/api/actor/v1/person?search=[${term}]&museumId=1`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }).then((response) => response.json())
  )
  .subscribe(
    (data) => update$.next(data),
    (error) => {
      loglevel.error('Error:' + error);
      clear$.next();
    }
  );