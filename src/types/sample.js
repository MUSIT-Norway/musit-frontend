// @flow
export type SampleType = {
  enSampleSubType?: ?string,
  enSampleType: string,
  noSampleSubType?: ?string,
  noSampleType: string,
  sampleTypeId: number
};

export type SampleTypes = Array<SampleType>;

export type SampleTypesObject = {
  sampleTypes: SampleTypes
};

export type PredefinedSampleTypes = {
  storageContainers: Array<any>,
  storageMediums: Array<any>,
  treatments: Array<any>,
  sampleTypes: SampleTypes
};
