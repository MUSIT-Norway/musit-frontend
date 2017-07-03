// @flow
import type { AnalysisType, AnalysisCollection } from '../../../types/analysis';

export type Store = {
  analysis?: AnalysisCollection,
  analysisTypes?: Array<AnalysisType>,
  analysisTypeCategories?: Array<String>,
  extraDescriptionAttributes: any,
  extraResultAttributes: any
};
