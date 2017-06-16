// @flow

export type AnalysisType = {
  id: number,
  noName: string,
  enName: string,
  category: string,
  name: string
};
export type AnalysisTypes = AnalysisType[];

export type AnalysisTypesObject = {
  analysisTypes: AnalysisTypes,
  analysisTypeCategories: []
};

export type AnalysisCollection = {
  id?: ?number,
  analysisTypeId: number,
  doneBy?: ?string,
  doneDate?: ?string,
  registeredBy?: ?string,
  registeredDate?: ?string,
  responsible?: ?string,
  administrator?: ?string,
  updatedBy?: ?string,
  updatedDate?: ?string,
  completedBy?: ?string,
  completedDate?: ?string,
  note?: ?string,
  extraAttributes?: ?any, //ExtraAttributes
  result?: ?any, //AnalysisResult
  events: Array<any>, // Analysis
  restriction?: ?any, //Restriction
  reason?: ?string,
  status?: ?number,
  caseNumbers?: ?Array<string>,
  orgId?: ?number
};
