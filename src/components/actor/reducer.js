import { Observable } from 'rxjs/Rx';
import { clear$, update$ } from "./actions";

const initialState = [];

const ActorReducer$ = Observable.of(() => initialState)
  .merge(
    update$.map((data) => () => data),
    clear$.map(() => () => initialState),
  );

export default Observable.merge(
  ActorReducer$.map(reducer => ["suggest", reducer]),
);