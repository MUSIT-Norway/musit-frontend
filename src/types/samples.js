// @flow
import { Moment } from 'moment';

type SampleData = {
  id: string,
  sampleId: string,
  doneBy: string,
  date: string,
  sampleType: { value: string, subTypeValue: string },
  sampleSubType: string,
  status: string,
  details: string,
  hasAnalyse: boolean,
  createdDate: Moment
};

export type Samples = SampleData[];

export type SamplesPropsType = { samples: Samples, onClick: Function };
