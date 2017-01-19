import { Observable } from 'rxjs';
import { createStore, createActions } from '../../state/RxStore';
import { get as ajaxGet } from '../../state/ajax';
export const { update$, clear$ } = createActions('update$', 'clear$');

export default (urlFn) => createStore(Observable.empty().merge(
    clear$.map(() => () => ({ data: []})),
    update$.debounce(() => Observable.timer(500))
        .distinctUntilChanged()
        .switchMap(({ update: { value }, token, museumId }) =>
            ajaxGet(urlFn(value, museumId), token)
                .map(({ response }) => response)
        )
        .map((suggestions) => (state) => ({...state, data: suggestions}))
));
