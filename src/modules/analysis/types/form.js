import type { Field } from '../../../forms/form';
import type { Person } from '../../../components/person/PersonRoleDate';

export type FormData = {
  id: Field<number>,
  analysisTypeId: Field<string>,
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
  place: Field<string>,
  externalSource: Field<string>,
  comments: Field<string>,
  reason: Field<string>,
  caseNumbers: Field<Array<string>>,
  completeAnalysis: Field<string>,
  // restriction
  restrictions: Field<boolean>,
  restrictions_requester: Field<string>,
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
  events: Field<Array<*>>,
  updatedBy: Field<string>,
  updatedByName: Field<string>,
  updatedDate: Field<string>,
  status: Field<number>
};
