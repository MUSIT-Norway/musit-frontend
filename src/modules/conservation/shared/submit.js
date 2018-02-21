//@flow
import type { ObjectData } from "../../../types/object";
import type { Person } from "../../../types/person";
import toArray from "lodash/toArray";
//import { parse } from "path";
//import type { isUndefined } from 'util';
import type { FormData } from "../../../types/conservation";

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
  if (affectedThings.length === 0) {
    affectedThings = location.state;
  }
  return {
    eventTypeId: form.eventTypeId.value || 1,
    note: form.note.value,
    events: (form.events && form.events.value
      ? form.events.value
      : []).map(v => ({
      ...v,
      measurementData: v.measurementData
        ? {
            ...v.measurementData,
            weight: v.measurementData.weight
              ? parseFloat(v.measurementData.weight)
              : undefined,
            length: v.measurementData && v.measurementData.length
              ? parseFloat(v.measurementData.length)
              : undefined,
            width: v.measurementData && v.measurementData.width
              ? parseFloat(v.measurementData.width)
              : undefined,
            thickness: v.measurementData && v.measurementData.thickness
              ? parseFloat(v.measurementData.thickness)
              : undefined,
            largestLength: v.measurementData && v.measurementData.largestLength
              ? parseFloat(v.measurementData.largestLength)
              : undefined,
            largestWidth: v.measurementData && v.measurementData.largestWidth
              ? parseFloat(v.measurementData.largestWidth)
              : undefined,
            largestThickness: v.measurementData && v.measurementData.largestThickness
              ? parseFloat(v.measurementData.largestThickness)
              : undefined,
            largestHeight: v.measurementData && v.measurementData.largestHeight
              ? parseFloat(v.measurementData.largestHeight)
              : undefined,
            diameter: v.measurementData && v.measurementData.diameter
              ? parseFloat(v.measurementData.diameter)
              : undefined,
            tverrmaal: v.measurementData && v.measurementData.tverrmaal
              ? parseFloat(v.measurementData.tverrmaal)
              : undefined,
            largestMeasurement: v.measurementData && v.measurementData.largestMeasurement
              ? parseFloat(v.measurementData.largestMeasurement)
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
    affectedThings: affectedThings ? affectedThings.map(o => o.uuid) : [],
    caseNumber: form.caseNumber.value,
    isUpdated: form.isUpdated.value
  };
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
