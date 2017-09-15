// @flow
import type { SampleType } from './sample';
import type { ActorStamp } from './actor';
import type { ObjectId, MuseumId, ActorId, SampleId, SampleTypeId } from './ids';

export type ActorStampWithName = ActorStamp & { name?: ?string };
export type ParentObjectWithData = ParentObject & { sampleOrObjectData?: ?* };

/**
 * This is the actual response object from the backend.
 */
type Size = {
  unit: string,
  value: number
};

/**
 * This is the actual response object from the backend.
 */
export type ExternalId = {
  value: string,
  source?: string
};

/**
 * This is the actual response object from the backend.
 */
export type ParentObject = {
  objectId: ?ObjectId,
  objectType: 'collection' | 'sample'
};

/**
 * This is the actual response object from the backend.
 */
export type Sample = {
  objectId: ObjectId,
  originatedObjectUuid: ObjectId,
  parentObject: ParentObjectWithData, //this is a hack to get flow to work
  isExtracted: boolean,
  museumId: MuseumId,
  status: number,
  responsible?: ?ActorId,
  doneByStamp?: ?ActorStamp,
  sampleNum?: ?number,
  sampleId?: ?SampleId,
  externalId?: ?ExternalId,
  sampleTypeId: SampleTypeId,
  size?: ?Size,
  container?: ?string,
  storageMedium?: ?string,
  treatment?: ?string,
  leftoverSample: number,
  description?: ?string,
  note?: ?string,
  registeredStamp: ActorStampWithName, //this is a hack to get flow to work
  updatedStamp?: ?ActorStampWithName, //this is a hack to get flow to work
  isDeleted: boolean
};

export type SampleData = Sample & {
  id: string,
  doneBy: string,
  date: string,
  sampleSubType: string,
  details: string,
  hasAnalyse: boolean,
  breadcrumb: [],
  updatedDate?: ?string,
  registeredDate: string,
  currentLocation?: ?{ breadcrumb: ?Array<*>, pathNames: ?Array<*> }
};

export type Samples = SampleData[];

export type SampleStatusData = {
  id: number,
  noStatus: ?string,
  enStatus: ?string
};

export type SampleStatus = SampleStatusData[];

export type SampleDataExtended = { sampleType?: SampleType } & SampleData;
