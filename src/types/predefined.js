// @flow
import type { AnalysisType } from './analysis';

export type AnalysisTypes = Array<AnalysisType>;
export type Purposes = Array<any>;
export type AnalysisLabList = Array<any>;
export type SampleTypes = any;
export type Categories = any;

export type Predefined = {
  analysisTypes: AnalysisTypes,
  purposes: Purposes,
  analysisLabList: AnalysisLabList,
  sampleTypes: SampleTypes,
  categories: Categories,
  storageContainers: Array<any>,
  storageMediums: Array<any>,
  treatments: Array<any>
};
