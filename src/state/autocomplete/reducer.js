import { Observable } from 'rxjs/Rx';

export default function createReducer(actions) {
  const initialState = [];
  return Observable.of(() => initialState)
    .merge(
      actions.update$.map((data) => () => data),
      actions.clear$.map(() => () => initialState),
    );
}