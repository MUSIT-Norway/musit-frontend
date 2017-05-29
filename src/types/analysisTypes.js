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
