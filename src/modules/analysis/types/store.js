import type { ObjectData } from 'types/object';

export type AnalysisType = {
  id: string,
  name: string,
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
