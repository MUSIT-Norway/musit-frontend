// @flow
import type { AnalysisType } from './analysis';
import type { SampleType } from './sample';
import type { ConservationTypes } from './conservation';

export type AnalysisTypes = Array<AnalysisType>;

export type Purpose = {
  id: number,
  noPurpose: string,
  enPurpose: string
};
export type Purposes = Array<Purpose>;

export type AnalysisLab = {
  id: number,
  fullName: string,
  tel?: string,
  web?: string,
  synonyms?: Array<string>,
  serviceTags?: Array<string>,
  contact?: string,
  email?: string
};
export type AnalysisLabList = Array<AnalysisLab>;

export type SampleTypes = {
  [string]: Array<SampleType>,
  raw: Array<SampleType>
};

export type Category = {
  id: number,
  name: string
};
export type Categories = {
  [string]: string,
  raw: Array<Category>
};

export type StorageMedium = {
  storageMediumId: number,
  noStorageMedium: string,
  enStorageMedium: string
};
export type StorageMediums = Array<StorageMedium>;

export type Treatment = {
  treatmentId: number,
  noTreatment: string,
  enTreatment: string
};
export type Treatments = Array<Treatment>;

export type StorageContainer = {
  storageContainerId: number,
  noStorageContainer: string,
  enStorageContainer: string
};
export type StorageContainers = Array<StorageContainer>;

export type Predefined = {
  conservationTypes?: ?ConservationTypes,
  analysisTypes: ?AnalysisTypes,
  purposes: ?Purposes,
  analysisLabList: ?AnalysisLabList,
  sampleTypes: ?SampleTypes,
  categories: ?Categories,
  storageContainers: ?StorageContainers,
  storageMediums: ?StorageMediums,
  treatments: ?Treatments
};
