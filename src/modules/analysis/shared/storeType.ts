// @flow
import type { AnalysisType, AnalysisCollection } from '../../../types/analysis';

export type Store = {
  analysis?: ?AnalysisCollection,
  analysisTypes?: Array<AnalysisType>,
  analysisTypeCategories?: Array<string>,
  extraDescriptionAttributes: any,
  extraResultAttributes: any,
  showRestrictionCancelDialog?: ?boolean
};
