//@flow
import { ObjectData } from '../../../types/object';
import { Person } from '../../../types/person';
import { toArray, uniq } from 'lodash';
//import { parse } from "path";
//import type { isUndefined } from 'util';
import { FormData } from '../../../types/conservation';
import { Maybe, TODO, MUSTFIX } from '../../../types/common';

export type Location<T> = {
  state?: T;
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
  let affectedThings: TODO = toArray(form.affectedThings.value);
  if (affectedThings.length === 0) {
    affectedThings = location.state;
  }
  return {
    eventTypeId: form.eventTypeId.value || 1,
    note: form.note.value,
    events: (form.events && form.events.value ? form.events.value : []).map(v => ({
      ...v,
      measurementData: v.measurementData
        ? {
            /*TODO: Vi er usikre på om det faktisk er tall eller strenger i denne datastrukturen på dette tidspunktet*/
            ...v.measurementData,
            weight: v.measurementData.weight
              ? parseFloat(v.measurementData.weight as MUSTFIX)
              : undefined,
            length:
              v.measurementData && v.measurementData.length
                ? parseFloat(v.measurementData.length as MUSTFIX)
                : undefined,
            width:
              v.measurementData && v.measurementData.width
                ? parseFloat(v.measurementData.width as MUSTFIX)
                : undefined,
            thickness:
              v.measurementData && v.measurementData.thickness
                ? parseFloat(v.measurementData.thickness as MUSTFIX)
                : undefined,
            height:
              v.measurementData && v.measurementData.height
                ? parseFloat(v.measurementData.height as MUSTFIX)
                : undefined,
            largestLength:
              v.measurementData && v.measurementData.largestLength
                ? parseFloat(v.measurementData.largestLength as MUSTFIX)
                : undefined,
            largestWidth:
              v.measurementData && v.measurementData.largestWidth
                ? parseFloat(v.measurementData.largestWidth as MUSTFIX)
                : undefined,
            largestThickness:
              v.measurementData && v.measurementData.largestThickness
                ? parseFloat(v.measurementData.largestThickness as MUSTFIX)
                : undefined,
            largestHeight:
              v.measurementData && v.measurementData.largestHeight
                ? parseFloat(v.measurementData.largestHeight as MUSTFIX)
                : undefined,
            diameter:
              v.measurementData && v.measurementData.diameter
                ? parseFloat(v.measurementData.diameter as MUSTFIX)
                : undefined,
            tverrmaal:
              v.measurementData && v.measurementData.tverrmaal
                ? parseFloat(v.measurementData.tverrmaal as MUSTFIX)
                : undefined,
            largestMeasurement:
              v.measurementData && v.measurementData.largestMeasurement
                ? parseFloat(v.measurementData.largestMeasurement as MUSTFIX)
                : undefined,
            quantity:
              v.measurementData && v.measurementData.quantity
                ? parseInt(v.measurementData.quantity as MUSTFIX)
                : undefined,
            quantitySymbol:
              v.measurementData && isNaN(parseInt(v.measurementData.quantity as MUSTFIX))
                ? ''
                : v.measurementData && v.measurementData.quantitySymbol,
            fragmentQuantity:
              v.measurementData && v.measurementData.fragmentQuantity
                ? parseInt(v.measurementData.fragmentQuantity as MUSTFIX)
                : undefined
          }
        : undefined,
      actorsAndRoles: (v.actorsAndRoles || []).map(a => ({
        actorId: a.uuid,
        roleId: a.role,
        date: a.date
      }))
    })),
    actorsAndRoles:
      form.actorsAndRoles && form.actorsAndRoles.value
        ? form.actorsAndRoles.value.map((v: Person) => ({
            actorId: v.uuid,
            roleId: v.role,
            date: v.date
          }))
        : [],
    objects: getObjectsWithType(getObjects(affectedThings, location)),
    affectedThings: affectedThings ? uniq(affectedThings.map((o: TODO) => o.uuid)) : [],
    caseNumber: form.caseNumber.value,
    isUpdated: form.isUpdated.value
  };
}

type ObjectWithUuidAndType = { objectId: Maybe<string>; objectType: Maybe<string> };

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
