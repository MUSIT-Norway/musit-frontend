import { Observable } from 'rxjs';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import Control from '../../models/control';
import Observation from '../../models/observation';
import MusitActor from '../../models/actor';
import MusitNode from '../../models/node';
import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import concat from 'lodash/concat';

export const clearEvents$ = createAction('clearEvents$');
export const loadEvents$ = createAction('loadEvents$');
export const loadRootNode$ = createAction('loadRootNode$').switchMap((cmd) =>
  MusitNode.getNode(cmd.nodeId, cmd.museumId, cmd.token, cmd)
);

const reducer$ = (actions) => Observable.merge(
  actions.clearEvents$.map(() => (state) => ({...state, data: []})),
  actions.loadRootNode$.map((rootNode) => (state) => ({...state, rootNode})),
  actions.loadEvents$.switchMap((props) => {
    return Observable.forkJoin(Control.loadControls(props), Observation.loadObservations(props))
      .flatMap(([controls, observations]) => {
        const events = orderBy(concat(controls, observations), ['doneDate', 'id'], ['desc', 'desc']);
        const actorIds = uniq(flatten(events.map(r => [r.doneBy, r.registeredBy]))).filter(p => p);
        return MusitActor.getActorDetails(actorIds, props.token)
          .map((actors) => {
            if (!actors) {
              return events;
            }
            return events.map((data) => ({
              ...data,
              ...MusitActor.getActorNames(actors, data.doneBy, data.registeredBy)
            }));
          });
      });
  }).map((data) => (state) => ({...state, data})),
);

const store$ = createStore('events', reducer$({clearEvents$, loadEvents$, loadRootNode$}), Observable.of({ data: [] }));

export default store$;