// @flow
import type { Field } from '../../../forms/form';
import type { Person } from '../../../components/person/PersonRoleDate';
import type { ObjectData } from '../../../types/object';
import type { SampleData } from '../../../types/samples';

export type FormData = {
  id: Field<number>,
  analysisTypeId: Field<number>,
  analysisTypeCategory: Field<string>,
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
  objectId: Field<string>,
  note: Field<string>,
  type: Field<string>,
  partOf: Field<string>,
  result: Field<string>,
  orgId: Field<number>, //place for analysis
  externalSource: Field<string>,
  comments: Field<string>,
  reason: Field<string>,
  caseNumbers: Field<Array<string>>,
  completeAnalysis: Field<string>,
  // restriction
  restrictions: Field<boolean>,
  restrictions_requester: Field<string>,
  restrictions_requesterName: Field<string>,
  restrictions_expirationDate: Field<string>,
  restrictions_reason: Field<string>,
  restrictions_caseNumbers: Field<Array<string>>,
  restrictions_cancelledReason: Field<string>,
  // object details
  museumNo: Field<string>,
  subNo: Field<string>,
  term: Field<string>,
  eventDate: Field<string>,
  actor: Field<string>,
  events: Field<Array<ObjectData & SampleData>>,
  updatedBy: Field<string>,
  updatedByName: Field<string>,
  updatedDate: Field<string>,
  status: Field<number>
};
