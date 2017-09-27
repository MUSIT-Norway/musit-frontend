// @flow

import type { MusitObject } from '../types/object';
import type { SampleDataExtended } from '../types/samples';

export type AffectedThing = {
  id: number,
  affectedThing: string,
  affectedType: 'collection' | 'sample',
  analysisTypeId: number,
  doneBy: string,
  doneDate: string,
  note?: ?string,
  partOf: number,
  registeredBy: string,
  registeredDate: string,
  responsible: string
};

export type ObjectInfo = { objectData?: ?MusitObject, sampleData?: ?SampleDataExtended };

// Fixme this type is incorrect/incomplete
export type ConservationCollection = {
  id: number,
  analysisTypeId: number,
  objectId?: ?string,
  doneBy?: ?string,
  doneDate?: ?string,
  doneByName?: ?string,
  registeredBy?: ?string,
  registeredDate?: ?string,
  responsible?: ?string,
  responsibleName?: string,
  administrator?: ?string,
  administratorName?: ?string,
  updatedBy?: ?string,
  updatedDate?: ?string,
  completedBy?: ?string,
  completedByName?: ?string,
  completedDate?: ?string,
  note?: ?string,
  extraAttributes?: { type: string, [string]: string | number },
  affectedThings?: ?Array<ObjectInfo>,
  reason?: ?string,
  status?: ?number,
  caseNumbers?: ?Array<string>,
  orgId?: ?number,
  events?: ?Array<any>
};
