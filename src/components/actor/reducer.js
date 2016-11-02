import { Observable } from 'rxjs/Rx';
import actions from "./actions";

const dataFromServer = [
  {
    id: 1,
    fn: 'Jarl parl'
  },
  {
    id: 2,
    fn: 'Line pine'
  },
  {
    id: 3,
    fn: 'Kjell pell'
  },
  {
    id: 4,
    fn: 'Stein sein'
  },
  {
    id: 5,
    fn: 'Knut lut'
  },
  {
    id: 6,
    fn: 'Ellen'
  }
]

const initialState = [];

const ActorReducer$ = Observable.of(() => initialState)
  .merge(
    actions.suggest$.map((update) => () => {
      if (!update) {
        return initialState;
      }
      return dataFromServer.filter(d => {
        const name = d.fn.toLowerCase();
        const query = update.value.toLowerCase();
        return name.indexOf(query) > -1
      })
    }),
    actions.clear$.map(() => () => initialState),
  );

export default Observable.merge(
  ActorReducer$.map(reducer => ["suggest", reducer]),
);