/* @flow */

export type AnalysisType = { id: number, name: string };

export type Analysis = {
  id: number,
  analysisTypeId: string,
  doneBy: string,
  doneDate: string,
  registeredBy: string,
  registeredByName: string,
  registeredDate: string,

  responsible: string,

  administrator: string,
  completedBy: string,
  completedDate: string,
  objectId: string,
  note: string,
  type: string,

  partOf: string,
  result: string,
  place: string,

  externalSource: string,
  comments: string,

  restrictions: string,
  by: string,
  expirationDate: string,
  reason: string,
  caseNumbers: string,
  cancelledBy: string,
  cancelledReason: string,

  completeAnalysis: string,
  museumNo: string,
  subNo: string,
  term: string,

  eventDate: string,

  actor: string,
  caseNumber: string,
  events: []
};