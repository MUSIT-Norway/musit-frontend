// @flow
export type SampleType = {
  sampleTypeId: number;
  noSampleType: string;
  enSampleType: string;
  noSampleSubType?: string;
  enSampleSubType?: string;
};

export type SampleTypes = Array<SampleType>;

export type SampleTypesObject = {
  sampleTypes: SampleTypes;
};

export type PredefinedSampleTypes = {
  storageContainers: Array<any>;
  storageMediums: Array<any>;
  treatments: Array<any>;
  sampleTypes: SampleTypes;
};
