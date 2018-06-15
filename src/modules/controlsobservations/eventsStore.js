import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import Control from '../../models/control';
import Observation from '../../models/observation';
import MusitActor from '../../models/actor';
import MusitNode from '../../models/node';
import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import concat from 'lodash/concat';
import * as ajax from '../../shared/RxAjax';

export const loadEvents = ({ simpleGet, simplePost }) => props => {
  const controls$ = Control.loadControls(simpleGet)(props);
  const observations$ = Observation.loadObservations(simpleGet)(props);
  return Observable.forkJoin(
    controls$,
    observations$
  ).flatMap(([controls, observations]) => {
    const events = orderBy(
      concat(controls, observations),
      ['doneDate', 'id'],
      ['desc', 'desc']
    );
    const actorIds = uniq(flatten(events.map(r => [r.doneBy, r.registeredBy]))).filter(
      p => p
    );
    return MusitActor.getActors(simplePost)({
      actorIds,
      token: props.token
    }).map(actors =>
      events.map(data => ({
        ...data,
        ...MusitActor.getActorNames(actors || [], data.doneBy, data.registeredBy)
      }))
    );
  });
};

export const clearEvents$ = createAction('clearEvents$');
export const loadEvents$ = createAction('loadEvents$').switchMap(loadEvents(ajax));
export const loadRootNode$ = createAction('loadRootNode$').switchMap(MusitNode.getNode());

export const reducer$ = actions =>
  Observable.merge(
    actions.clearEvents$.map(() => state => ({ ...state, data: [], loading: true })),
    actions.loadRootNode$.map(rootNode => state => ({ ...state, rootNode })),
    actions.loadEvents$.map(data => state => ({ ...state, data, loading: false }))
  );

export const store$ = (actions$ = { clearEvents$, loadEvents$, loadRootNode$ }) =>
  createStore('controlsAndObservations', reducer$(actions$), { data: [] });

export default store$();
