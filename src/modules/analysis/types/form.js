/* @flow */

export type Field = { name: string, rawValue: ?string };

export type ArrayField = { name: string, rawValue: ?Array<*> };

export type Update = (update: Field) => void;

export type FormData = {
  id: Field,
  analysisTypeId: Field,
  doneBy: Field,
  doneDate: Field,
  registeredBy: Field,
  registeredByName: Field,
  registeredDate: Field,
  responsible: Field,
  administrator: Field,
  completedBy: Field,
  completedDate: Field,
  objectId: Field,
  note: Field,
  type: Field,
  partOf: Field,
  result: Field,
  place: Field,
  externalSource: Field,
  comments: Field,
  restrictions: Field,
  by: Field,
  expirationDate: Field,
  reason: Field,
  caseNumbers: Field,
  cancelledBy: Field,
  cancelledReason: Field,
  completeAnalysis: Field,
  museumNo: Field,
  subNo: Field,
  term: Field,
  eventDate: Field,
  actor: Field,
  caseNumber: Field,
  events: ArrayField
};
