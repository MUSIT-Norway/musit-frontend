import { Observable, Subject } from 'rxjs';
import MusitObject from '../../models/object';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import MusitActor from '../../models/actor';
import { uniq } from 'lodash';
import { I18n } from 'react-i18nify';
import { AjaxPost, AjaxGet } from '../../types/ajax';
import { TODO } from '../../types/common';

export const clear$ = new Subject();

export const getLocationHistory = (get?: AjaxGet<TODO>, post?: AjaxPost<TODO>) => (
  val: TODO
) =>
  MusitObject.getLocationHistory(get /*, post */)(val).flatMap((rows: TODO) => {
    const actorIds = uniq(rows.map((r: TODO) => r.doneBy)).filter(r => r);
    return MusitActor.getActors(post as TODO)({ actorIds, token: val.token } as TODO).map(
      (actors: TODO) => {
        if (!Array.isArray(actors)) {
          return rows;
        }
        return rows.map((data: TODO) => {
          const doneBy = actors.find(a => MusitActor.hasActorId(a, data.doneBy));
          return {
            ...data,
            doneBy: doneBy ? doneBy.fn : I18n.t('musit.unknown')
          };
        });
      }
    );
  });

export const loadMoveHistory$ = createAction('loadMoveHistory$').switchMap(
  getLocationHistory()
);

export const initialState = { data: [] };

export const reducer$ = (actions: TODO) =>
  Observable.empty().merge(
    actions.clear$.map(() => () => initialState),
    actions.loadMoveHistory$.map((data: TODO) => (state: TODO) => ({ ...state, data }))
  );

export const store$ = (actions$ = { clear$, loadMoveHistory$ }) =>
  createStore('moveHistory', reducer$(actions$) as TODO, initialState);

export default store$();
