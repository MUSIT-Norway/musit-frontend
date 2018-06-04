// @flow
import { AnalysisType } from "./analysis";
import { SampleType } from "./sample";
import { ConservationTypes } from "./conservation";
import { Maybe } from "./common";

export type AnalysisTypes = Array<AnalysisType>;

export type Purpose = {
  id: number;
  noPurpose: string;
  enPurpose: string;
};
export type Purposes = Array<Purpose>;

export type AnalysisLab = {
  id: number;
  fullName: string;
  tel?: string;
  web?: string;
  synonyms?: Array<string>;
  serviceTags?: Array<string>;
  contact?: string;
  email?: string;
};
export type AnalysisLabList = Array<AnalysisLab>;

export type SampleTypes = {
  [key: string]: Array<SampleType>;
  raw: Array<SampleType>;
};

export type Category = {
  id: number;
  name: string;
};
export type Categories = {
  [key: string]: string | Array<Category>;
  raw: Array<Category>;
};

export type StorageMedium = {
  storageMediumId: number;
  noStorageMedium: string;
  enStorageMedium: string;
};
export type StorageMediums = Array<StorageMedium>;

export type Treatment = {
  treatmentId: number;
  noTreatment: string;
  enTreatment: string;
};
export type Treatments = Array<Treatment>;

export type StorageContainer = {
  storageContainerId: number;
  noStorageContainer: string;
  enStorageContainer: string;
};
export type StorageContainers = Array<StorageContainer>;

export interface Predefined {
  conservationTypes?: Maybe<ConservationTypes>;
  analysisTypes: Maybe<AnalysisTypes>;
  purposes: Maybe<Purposes>;
  analysisLabList: Maybe<AnalysisLabList>;
  sampleTypes: Maybe<SampleTypes>;
  categories: Maybe<Categories>;
  storageContainers: Maybe<StorageContainers>;
  storageMediums: Maybe<StorageMediums>;
  treatments: Maybe<Treatments>;

  loadingSampleTypes?: boolean;
  loadingAnalysisTypes?: boolean;
  loadingConservationTypes?: boolean;
}
