import { Observable } from 'rxjs';
import { simpleGet } from '../../shared/RxAjax';
import { createStore, createActions } from 'react-rxjs/dist/RxStore';

export const { update$, clear$ } = createActions('update$', 'clear$');

export default (name, urlFn) => createStore(name, Observable.empty().merge(
    clear$.map(() => () => ({ data: []})),
    update$.debounce(() => Observable.timer(500))
        .distinctUntilChanged()
        .switchMap(({ update: { value }, token, museumId }) =>
          simpleGet(urlFn(value, museumId), token)
            .map(({ response }) => response)
            .catch(() => [])
        )
        .map((suggestions) => (state) => ({...state, data: suggestions}))
));
