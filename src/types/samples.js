// @flow

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
  storageMedium: string,
  sampleNum: number,
  breadcrumb: [],
  objectId: string,
  note: string,
  status: number,
  externalId?: { value?: string, source?: string },
  size?: { unit: string, value: number },
  container?: string,
  treatment?: string,
  description?: string,
  parentObject: { objectId: string, objectType: string, sampleOrObjectData: any },
  updatedStamp: { name: ?string, date?: string },
  registeredStamp: { name: ?string, date?: string }
};

export type Samples = SampleData[];

export type SampleStatusData = {
  id: number,
  noStatus: ?string,
  enStatus: ?string
};

export type SampleStatus = SampleStatusData[];
