// @flow
import { Moment } from 'moment';

export type SampleData = {
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
  sampleNum: number,
  breadcrumb: [],
  objectId: string,
  note: string
};

export type Samples = SampleData[];

export type SamplesPropsType = { samples: Samples, onClick: Function };
