import find from 'lodash/find';
import Config from '../config';
import entries from 'object.entries';

/**
 * Encapsulates the responsibilities for the Actor model
 */
class MusitActor {
  /**
   * Returns an object with the names of doneBy and registeredBy, or undefined for one or both if not found.
   *
   * @param actorsJson an array of actors.
   * @param doneById
   * @param registeredById
   * @returns {{doneBy: string|undefined, registeredBy: string|undefined}}
   */
  static getActorNames(actorsJson, doneById, registeredById) {
    const actors = [].concat(actorsJson).map(actor => new MusitActor(actor));
    const doneBy = find(actors, (a) => a.hasActorId(doneById));
    const registeredBy = find(actors, (a) => a.hasActorId(registeredById));
    return { doneBy: doneBy && doneBy.fn, registeredBy: registeredBy && registeredBy.fn };
  }

  /**
   * @param props the actor as received from endpoint currentUser.
   */
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }

  /**
   * We prefer dataportenId. applicationId is only for old migrated users.
   *
   * @returns {string|undefined}
   */
  getActorId() {
    return this.dataportenId || this.applicationId;
  }

  hasActorId(actorId) {
    if (!actorId) {
      return false;
    }

    const isDataportenId = this.dataportenId && this.dataportenId === actorId;
    const isApplicationId = this.applicationId === actorId;

    return isDataportenId || isApplicationId;
  }
}

MusitActor.getActorDetails = (ajaxPost) => (actorIds, token, callback) => {
  return ajaxPost(`${Config.magasin.urls.actor.baseUrl}/details`, actorIds, token, callback)
    .map(actors => {
      if (!actors) {
        return undefined;
      }
      return actors.map(a => new MusitActor(a));
    });
};

export default MusitActor;