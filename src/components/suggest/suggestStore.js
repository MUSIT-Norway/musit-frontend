import { Observable } from 'rxjs';
import { createStore, createActions } from '../../rxjs/RxStore';
import { get as ajaxGet } from '../../rxjs/ajax';
export const { update$, clear$ } = createActions('update$', 'clear$');

export default (urlFn) => createStore(Observable.empty().merge(
    clear$.map(() => () => ({ data: []})),
    update$.debounce(() => Observable.timer(500))
        .distinctUntilChanged()
        .switchMap(({ update: { value }, token, museumId }) =>
            ajaxGet(urlFn(value, museumId), token)
                .map(({ response }) => response)
                .catch(() => [])
        )
        .map((suggestions) => (state) => ({...state, data: suggestions}))
));
