// @flow
import type { AppSession } from '../types/appSession';
import type { History } from '../types/Routes';
import type { AnalysisCollection } from '../types/analysis';
import type { SampleDateExtended } from '../types/samples';

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

export const sample: SampleDateExtended = {
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
