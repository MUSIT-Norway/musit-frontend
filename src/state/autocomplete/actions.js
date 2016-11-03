import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { getToken } from '../../middleware/ApiClient';
import * as loglevel from 'loglevel';
import 'whatwg-fetch';

export default function createActions(urlTemplate, debounceTimer = Observable.timer(500)) {
  // Reducer subjects (for data)
  const update$ = new Subject();
  const clear$ = new Subject();

  // Async actions
  const input$ = new Subject();
  input$.map(update => update.value)
    .filter((text) => text.length > 2)
    .debounce(() => debounceTimer)
    .distinctUntilChanged()
    .switchMap((term) => {
      const url = urlTemplate.replace('%term%', term)
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }).then((response) => response.json());
    })
    .subscribe(
      (data) => update$.next(data),
      (error) => {
        loglevel.error('Error:' + error);
        clear$.next();
      }
    );

  return {
    input$,
    update$,
    clear$
  };
}

