// @flow
import type { AnalysisType } from './analysis';

export type AnalysisTypes = Array<AnalysisType>;
export type Purposes = Array<any>;
export type AnalysisLabList = Array<any>;
export type SampleTypes = any;
export type Categories = any;
export type StorageMediums = Array<any>;
export type Treatments = Array<any>;
export type StorageContainers = Array<any>;

export type Predefined = {
  analysisTypes: ?AnalysisTypes,
  purposes: ?Purposes,
  analysisLabList: ?AnalysisLabList,
  sampleTypes: ?SampleTypes,
  categories: ?Categories,
  storageContainers: ?StorageContainers,
  storageMediums: ?StorageMediums,
  treatments: ?Treatments
};
