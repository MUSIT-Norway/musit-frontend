// @flow
import { MusitObject } from './object';
import { SampleDataExtended } from './samples';
import { AnalysisResultTypes } from './analysisResult';
import { ErrorLoading, SavedFile } from '../models/analysis/analysisResult';
import { Maybe, Star, ArrayAny } from './common';

export const isMultipleSelectAttribute = (attributeType: string) =>
  /^Array\[.*]$/.test(attributeType);

export type Size = { value: number; unit: string; rawValue?: Maybe<string> };

export type ExtraResultAttribute =
  | string
  | {
      type: Maybe<string>;
      value: Maybe<string> | Maybe<number> | Maybe<Size>;
    };

export type ExtraResultAttributeValues = {
  [key: string]: Maybe<ExtraResultAttribute>;
};

export type ExtraAttribute = {
  attributeKey: string;
  attributeType: string;
  allowedValues?: Maybe<Array<Star>>;
};

export type AnalysisType = {
  id: number;
  noName: string;
  enName: string;
  category: string;
  name: string;
  extraDescriptionAttributes?: Array<ExtraAttribute>;
  extraDescriptionType?: string;
  extraResultType?: AnalysisResultTypes;
  extraResultAttributes?: { [key: string]: string };
};

export type AnalysisTypes = AnalysisType[];

export type AnalysisTypesObject = {
  analysisTypes: AnalysisTypes;
  analysisTypeCategories: ArrayAny;
};

export type Restriction = {
  requester?: Maybe<string>;
  expirationDate?: Maybe<string>;
  reason?: Maybe<string>;
  caseNumbers?: Maybe<Array<string>>;
  registeredStamp?: Maybe<{ user: string; date: string }>;
  cancelledStamp?: Maybe<{ user: string; date: string }>;
  cancelledReason?: Maybe<string>;
} & {
  requesterName?: Maybe<string>;
  cancelledBy?: Maybe<string>;
  cancelledByName?: Maybe<string>;
  cancelledDate?: Maybe<string>;
};

export type Result = {
  type: Maybe<string>;
  extRef?: Maybe<Array<string>>;
  comment?: Maybe<string>;
  files?: Maybe<Array<File>>;
  attachments?: Array<string>;
  [key: string]:
    | string
    | number
    | { value: number; unit: string }
    | Maybe<Array<string>>
    | Maybe<Array<File>>;
};

export type AffectedThing = {
  id: number;
  affectedThing: string;
  affectedType: 'collection' | 'sample';
  analysisTypeId: number;
  doneBy: string;
  doneDate: string;
  note?: Maybe<string>;
  partOf: number;
  registeredBy: string;
  registeredDate: string;
  responsible: string;
  type: 'Analysis' | 'AnalysisCollection';
};

export type ObjectInfo = {
  objectData?: Maybe<MusitObject>;
  sampleData?: Maybe<SampleDataExtended>;
};
export type AnalysisEvent = AffectedThing &
  ObjectInfo & {
    result?: {
      [key: string]:
        | string
        | { value?: string | Array<string> }
        | Array<string>
        | (String[] | undefined);
      extRef?: Array<string>;
      comment?: string;
    };
    expanded?: boolean;
    files?: Maybe<Array<SavedFile | File>>;
  };

// Fixme this type is incorrect/incomplete

export type AnalysisCollection = {
  id: number;
  analysisTypeId: number;
  objectId?: Maybe<string>;
  doneBy?: Maybe<string>;
  doneDate?: Maybe<string>;
  doneByName?: Maybe<string>;
  registeredBy?: Maybe<string>;
  registeredByName: Maybe<string>;
  registeredDate?: Maybe<string>;
  responsible?: Maybe<string>;
  responsibleName?: string;
  administrator?: Maybe<string>;
  administratorName?: Maybe<string>;
  updatedBy?: Maybe<string>;
  updatedDate?: Maybe<string>;
  completedBy?: Maybe<string>;
  completedByName?: Maybe<string>;
  completedDate?: Maybe<string>;
  note?: Maybe<string>;
  extraAttributes?: { type: string; [key: string]: string | number };
  result?: Maybe<Result>;
  files?: Maybe<Array<SavedFile | ErrorLoading>>;
  events: Array<AnalysisEvent>;
  restriction?: Maybe<Restriction>;
  reason?: Maybe<string>;
  status?: Maybe<number>;
  caseNumbers?: Maybe<Array<string>>;
  orgId?: Maybe<number>;
  type: string;
};
