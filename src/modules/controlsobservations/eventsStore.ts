import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import Control from '../../models/control';
import Observation from '../../models/observation';
import MusitActor from '../../models/actor';
import MusitNode from '../../models/node';
import { orderBy, uniq, flatten, concat } from 'lodash';
import * as ajax from '../../shared/RxAjax';
import { TODO } from '../../types/common';

export const loadEvents = ({ simpleGet, simplePost }: TODO) => (props: TODO) => {
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
    } as TODO).map(actors =>
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

export const reducer$ = (actions: TODO) =>
  Observable.merge(
    actions.clearEvents$.map(() => (state: TODO) => ({
      ...state,
      data: [],
      loading: true
    })),
    actions.loadRootNode$.map((rootNode: TODO) => (state: TODO) => ({
      ...state,
      rootNode
    })),
    actions.loadEvents$.map((data: TODO) => (state: TODO) => ({
      ...state,
      data,
      loading: false
    }))
  );

export const store$ = (actions$ = { clearEvents$, loadEvents$, loadRootNode$ }) =>
  createStore('controlsAndObservations', reducer$(actions$) as TODO, { data: [] });

export default store$();
