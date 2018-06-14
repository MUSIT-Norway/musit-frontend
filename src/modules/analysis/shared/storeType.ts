// @flow
import { AnalysisType, AnalysisCollection } from '../../../types/analysis';
import { Maybe } from '../../../types/common';

export type Store = {
  analysis?: Maybe<AnalysisCollection>;
  analysisTypes?: Array<AnalysisType>;
  analysisTypeCategories?: Array<string>;
  extraDescriptionAttributes: any;
  extraResultAttributes: any;
  showRestrictionCancelDialog?: Maybe<boolean>;
};
