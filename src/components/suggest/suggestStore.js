import { Observable } from 'rxjs';
import { simpleGet } from '../../shared/RxAjax';
import { createStore } from 'react-rxjs';
import { createActions } from '../../shared/react-rxjs-patch';
export const { update$, clear$ } = createActions('update$', 'clear$');

const emptyActor = {
  dataportenId: '',
  dataportenUser: '',
  email: '',
  fn: ''
};
export default (name, urlFn) =>
  createStore(
    name,
    Observable.empty().merge(
      clear$.map(() => () => ({ data: [] })),
      update$
        .debounce(() => Observable.timer(500))
        .distinctUntilChanged()
        .switchMap(({ update: { value }, token, museumId }) =>
          simpleGet(urlFn(value, museumId), token)
            .map(({ response }) => response)
            .catch(() => [])
        )
        .map(suggestions => state => ({ ...state, data: suggestions }))
    ),
    {}
  );
