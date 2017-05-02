/* @flow */

import type { Field } from '../../../forms/form';

export type ArrayField = { name: string, rawValue: ?Array<*> };

export type FormData = {
  id: Field<string>,
  analysisTypeId: Field<string>,
  doneBy: Field<string>,
  doneDate: Field<string>,
  registeredBy: Field<string>,
  registeredByName: Field<string>,
  registeredDate: Field<string>,
  responsible: Field<string>,
  administrator: Field<string>,
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
  restrictions: Field<boolean>,
  requester: Field<string>,
  expirationDate: Field<string>,
  reason: Field<string>,
  caseNumbers: Field<string>, //todo should be an a array
  cancelledBy: Field<string>,
  cancelledReason: Field<string>,
  completeAnalysis: Field<string>,
  museumNo: Field<string>,
  subNo: Field<string>,
  term: Field<string>,
  eventDate: Field<string>,
  actor: Field<string>,
  caseNumber: Field<string>,
  events: ArrayField
};
