import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { getAccessToken } from '../../reducers/auth';
import * as loglevel from 'loglevel';
import 'whatwg-fetch';
import { getMuseumId } from '../../reducers/auth';

export default function createActions(urlFun) {
  // Reducer subjects (for data)
  const update$ = new Subject();
  const clear$ = new Subject();

  // Async actions
  const input$ = new Subject();
  input$
    .debounce(() => Observable.timer(500))
    .distinctUntilChanged()
    .switchMap((term) =>
      fetch(urlFun(term, getMuseumId()), {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
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

  return {
    input$,
    update$,
    clear$
  };
}

