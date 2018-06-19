import { Observable } from 'rxjs';
import { simpleGet } from '../../shared/RxAjax';
import { createStore } from 'react-rxjs';
import { createActions } from '../../shared/react-rxjs-patch';
import { TODO } from '../../types/common';
export const { update$, clear$ } = createActions('update$', 'clear$');

/* NOT USED:
const emptyActor = {
  dataportenId: '',
  dataportenUser: '',
  email: '',
  fn: ''
};
*/
export default (name: TODO, urlFn: TODO) =>
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
        .map(suggestions => (state:TODO) => ({ ...state, data: suggestions }))) as TODO,
    {}
  );
