// @flow
import type { ObjectData } from '../types/object';
import type { SampleData } from '../types/samples';

export type Size = { value: number, unit: string, rawValue: ?string };

export type ExtraResultAttributeValues = {
  [string]:
    | ?string
    | ?{
      type: ?string,
      value: ?string | ?number | ?Size
    }
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
  extraResultType?: string,
  extraResultAttributes?: { [string]: string }
};

export type AnalysisTypes = AnalysisType[];

export type AnalysisTypesObject = {
  analysisTypes: AnalysisTypes,
  analysisTypeCategories: []
};

export type Restriction = {
  requester?: ?string,
  requesterName?: ?string,
  reason?: ?string,
  expirationDate?: ?string,
  cancelledReason?: ?string,
  caseNumbers?: ?Array<string>
};

export type Result = {
  type: ?string,
  extRef?: ?Array<string>,
  comment?: ?string,
  [string]: string | number | { value: number, unit: string }
};

export type AnalysisCollection = {
  id: number,
  analysisTypeId: number,
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
  events: ?Array<ObjectData & SampleData>,
  restriction?: ?Restriction,
  reason?: ?string,
  status?: ?number,
  caseNumbers?: ?Array<string>,
  orgId?: ?number
};
