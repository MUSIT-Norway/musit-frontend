import { Observable, Subject } from 'rxjs';
import MusitObject from '../../models/object';
import MusitActor from '../../models/actor';
import uniq from 'lodash/uniq';
import { I18n } from 'react-i18nify';
import { createStore } from 'react-rxjs/dist/RxStore';
import { simplePost } from '../../shared/RxAjax';

export const clear$ = new Subject();

export const loadMoveHistory$ = new Subject().switchMap(cmd =>
  MusitObject.getLocationHistory(cmd.objectId, cmd.museumId, cmd.token, cmd)
    .flatMap(rows => {
      const actorIds = uniq(rows.map(r => r.doneBy)).filter(r => r);
      return MusitActor.getActorDetails(simplePost)(actorIds, cmd.token)
        .map(actors => {
          if (!Array.isArray(actors)) {
            return rows;
          }
          return rows.map((data) => {
            const doneBy = actors.find(a => a.hasActorId(data.doneBy));
            return {
              ...data,
              doneBy: doneBy ? doneBy.fn : I18n.t('musit.unknown')
            };
          });
        });
    })
);

const initialState = { data: [] };

export const reducer$ = (actions) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadMoveHistory$.map((data) => (state) => ({...state, data, error: null}))
  );

export default createStore('moveHistory', reducer$({clear$, loadMoveHistory$}), Observable.of(initialState));
