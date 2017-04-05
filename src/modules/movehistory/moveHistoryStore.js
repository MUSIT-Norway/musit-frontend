import { Observable, Subject } from 'rxjs';
import MusitObject from '../../models/object';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import MusitActor from '../../models/actor';
import uniq from 'lodash/uniq';
import { I18n } from 'react-i18nify';

export const clear$ = new Subject();

export const getLocationHistory = (get, post) =>
  val =>
    MusitObject.getLocationHistory(get, post)(val).flatMap(rows => {
      const actorIds = uniq(rows.map(r => r.doneBy)).filter(r => r);
      return MusitActor.getActors(post)(actorIds, val.token).map(actors => {
        if (!Array.isArray(actors)) {
          return rows;
        }
        return rows.map(data => {
          const doneBy = actors.find(a => a.hasActorId(data.doneBy));
          return {
            ...data,
            doneBy: doneBy ? doneBy.fn : I18n.t('musit.unknown')
          };
        });
      });
    });

export const loadMoveHistory$ = createAction('loadMoveHistory$').switchMap(
  getLocationHistory()
);

export const initialState = { data: [] };

export const reducer$ = actions =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadMoveHistory$.map(data => state => ({ ...state, data }))
  );

export const store$ = (actions$ = { clear$, loadMoveHistory$ }) =>
  createStore('moveHistory', reducer$(actions$), Observable.of(initialState));

export default store$();
