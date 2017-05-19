// @flow
import { Moment } from 'moment';

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
  doneDate: Moment
};

export type Samples = SampleData[];

export type SamplesPropsType = { samples: Samples, onClick: Function };
