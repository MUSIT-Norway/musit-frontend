// @flow
import { SampleType } from "./sample";
import { ActorStamp } from "./actor";
import { ObjectId, MuseumId, ActorId, SampleId, SampleTypeId } from "./ids";
import { Maybe, Star, ArrayAny, STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS } from "./common";

export type ActorStampWithName = ActorStamp & { name?: Maybe<string> };
export type ParentObjectWithData = ParentObject & { sampleOrObjectData?: Maybe<Star> };

/**
 * This is the actual response object from the backend.
 */
type Size = {
  unit: string;
  value: number;
};

/**
 * This is the actual response object from the backend.
 */
export type ExternalId = {
  value: string;
  source?: string;
};

/**
 * This is the actual response object from the backend.
 */
export type ParentObject = {
  objectId: Maybe<ObjectId>;
  objectType: "collection" | "sample";
};

/**
 * This is the actual response object from the backend.
 */
export type Sample = {
  objectId: ObjectId;
  originatedObjectUuid: ObjectId;
  parentObject: ParentObjectWithData; //this is a hack to get flow to work
  isExtracted: boolean;
  museumId: MuseumId;
  status: number;
  responsible?: Maybe<ActorId>;
  doneByStamp?: Maybe<ActorStamp>;
  sampleNum?: Maybe<number>;
  sampleId?: Maybe<SampleId>;
  externalId?: Maybe<ExternalId>;
  sampleTypeId: SampleTypeId;
  size?: Maybe<Size>;
  container?: Maybe<string>;
  storageMedium?: Maybe<string>;
  treatment?: Maybe<string>;
  leftoverSample: number;
  description?: Maybe<string>;
  note?: Maybe<string>;
  registeredStamp: ActorStampWithName; //this is a hack to get flow to work
  updatedStamp?: Maybe<ActorStampWithName>; //this is a hack to get flow to work
  isDeleted: boolean;
};

export type SampleData = Sample & {
  id: string;
  doneBy: string;
  date: string;
  sampleSubType: string;
  details: string;
  hasAnalyse: boolean;
  breadcrumb: ArrayAny;
  updatedDate?: Maybe<string>;
  registeredDate: string;
  currentLocation?: Maybe<{ breadcrumb: Maybe<Array<Star>>; pathNames: Maybe<Array<Star>> }>;
  uuid: STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS; //Was used in sampleDataForTest
  museumNo: STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS; //Was used in sampleDataForTest
  term: STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS; //Was used in sampleDataForTest
  subNo: STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS; //Was used in sampleDataForTest
  objectType: STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS; //Was used in sampleDataForTest
  objectUUID: STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS; //Was used in sampleDataForTest
  nodeId: STEIN_OR_RITUVESH_MUST_LOOK_INTO_THIS; //Was used in sampleDataForTest
};

export type Samples = SampleData[];

export type SampleStatusData = {
  id: number;
  noStatus: Maybe<string>;
  enStatus: Maybe<string>;
};

export type SampleStatus = SampleStatusData[];

export type SampleDataExtended = { sampleType?: SampleType } & SampleData;
