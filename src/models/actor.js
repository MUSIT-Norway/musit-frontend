import find from 'lodash/find';

/**
 * Encapsulates the responsibilities for the Actor model
 */
class Actor {
  /**
   * Returns an object with the names of doneBy and registeredBy, or undefined for one or both if not found.
   *
   * @param actorsJson an array of actors.
   * @param doneById
   * @param registeredById
   * @returns {{doneBy: string|undefined, registeredBy: string|undefined}}
   */
  static getActorNames(actorsJson, doneById, registeredById) {
    const actors = [].concat(actorsJson).map(actor => new Actor(actor));
    const doneBy = find(actors, (a) => a.hasActorId(doneById));
    const registeredBy = find(actors, (a) => a.hasActorId(registeredById));
    return { doneBy: doneBy && doneBy.fn, registeredBy: registeredBy && registeredBy.fn };
  }

  /**
   * @param props the actor as received from endpoint currentUser.
   */
  constructor(props) {
    this.dataportenId = props.dataportenId;
    this.dataportenUser = props.dataportenUser;
    this.applicationId = props.applicationId;
    this.fn = props.fn;
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
    const isDataportenId = this.dataportenId && this.dataportenId === actorId;
    const isApplicationId = this.applicationId === actorId;

    return isDataportenId || isApplicationId;
  }
}

export default Actor;