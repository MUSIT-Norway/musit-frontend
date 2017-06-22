import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitObject from '../../models/object';

export const searchForObjects = MusitObject.searchForObjects;

export const initialState = {
  loaded: false,
  data: {
    totalMatches: 0,
    matches: []
  }
};

export const clearSearch$ = createAction('clearSearch$');
export const clearStore$ = createAction('clearStore$');
export const searchForObjects$ = createAction('searchForObjects$').switchMap(
  searchForObjects()
);
export const onChangeField$ = createAction('onChangeField$');

export const reducer$ = actions =>
  Observable.merge(
    actions.clearStore$.map(() => () => initialState),
    actions.clearSearch$.map(() => () => ({ ...initialState, loading: true })),
    actions.searchForObjects$.map(result => state => {
      const matches = result.matches;
      return {
        ...state,
        loaded: true,
        loading: false,
        data: {
          totalMatches: result.totalMatches ? result.totalMatches : 0,
          matches
        }
      };
    }),
    actions.onChangeField$.map(({ field, value }) => state => ({
      ...state,
      params: {
        ...state.params,
        [field]: value
      }
    }))
  );

export const store$ = (
  actions$ = { clearSearch$, clearStore$, searchForObjects$, onChangeField$ }
) => createStore('objectSearchStore$', reducer$(actions$), Observable.of(initialState));

export default store$();
