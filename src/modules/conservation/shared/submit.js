//@flow
import type { History } from '../../../types/Routes';
import type { AppSession } from '../../../types/appSession';
import type { FormData } from '../shared/formType';
import type { ConservationSave, ObjectInfo } from '../../../types/conservation';
import type { ObjectData } from '../../../types/object';
import type { Observable } from 'rxjs';
import toArray from 'lodash/toArray';

export type Location<T> = {
  state?: T
};

export function getObjects(
  objects: any, //Array<ObjectData>,
  location: any // Location<Array<ObjectData>>
) {
  if (objects && objects.length > 0) {
    return objects;
  } else {
    return location.state;
  }
}

export function getConservationCollection(
  form: FormData,
  location: Location<Array<ObjectData>>
) {
  let affectedThings = toArray(form.affectedThings.value);
  const persons = toArray(form.persons.value);
  const doneBy = findPerson(persons, 'doneBy');
  const responsible = findPerson(persons, 'responsible');
  const administrator = findPerson(persons, 'administrator');
  const completedBy = findPerson(persons, 'completedBy');
  if (affectedThings.length === 0) {
    affectedThings = location.state;
  }
  return {
    eventTypeId: form.eventTypeId.value || 1,
    doneBy: doneBy && doneBy.uuid,
    doneDate: doneBy && doneBy.date,
    note: form.note.value,
    events: form.events.value,
    responsible: responsible && responsible.uuid,
    administrator: administrator && administrator.uuid,
    completedBy: completedBy && completedBy.uuid,
    completedDate: completedBy && completedBy.date,
    objects: getObjectsWithType(getObjects(affectedThings, location)),
    affectedThings: affectedThings ? affectedThings.map(o => o.uuid) : [],
    caseNumber: form.caseNumber.value
  };
}

function findPerson(persons, role) {
  return persons.find(p => p.role === role);
}

type ObjectWithUuidAndType = { objectId: ?string, objectType: ?string };

export function getObjectsWithType(
  objects: Array<ObjectData>
): Array<ObjectWithUuidAndType> {
  if (!objects) {
    return [];
  }
  return objects.map((obj: ObjectData) => ({
    objectId: obj.uuid,
    objectType: obj.objectType || null
  }));
}
