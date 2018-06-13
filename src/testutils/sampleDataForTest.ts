// @flow
import { AppSession } from "../types/appSession";
import {
  History,
  LocationListener,
  LocationDescriptorObject,
  Action,
  UnregisterCallback
} from "history";
import { AnalysisCollection, AnalysisEvent } from "../types/analysis";
import { SampleDataExtended } from "../types/samples";
import { MusitObject } from "../types/object";
import { Field } from "../forms/form";
import { noMapper } from "../forms/mappers";
import {
  getStrField,
  getNumberField,
  getBoolField,
  getArrField,
  getCompositeField
} from "../forms/form";
import { FormData as AnalysisFormData } from "../modules/analysis/shared/formType";

export const appSession: AppSession = {
  museumId: 99,
  collectionId: "1234",
  accessToken: "45667",
  actor: {
    fn: "Test"
  },
  language: {
    isEn: false,
    isNo: true
  },
  rolesForModules: {
    collectionManagementRead: true,
    collectionManagementWrite: true,
    storageFacilityRead: true,
    storageFacilityWrite: true,
    storageFacilityAdmin: true,
    documentArchiveRead: true,
    documentArchiveWrite: true
  }
};

export const history: History = {
  push: () => {},
  replace: () => {},
  goBack: () => {},
  goForward: () => {},
  length: 0,
  action: (undefined as any) as Action,
  location: undefined as any, //Can cast it as Location, but we have two different Locations in scope here, so I didn't bother
  go: (n: number) => {},
  block: (prompt?: any) => (undefined as any) as UnregisterCallback,
  listen: (listener: LocationListener) => (undefined as any) as UnregisterCallback,
  createHref: (location: LocationDescriptorObject) => (undefined as any) as string
};

export const analysis: AnalysisCollection = {
  id: 1,
  analysisTypeId: 27,
  doneBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
  doneDate: "2018-06-12T11:13:19+00:00",
  registeredBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
  registeredDate: "2018-06-12T11:14:43+00:00",
  responsible: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
  administrator: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
  completedBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
  completedDate: "2018-06-12T11:13:43+00:00",
  note: "test",
  result: {
    registeredBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
    registeredDate: "2018-06-12T11:14:44+00:00",
    extRef: ["bcvbvbvc"],
    comment: "vcvcvx",
    attachments: ["7b0aac35-3bc4-452f-9f8d-8964a91fdcf0"],
    type: "GenericResult"
  },
  events: [
    {
      objectData: {
        id: 14,
        uuid: "a982bcc0-133c-4af8-99cc-f02df98c2b0b",
        museumId: 99,
        museumNo: "MusK23",
        term: "Lite skaft av ben",
        collection: 1,
        materials: [],
        locations: [],
        coordinates: [],
        isDeleted: false,
        objectType: "collection"
      },
      id: 2,
      analysisTypeId: 27,
      doneBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      doneDate: "2018-06-12T11:13:19+00:00",
      registeredBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      registeredDate: "2018-06-12T11:14:43+00:00",
      responsible: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      //TODO: administrator: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      //TODO: completedBy: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      //TODO: completedDate: "2018-06-12T11:13:43+00:00",
      affectedThing: "a982bcc0-133c-4af8-99cc-f02df98c2b0b",
      affectedType: "collection",
      partOf: 1,
      note: "test",
      type: "Analysis"
    }
  ],
  restriction: {
    requester: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
    expirationDate: "2018-06-13T22:00:00+00:00",
    reason: "dfdfs",
    caseNumbers: ["123"],
    registeredStamp: {
      user: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e",
      date: "2018-06-12T11:14:43+00:00"
    },
    requesterName: "Rituvesh Kumar"
  },
  reason: "Dating",
  status: 1,
  caseNumbers: ["123"],
  orgId: 389,
  type: "AnalysisCollection",
  registeredByName: "Rituvesh Kumar",
  doneByName: "Rituvesh Kumar",
  responsibleName: "Rituvesh Kumar",
  administratorName: "Rituvesh Kumar",
  completedByName: "Rituvesh Kumar"
  /*TODO: Include this, I removed it in order to get stuff to compile. (Rituvesh and I added this much larger object actually used in the app earlier today, perhaps a bit too optimistic)
  files: [
    {
      id: "cf70910e-6e31-11e8-9251-13f2b8765574",
      fid: "7b0aac35-3bc4-452f-9f8d-8964a91fdcf0",
      title: "Screenshot from 2017-05-31 11-28-54 (13th copy).png",
      size: "305586",
      fileType: "image/png",
      owner: {
        ownerId: "99",
        ownerType: "org"
      },
      path: "/root/Modules/Analysis/1",
      version: 1,
      published: false,
      createdStamp: {
        date: "2018-06-12T11:14:44.649+00:00",
        by: "7dcc7e82-a18c-4e2e-9d83-2b25c132fc3e"
      },
      documentDetails: {
        number: 1
      },
      type: "archive_document"
    }
    
  ]*/
};

