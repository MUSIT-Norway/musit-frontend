// @flow
import type { AppSession } from '../types/appSession';
import type { History } from '../types/Routes';
import type { AnalysisCollection, AnalysisEvent } from '../types/analysis';
import type { SampleDataExtended } from '../types/samples';
import type { MusitObject } from '../types/object';
import type { Field } from '../forms/form';
import { noMapper } from '../forms/mappers';

export const appSession: AppSession = {
  museumId: 99,
  collectionId: '1234',
  accessToken: '45667',
  actor: {
    fn: 'Test'
  },
  language: {
    isEn: false,
    isNo: true
  }
};

export const history: History = {
  push: () => {},
  replace: () => {},
  goBack: () => {},
  goForward: () => {}
};

export const analysis: AnalysisCollection = {
  analysisTypeId: 1,
  eventDate: '2017-03-16T14:37:45+00:00',
  id: 2,
  museumNo: 'MusK58',
  note: 'fdsfsd sdsa 2',
  objectId: 'adea8141-8099-4f67-bff9-ea5090e18335',
  partOf: 1,
  registeredBy: '7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e',
  registeredByName: 'Rituvesh Kumar',
  registeredDate: '2017-04-03T10:36:34+00:00',
  subNo: '2',
  events: [],
  term: 'Mansjettknapp',
  type: 'Analysis'
};

export const sample: SampleDataExtended = {
  id: '123',
  uuid: '0000-0000-123',
  objectId: '0000-0000-123',
  originatedObjectUuid: '0000-0000-123',
  museumId: 99,
  status: 1,
  leftoverSample: 1,
  isExtracted: false,
  isDeleted: false,
  sampleTypeId: 1,
  museumNo: 'M1234',
  term: 'Carex saxatilis',
  subNo: 'a',
  objectType: 'collection',
  currentLocation: { pathNames: null, breadcrumb: null },
  parentObject: {
    objectId: '000-0000-0001',
    objectType: 'collection',
    sampleOrObjectData: {}
  },
  registeredDate: 'some date',
  registeredStamp: { user: '000-0000-0001', date: '2017' },
  // updatedStamp: {name: null},
  objectUUID: '0000-0000-123',
  sampleSubType: 'some sub type',
  doneBy: 'none',
  hasAnalyse: false,
  date: 'some date',
  breadcrumb: [],
  details: 'some details',
  nodeId: 'blee',
  sampleNum: 12,
  sampleType: {
    sampleTypeId: 1,
    sampleType: null,
    enSampleType: 'en',
    noSampleType: 'no',
    noSampleSubType: null,
    enSampleSubType: null
  }
};

export function createAnalysisEventWithObject(
  id: number,
  uuid: string,
  museumNo: string,
  subNo: string,
  term: string
): AnalysisEvent {
  return {
    id: 2 * id,
    affectedThing: uuid,
    affectedType: 'collection',
    analysisTypeId: 5,
    doneBy: 'some uuid',
    doneDate: 'some date',
    partOf: 3 * id,
    registeredBy: 'some uuid',
    registeredDate: 'some date',
    responsible: 'some uuid',
    type: 'Analysis',
    objectData: createObject(id, uuid, museumNo, subNo, term)
  };
}

export function createObject(
  id: number,
  uuid: string,
  museumNo: string,
  subNo: string,
  term: string
): MusitObject {
  return {
    id: id,
    uuid: uuid,
    museumId: 99,
    museumNo: museumNo,
    subNo: subNo,
    term: term,
    collection: 8,
    materials: [],
    locations: [],
    coordinates: [],
    objectType: 'collection'
  };
}

export const object: MusitObject = {
  id: 56,
  uuid: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
  museumId: 99,
  museumNo: 'MusN11',
  term: 'Solsikke',
  collection: 8,
  materials: [],
  locations: [],
  coordinates: [],
  objectType: 'collection'
};

export function createField<T>(
  name: string,
  value: T,
  valid?: boolean = false
): Field<T> {
  return {
    name: name,
    rawValue: value,
    defaultValue: value,
    status: {
      valid: valid
    },
    validator: {},
    mapper: noMapper
  };
}
