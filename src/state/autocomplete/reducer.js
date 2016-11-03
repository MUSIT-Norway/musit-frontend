import { Observable } from 'rxjs/Rx';

export default function createReducer(actions, stateKey = "suggest") {
  const initialState = [];
  const reducer$ = Observable.of(() => initialState)
    .merge(
      actions.update$.map((data) => () => data),
      actions.clear$.map(() => () => initialState),
    );
  return Observable.merge(
    reducer$.map(reducer => [stateKey, reducer]),
  );
}