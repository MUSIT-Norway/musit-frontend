// @flow
export type SampleType = {
  enSampleSubType?: ?string,
  enSampleType: string,
  noSampleSubType?: ?string,
  noSampleType: string,
  sampleTypeId: number
};

export type SampleTypes = SampleType[];

export type SampleTypesObject = {
  sampleTypes: SampleTypes
};
