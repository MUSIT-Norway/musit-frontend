// @flow
import  {
  ExtraResultAttributeValues,
  Size,
  AnalysisEvent
} from '../../../types/analysis';
import {toArray, omit, keys} from 'lodash';
import  { FormData } from './formType';
import  { Restriction } from '../../../types/analysis';
import { Maybe, mixed, TODO } from '../../../types/common';
import { Person } from '../../../types/person';

type ObjectWithUuidAndType = { objectId: Maybe<string>, objectType: Maybe<string> };

export type Location<T> = {
  state?: T
};

function getRestrictions(form: FormData): Maybe<Restriction> {
  return form.restrictions.value ? form.restriction.value : null;
}

export function getResult(
  form: FormData,
  extraResultAttributes: Maybe<ExtraResultAttributeValues>
) {
  const extraAttributeType =
    extraResultAttributes && extraResultAttributes.type
      ? extraResultAttributes.type.toString()
      : 'GenericResult';
  const extraAttributes = keys(extraResultAttributes).reduce((acc, att) => {
    let value = extraResultAttributes && extraResultAttributes[att];
    if (value && typeof value !== 'string' && value.type === 'Size') {
      const size: Size = (value.value as any);
      value = omit(size, ['rawValue']) as TODO;
    }
    if (value && typeof value !== 'string' && value.type === 'String') {
      value = (value.value as any);
    }
    if (keys(value).length === 0) {
      return acc;
    }
    return {
      ...acc,
      [att]: value
    };
  }, {});
  return {
    extRef: toArray(form.externalSource.value),
    files: form.resultFiles.value,
    attachments: form.result.defaultValue && form.result.defaultValue.attachments,
    comment: form.comments.value,
    ...extraAttributes,
    type: extraAttributeType
  };
}

export function getAnalysisCollection(
  form: FormData,
  extraDescriptionAttributes: Maybe<mixed>,
  location: Location<Array<AnalysisEvent>>
) {
  const events = toArray(form.events.value);
  const persons = toArray(form.persons.value);
  const doneBy = findPerson(persons, 'doneBy');
  const responsible = findPerson(persons, 'responsible');
  const administrator = findPerson(persons, 'administrator');
  const completedBy = findPerson(persons, 'completedBy');
  return {
    analysisTypeId: form.analysisTypeId.value,
    doneBy: doneBy && doneBy.uuid,
    doneDate: doneBy && doneBy.date,
    note: form.note.value,
    responsible: responsible && responsible.uuid,
    administrator: administrator && administrator.uuid,
    completedBy: completedBy && completedBy.uuid,
    completedDate: completedBy && completedBy.date,
    orgId: form.orgId.value,
    objects: getObjectsWithType(getObjects(events, location)),
    restriction: getRestrictions(form),
    extraAttributes: extraDescriptionAttributes,
    caseNumbers: form.caseNumbers.value,
    status: form.status.value,
    reason: form.reason.value,
    type: 'AnalysisCollection'
  };
}

function findPerson(persons: Array<Person>, role: TODO) {
  return persons.find(p => p.role === role);
}

export function getObjects(
  formEvents: Array<AnalysisEvent>,
  location: Location<Array<AnalysisEvent>>
): Array<AnalysisEvent> {
  return formEvents.length > 0 ? formEvents : location.state || [];
}

export function getObjectsWithType(
  objects: Array<AnalysisEvent>
): Array<ObjectWithUuidAndType> {
  if (!objects) {
    return [];
  }
  return objects.map((obj: AnalysisEvent) => ({
    objectId: obj.sampleData
      ? obj.sampleData.objectId
      : obj.objectData && obj.objectData.uuid,
    objectType:
      obj.sampleData && obj.sampleData.sampleNum
        ? 'sample'
        : obj.objectData ? obj.objectData.objectType : null
  }));
}
