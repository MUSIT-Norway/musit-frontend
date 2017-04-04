/* @flow */

type T_SampleData = {
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


export type T_Samples = T_SampleData[];

export type SamplesPropsType = { samples: T_Samples };