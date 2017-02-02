import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import Control from '../../models/control';
import Observation from '../../models/observation';
import MusitActor from '../../models/actor';
import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import concat from 'lodash/concat';
import * as ajax from '../../shared/RxAjax';
import { omit } from 'lodash';
import MusitObjectSearch from '../../models/objectSearch';



export const loadEvents = ({ simpleGet, simplePost }) => (props) => {
  return Observable.forkJoin(Control.loadControls(simpleGet)(props), Observation.loadObservations(simpleGet)(props))
    .flatMap(([controls, observations]) => {
      const events = orderBy(concat(controls, observations), ['doneDate', 'id'], ['desc', 'desc']);
      const actorIds = uniq(flatten(events.map(r => [r.doneBy, r.registeredBy]))).filter(p => p);
      return MusitActor.getActorDetails(simplePost)(actorIds, props.token)
        .map((actors) =>
          events.map((data) => ({
            ...data,
            ...MusitActor.getActorNames(actors || [], data.doneBy, data.registeredBy)
          }))
        );
    });
};

export const searchForObjects = ({ simpleGet }) => (cmd) => {
  return MusitObjectSearch.searchForObjects(simpleGet)(cmd.params, cmd.page, cmd.collectionId, cmd.museumId, cmd);
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
        return new MusitObjectSearch({
          ...data,
          breadcrumb: (data)
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

const store$ = createStore('objectSearch', reducer$({
  clearSearch$,
  searchObject$,
  changeField$
}), Observable.of(initialState));

export default store$;