export const sample: SampleDataExtended = {
  id: "123",
  uuid: "0000-0000-123", //TODO: Is uuid needed?
  objectId: "0000-0000-123",
  originatedObjectUuid: "0000-0000-123",
  museumId: 99,
  status: 1,
  leftoverSample: 1,
  isExtracted: false,
  isDeleted: false,
  sampleTypeId: 1,
  museumNo: "M1234",
  term: "Carex saxatilis",
  subNo: "a",
  objectType: "collection",
  currentLocation: { pathNames: null, breadcrumb: null },
  parentObject: {
    objectId: "000-0000-0001",
    objectType: "collection",
    sampleOrObjectData: {}
  },
  registeredDate: "some date",
  registeredStamp: { user: "000-0000-0001", date: "2017" },
  // updatedStamp: {name: null},
  objectUUID: "0000-0000-123",
  sampleSubType: "some sub type",
  doneBy: "none",
  hasAnalyse: false,
  date: "some date",
  breadcrumb: [],
  details: "some details",
  nodeId: "blee",
  sampleNum: 12,
  sampleType: {
    sampleTypeId: 1,
    enSampleType: "en",
    noSampleType: "no",
    noSampleSubType: "no sub",
    enSampleSubType: "en sub"
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
    affectedType: "collection",
    analysisTypeId: 5,
    doneBy: "some uuid",
    doneDate: "some date",
    partOf: 3 * id,
    registeredBy: "some uuid",
    registeredDate: "some date",
    responsible: "some uuid",
    type: "Analysis",
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
    objectType: "collection"
  };
}

export const object: MusitObject = {
  id: 56,
  uuid: "12080e3e-2ca2-41b1-9d4a-4d72e292dcd8",
  museumId: 99,
  museumNo: "MusN11",
  term: "Solsikke",
  collection: 8,
  materials: [],
  locations: [],
  coordinates: [],
  objectType: "collection"
};

export function createField<T>(name: string, value: T, valid: boolean = false): Field<T> {
  return {
    name: name,
    rawValue: noMapper.toRaw(value),
    defaultValue: value,
    status: {
      valid: valid
    },
    validator: {},
    mapper: noMapper
  };
}

export const analysisForm: AnalysisFormData = {
  id: getNumberField("", 1),
  analysisTypeId: getNumberField("", 1),
  analysisTypeCategory: getStrField("", "1"),
  doneBy: getStrField("", "1"),
  doneDate: getStrField("", "1"),
  registeredBy: getStrField("", "1"),
  registeredByName: getStrField("", "1"),
  registeredDate: getStrField("", "1"),
  responsible: getStrField("", "1"),
  resultFiles: getArrField("", []),
  administrator: getStrField("", "1"),
  persons: getArrField("", [
    {
      name: "jarl",
      role: "responsible"
    },
    {
      name: "line",
      role: "creator",
      date: "2017-06-29T07:54:22+00:00"
    }
  ]),
  completedBy: getStrField("", "1"),
  completedDate: getStrField("", "1"),
  objectId: getStrField("", "1"),
  note: getStrField("", "1"),
  type: getStrField("", "1"),
  partOf: getStrField("", "1"),
  result: getCompositeField("", null),
  orgId: getNumberField("orgId", 1),
  externalSource: getStrField("", "1"),
  comments: getStrField("", "1"),
  reason: getStrField("", "1"),
  caseNumbers: getArrField("", []),
  completeAnalysis: getStrField("", "1"),
  // restriction
  restrictions: getBoolField("", true),
  restriction: getCompositeField("", {
    requester: "3cbf15cb-8348-4e66-99a4-bc314da57444",
    requesterName: "Jarl",
    reason: "fin årsak",
    caseNumbers: ["dddd", "44555", "55555"],
    expirationDate: "2017-03-29T07:54:22+00:00",
    cancelledReason: "meh"
  }),
  // object details
  museumNo: getStrField("", "1"),
  subNo: getStrField("", "1"),
  term: getStrField("", "1"),
  eventDate: getStrField("", "1"),
  actor: getStrField("", "1"),
  events: getArrField("", []),
  updatedBy: getStrField("", "1"),
  updatedByName: getStrField("", "1"),
  updatedDate: getStrField("", "1"),
  status: getNumberField("status", 1)
};
