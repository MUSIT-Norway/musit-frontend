/* @flow */

type SampleData = {
  id: string,
  sampleId: string,
  doneBy: string,
  date: string,
  sampleType: string,
  sampleSubType: string,
  status: string,
  details: string,
  hasAnalyse: boolean,
  createdDate: string
};

export type Samples = SampleData[];

export type SamplesPropsType = { samples: Samples };
