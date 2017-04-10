import find from 'lodash/find';
import Config from '../config';
import { simpleGet, simplePost } from '../shared/RxAjax';

class MusitActor {}

type Actor = {
  dataportenId?: string,
  applicationId?: string
};

/**
 * We prefer dataportenId. applicationId is only for old migrated users.
 *
 * @returns {string|undefined}
 */
MusitActor.getActorId = (actor: Actor) => actor.dataportenId || actor.applicationId;

MusitActor.hasActorId = (actor, actorId) => {
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
MusitActor.getActorNames = (actorsJson, doneById, registeredById) => {
  const actors = [].concat(actorsJson);
  const doneBy = find(actors, a => MusitActor.hasActorId(a, doneById));
  const registeredBy = find(actors, a => MusitActor.hasActorId(a, registeredById));
  return { doneBy: doneBy && doneBy.fn, registeredBy: registeredBy && registeredBy.fn };
};

MusitActor.getActors = (ajaxPost = simplePost) =>
  (actorIds, token, callback) =>
    ajaxPost(
      `${Config.magasin.urls.api.actor.baseUrl}/details`,
      actorIds,
      token,
      callback
    ).map(({ response }) => response);

MusitActor.getActor = (ajaxGet = simpleGet) =>
  ({ actorId, token, callback }) =>
    ajaxGet(`${Config.magasin.urls.api.actor.baseUrl}/${actorId}`, token, callback).map(
      ({ response }) => response
    );

export default MusitActor;
