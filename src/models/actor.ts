// @flow
import { find } from 'lodash';
import Config from '../config';
import { simpleGet, simplePost } from '../shared/RxAjax';
import { Observable } from 'rxjs';
import { Callback, AjaxGet, AjaxPost } from '../types/ajax';
import { Actor } from '../types/actor';
import { Restriction } from '../types/analysis';
import { Maybe, Star, MUSTFIX } from '../types/common';

type ActorMetaData = {
  doneBy?: Maybe<string>;
  registeredBy?: Maybe<string>;
  registeredByName?: Maybe<string>;
  completedBy?: Maybe<string>;
  administrator?: Maybe<string>;
  updatedBy?: Maybe<string>;
  updatedByName?: Maybe<string>;
  restriction?: Restriction;
};

type ActorFieldName =
  | 'updatedBy'
  | 'updatedByName'
  | 'registeredBy'
  | 'registeredByName'
  | 'doneByName'
  | 'responsible'
  | 'responsibleName'
  | 'administrator'
  | 'administratorName'
  | 'participating'
  | 'participatingName'
  | 'completedBy'
  | 'completedByName'
  | 'doneBy'
  | 'restriction_requesterName'
  | 'restriction_cancelledByName';

type ActorField = {
  id: string;
  fieldName: ActorFieldName;
};

class MusitActor {
  static getActorId: (actor: Actor) => Maybe<string>;
  static hasActorId: (actor: Actor, actorId: Maybe<string>) => boolean;
  static getActorNames: (
    actors: Array<Actor>,
    doneById: Maybe<string>,
    registeredBy: Maybe<string>
  ) => ActorMetaData;
  static getMultipleActorNames: (
    actors: Array<Actor>,
    fields: Array<ActorField>
  ) => ActorMetaData;
  static getActors: (
    ajaxPost: AjaxPost<Star>
  ) => (
    props: {
      actorIds: Array<string>;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Array<Actor>>;
  static getActor: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: { actorId: string; token: string; callback?: Callback<Star> }
  ) => Observable<Actor>;
}

/**
 * We prefer dataportenId. applicationId is only for old migrated users.
 *
 * @returns {string|undefined}
 */
MusitActor.getActorId = (actor: Actor) => actor.dataportenId || actor.applicationId;

MusitActor.hasActorId = (actor: Actor, actorId: Maybe<string>) => {
  if (!actorId) {
    return false;
  }

  const isDataportenId = actor.dataportenId && actor.dataportenId === actorId;
  const isApplicationId = actor.applicationId === actorId;

  return isDataportenId || isApplicationId;
};

/**
 * Returns an object with the names of doneBy and registeredBy, or undefined for one or both if not found.
 *
 * @param actorsJson an array of actors.
 * @param doneById
 * @param registeredById
 * @returns {{doneBy: string|undefined, registeredBy: string|undefined}}
 */
MusitActor.getActorNames = (
  actorsJson: Array<Actor>,
  doneById: Maybe<string>,
  registeredById: Maybe<string>
) => {
  const actors = ([] as Array<Actor>).concat(actorsJson);
  const doneBy = find(actors, a => MusitActor.hasActorId(a, doneById));
  const registeredBy = find(actors, a => MusitActor.hasActorId(a, registeredById));
  return { doneBy: doneBy && doneBy.fn, registeredBy: registeredBy && registeredBy.fn };
};

MusitActor.getMultipleActorNames = (
  actorsJson: Array<Actor>,
  actorFields: Array<ActorField>
) => {
  const actors = ([] as Array<Actor>).concat(actorsJson);
  return actorFields.reduce((acc, next: { id: string; fieldName: ActorFieldName }) => {
    const actor = find(actors, a => MusitActor.hasActorId(a, next.id));
    if (!actor) {
      return acc;
    }
    if (next.fieldName === 'restriction_requesterName') {
      return {
        ...acc,
        restriction: { ...(acc as MUSTFIX).restriction, requesterName: actor.fn }
      };
    }
    if (next.fieldName === 'restriction_cancelledByName') {
      return {
        ...acc,
        restriction: { ...(acc as MUSTFIX).restriction, cancelledByName: actor.fn }
      };
    }
    return { ...acc, [next.fieldName]: actor.fn };
  }, {});
};

MusitActor.getActors = (ajaxPost = simplePost) => ({ actorIds, token, callback }) =>
  ajaxPost(
    `${Config.magasin.urls.api.actor.baseUrl}/details`,
    actorIds,
    token,
    callback
  ).map(({ response }) => response);

MusitActor.getActor = (ajaxGet = simpleGet) => ({ actorId, token, callback }) =>
  ajaxGet(`${Config.magasin.urls.api.actor.baseUrl}/${actorId}`, token, callback).map(
    ({ response }) => response
  );

export default MusitActor;
