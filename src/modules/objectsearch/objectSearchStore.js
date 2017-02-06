import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import * as ajax from '../../shared/RxAjax';
import MusitObject from '../../models/object';
import { getPath } from '../../shared/util';


export const searchForObjects = ({ simpleGet }) => (cmd) => {
  return MusitObject.searchForObjects(simpleGet)(cmd.params, cmd.page, cmd.museumId, cmd.collectionId, cmd.token, cmd);
};

export const initialState = {
  data: {
    loaded: false,
    loading: true,
    totalMatches: 0,
    matches: []
  },
  params: {
    currentPage: 1,
    perPage: 50
  }
};

export const clearSearch$ =  createAction('clearSearch$');
export const searchForObjects$ = createAction('searchForObjects$').switchMap(searchForObjects(ajax));
export const onChangeField$ = createAction('onChangeField$');

export const reducer$ = (actions) => Observable.merge(
  actions.clearSearch$.map(() => () => initialState),
  actions.searchForObjects$.map((result) => (state) => {
    const matches = result.matches ? result.matches.map(data => {
      return new MusitObject({
        ...data,
        breadcrumb: getPath(data)
      });
    }) : [];
    return {
      ...state,
      loaded: true,
      loading: false,
      data: {
        totalMatches: result.totalMatches ? result.totalMatches : 0,
        matches
      }
    };}),
  actions.onChangeField$.map(({ field, value }) => (state) => ({
    ...state,
    params: {
      ...state.params,
      [field]: value
    }
  }))
);

export default createStore('objectSearchStore$', reducer$({
  clearSearch$,
  searchForObjects$,
  onChangeField$
}), Observable.of(initialState));

