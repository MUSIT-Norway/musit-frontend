// @flow
import type { MusitObject } from '../types/object';
import type { SampleDataExtended } from '../types/samples';
import type { AnalysisResultTypes } from 'types/analysisResult';

export const isMultipleSelectAttribute = (attributeType: string) =>
  /^Array\[.*]$/.test(attributeType);

export type Size = { value: number, unit: string, rawValue?: ?string };

export type ExtraResultAttribute =
  | string
  | {
      type: ?string,
      value: ?string | ?number | ?Size
    };

export type ExtraResultAttributeValues = {
  [string]: ?ExtraResultAttribute
};

export type ExtraAttribute = {
  attributeKey: string,
  attributeType: string,
  allowedValues?: ?Array<any>
};

export type AnalysisType = {
  id: number,
  noName: string,
  enName: string,
  category: string,
  name: string,
  extraDescriptionAttributes?: Array<ExtraAttribute>,
  extraDescriptionType?: string,
  extraResultType?: AnalysisResultTypes,
  extraResultAttributes?: { [string]: string }
};

export type AnalysisTypes = AnalysisType[];

export type AnalysisTypesObject = {
  analysisTypes: AnalysisTypes,
  analysisTypeCategories: []
};

export type Restriction = {
  requester?: ?string,
  expirationDate?: ?string,
  reason?: ?string,
  caseNumbers?: ?Array<string>,
  registeredStamp?: ?{ user: string, date: string },
  cancelledStamp?: ?{ user: string, date: string },
  cancelledReason?: ?string
} & {
  requesterName?: ?string,
  cancelledBy?: ?string,
  cancelledByName?: ?string,
  cancelledDate?: ?string
};

export type Result = {
  type: ?string,
  extRef?: ?Array<string>,
  comment?: ?string,
  [string]: string | number | { value: number, unit: string }
};

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
  type: 'Analysis' | 'AnalysisCollection'
};

export type ObjectInfo = { objectData?: ?MusitObject, sampleData?: ?SampleDataExtended };
export type AnalysisEvent = AffectedThing &
  ObjectInfo & {
    result?: {
      [string]: string | { value?: string | Array<string> },
      extRef?: Array<string>,
      comment?: string
    },
    expanded?: boolean
  };

// Fixme this type is incorrect/incomplete
export type AnalysisCollection = {
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
  extraAttributes?: { type: string },
  result?: ?Result,
  events: ?Array<AnalysisEvent>,
  restriction?: ?Restriction,
  reason?: ?string,
  status?: ?number,
  caseNumbers?: ?Array<string>,
  orgId?: ?number
};
