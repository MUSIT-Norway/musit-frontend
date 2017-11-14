// @flow
import type { Field } from '../../../forms/form';
import type { Person } from '../../../types/person';
import type { ObjectInfo, ConservationSubTypes } from '../../../types/conservation';

export type FormData = {
  id: Field<number>,
  eventTypeId: Field<number>,
  doneBy: Field<string>,
  doneDate: Field<string>,
  registeredBy: Field<string>,
  registeredByName: Field<string>,
  registeredDate: Field<string>,
  responsible: Field<string>,
  administrator: Field<string>,
  persons: Field<Array<Person>>,
  completedBy: Field<string>,
  completedDate: Field<string>,
  note: Field<string>,
  caseNumber: Field<string>,
  updatedBy: Field<string>,
  updatedByName: Field<string>,
  updatedDate: Field<string>,
  affectedThings: Field<Array<string>>,
  objects: Field<Array<ObjectInfo>>,
  subEventTypes: Field<string>,
  events: Field<Array<ConservationSubTypes>>
};
