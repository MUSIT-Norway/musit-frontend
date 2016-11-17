import find from 'lodash/find';

export const getActorId = (actor) => {
  return actor.dataportenId || actor.applicationId;
};

export const getActorNames = (actors, doneById, registeredById) => {
  const doneBy = find(actors, (a) => a.dataportenId === doneById || a.applicationId === doneById);
  const registeredBy = find(actors, (a) => a.dataportenId === registeredById || a.applicationId === registeredById);
  return {
    doneBy: doneBy && doneBy.fn,
    registeredBy: registeredBy && registeredBy.fn
  };
};