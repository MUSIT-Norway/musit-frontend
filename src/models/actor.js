// @flow
import find from 'lodash/find';
import Config from '../config';
import { simpleGet, simplePost } from '../shared/RxAjax';
import { Observable } from 'rxjs';
import type { Callback, AjaxGet, AjaxPost } from './types/ajax';

type Actor = {
  fn: string,
  dataportenId?: string,
  applicationId?: string
};

type ActorMetaData = {
  doneBy?: ?string,
  registeredBy?: ?string,
  registeredByName?: ?string,
  updatedBy?: ?string,
  updatedByName?: ?string
};

type ActorFieldName =
  | 'updatedBy'
  | 'updatedByName'
  | 'registeredBy'
  | 'registeredByName'
  | 'doneBy';

type ActorField = {
  id: string,
  fieldName: ActorFieldName
};

class MusitActor {
  static getActorId: (actor: Actor) => ?string;
  static hasActorId: (actor: Actor, actorId: ?string) => boolean;
  static getActorNames: (
    actors: Array<Actor>,
    doneById: ?string,
    registeredBy: ?string
  ) => ActorMetaData;
  static getMultipleActorNames: (
    actors: Array<Actor>,
    fields: Array<ActorField>
  ) => ActorMetaData;
  static getActors: (
    ajaxPost: AjaxPost
  ) => (props: {
    actorIds: Array<string>,
    token: string,
    callback?: Callback
  }) => Observable<Array<Actor>>;
  static getActor: (
    ajaxGet: AjaxGet
  ) => (props: { actorId: string, token: string, callback?: Callback }) => Observable;
}

/**
 * We prefer dataportenId. applicationId is only for old migrated users.
 *
 * @returns {string|undefined}
 */
MusitActor.getActorId = (actor: Actor) => actor.dataportenId || actor.applicationId;

MusitActor.hasActorId = (actor: Actor, actorId: ?string) => {
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
  doneById: ?string,
  registeredById: ?string
) => {
  const actors = [].concat(actorsJson);
  const doneBy = find(actors, a => MusitActor.hasActorId(a, doneById));
  const registeredBy = find(actors, a => MusitActor.hasActorId(a, registeredById));
  return { doneBy: doneBy && doneBy.fn, registeredBy: registeredBy && registeredBy.fn };
};

MusitActor.getMultipleActorNames = (
  actorsJson: Array<Actor>,
  actorFields: Array<ActorField>
) => {
  const actors = [].concat(actorsJson);
  return actorFields.reduce((acc, next: { id: string, fieldName: ActorFieldName }) => {
    const actor = find(actors, a => MusitActor.hasActorId(a, next.id));
    if (!actor) {
      return acc;
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
