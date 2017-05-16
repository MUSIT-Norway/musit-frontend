import type { ObjectData } from 'types/object';

export type AnalysisType = {
  id: number,
  noName: string,
  enName: string,
  category: string
};

export type Analysis = {
  id: number,
  analysisTypeId: string,
  events: Array<ObjectData>
};

export type Store = {
  analysis?: Analysis,
  analysisTypes?: Array<AnalysisType>,
  analysisTypeCategories?: Array<String>
};
