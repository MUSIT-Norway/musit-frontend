import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import * as ajax from '../../shared/RxAjax';
import { omit } from 'lodash';
import MusitObject from '../../models/object';
import { getPath } from '../../shared/util';


export const searchForObjects = ({ simpleGet }) => (cmd) => {
  return MusitObject.searchForObjects(simpleGet)(cmd.params, cmd.page, cmd.collectionId, cmd.museumId, cmd);
};

const initialState = {
  data: {
    totalMatches: 0,
    matches: []
  },
  params: {
    currentPage: 1,
    perPage: 50
  }
};

export const clearSearch$ =  createAction('clearSearch$');
export const searchObject$ = createAction('searchObject$').switchMap(searchForObjects(ajax));
export const changeField$ = createAction('changeField$');

export const reducer$ = (actions) => Observable.merge(
  actions.clearSearch$.map(() => () => initialState),
  actions.searchObject$.map((result) => (state) => ({
    ...omit(state, 'error'),
    loading: false,
    loaded: true,
    data: {
      totalMatches: result.totalMatches,
      matches: result.matches.map(data => {
        return new MusitObject({
          ...data,
          breadcrumb: getPath(data)
        });
      })
    }
  })),
  actions.changeField$.map((props) => (state) => ({
    ...state,
    params: {
      ...state.params,
      [props.field]: props.value
    }
  }))
);

export default createStore('objectSearchStore$', reducer$({
  clearSearch$,
  searchObject$,
  changeField$
}), Observable.of(initialState));

