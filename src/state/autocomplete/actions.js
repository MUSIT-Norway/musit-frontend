import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { getToken } from '../../middleware/ApiClient';
import * as loglevel from 'loglevel';
import 'whatwg-fetch';
import { getMuseumId } from '../../reducers/auth';

export default function createActions(urlTemplate) {
  // Reducer subjects (for data)
  const update$ = new Subject();
  const clear$ = new Subject();

  // Async actions
  const input$ = new Subject();
  input$
    .debounce(() => Observable.timer(500))
    .distinctUntilChanged()
    .switchMap((term) => {
      const url = urlTemplate
        .replace('%term%', encodeURIComponent(term))
        .replace('%museumId%', encodeURIComponent(getMuseumId()));
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

