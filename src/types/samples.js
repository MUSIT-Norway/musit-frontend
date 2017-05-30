// @flow

type SampleData = {
  id: string,
  sampleId: string,
  doneBy: string,
  date: string,
  sampleTypeId: number,
  sampleSubType: string,
  status: string,
  details: string,
  hasAnalyse: boolean,
  doneDate?: string,
  registeredDate: string,
  storageMedium: string,
  sampleNum: number
};

export type Samples = SampleData[];

export type SamplesPropsType = { samples: Samples, onClick: Function };
