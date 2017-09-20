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
  responsible: string,
  type: 'Conservation' | 'ConservationCollection'
};

export type ObjectInfo = { objectData?: ?MusitObject, sampleData?: ?SampleDataExtended };

export type ConservationEvent = AffectedThing &
  ObjectInfo & {
    result?: {
      [string]: string | { value?: string | Array<string> },
      extRef?: Array<string>,
      comment?: string
    },
    expanded?: boolean
  };

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
  events: ?Array<ConservationEvent>,
  reason?: ?string,
  status?: ?number,
  caseNumbers?: ?Array<string>,
  orgId?: ?number
};
