// @flow
import { Field } from '../../../forms/form';
import { Person } from '../../../types/person';
import { AnalysisEvent, Result } from '../../../types/analysis';
import { Restriction } from '../../../types/analysis';

export type FormData = {
  id: Field<number>;
  analysisTypeId: Field<number>;
  analysisTypeCategory: Field<string>;
  doneBy: Field<string>;
  doneDate: Field<string>;
  registeredBy: Field<string>;
  registeredByName: Field<string>;
  registeredDate: Field<string>;
  responsible: Field<string>;
  administrator: Field<string>;
  persons: Field<Array<Person>>;
  completedBy: Field<string>;
  completedDate: Field<string>;
  objectId: Field<string>;
  note: Field<string>;
  type: Field<string>;
  partOf: Field<string>;
  result: Field<Result>;
  orgId: Field<number>; //place for analysis
  externalSource: Field<string>;
  comments: Field<string>;
  reason: Field<string>;
  caseNumbers: Field<Array<string>>;
  resultFiles: Field<Array<File>>;
  completeAnalysis: Field<string>;
  // restriction
  restrictions: Field<boolean>;
  restriction: Field<Restriction>;
  // object details
  museumNo: Field<string>;
  subNo: Field<string>;
  term: Field<string>;
  eventDate: Field<string>;
  actor: Field<string>;
  events: Field<Array<AnalysisEvent>>;
  updatedBy: Field<string>;
  updatedByName: Field<string>;
  updatedDate: Field<string>;
  status: Field<number>;
};
