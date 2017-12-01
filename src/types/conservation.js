// @flow

import type { MusitObject } from '../types/object';
import type { SampleDataExtended } from '../types/samples';
import type { Person } from '../types/person';
import type { AppSession } from '../types/appSession';

export type ActorsAndRoles = {
  roleId?: number | string,
  roleName?: string,
  actorName?: string,
  actorId: string,
  date?: string
};

export type AffectedThing = {
  id: number,
  affectedThing: string,
  affectedType: 'collection',
  analysisTypeId: number,
  doneBy: string,
  doneDate: string,
  note?: ?string,
  partOf: number,
  registeredBy: string,
  registeredDate: string,
  responsible: string
};

export type ObjectInfo = {
  objectData?: ?MusitObject,
  sampleData?: ?SampleDataExtended
} & MusitObject;
export type ObjectInfoAffectedThing = ?ObjectInfo & ?AffectedThing;

// Fixme this type is incorrect/incomplete
export type ConservationCollection = {
  id: number,
  analysisTypeId: number,
  objectId?: ?string,
  doneBy?: ?string,
  doneDate?: ?string,
  doneByName?: ?string,
  registeredBy?: ?string,
  participating?: ?string,
  participatingName?: ?string,
  registeredDate?: ?string,
  responsible?: ?string,
  responsibleName?: string,
  administrator?: ?string,
  administratorName?: ?string,
  updatedBy?: ?string,
  updatedDate?: ?string,
  completedBy?: ?string,
  completedByName?: ?string,
  completedDate?: ?string,
  note?: ?string,
  extraAttributes?: { type: string, [string]: string | number },
  affectedThings?: ?Array<ObjectInfo>,
  reason?: ?string,
  status?: ?number,
  caseNumbers?: ?Array<string>,
  caseNumber?: ?string,
  orgId?: ?number,
  events: Array<any>,
  actorsAndRoles?: Array<ActorsAndRoles>
};

export type ConservationType = {
  id: number,
  noName?: string,
  enName?: string
};

export type ConditionCodeType = {
  conditionCode: number,
  enCondition?: string,
  noCondition?: string
};

export type ConservationTypes = Array<ConservationType>;

export type ConservationTypesObject = {
  conservationTypes: ConservationTypes
};

export type ConservationStoreState = {
  loadingConservation?: boolean,
  conservation?: ?ConservationCollection,
  conservationTypes?: Array<string>
};

export type ConservationSave = {
  doneBy?: ?string,
  doneDate?: ?string,
  responsible?: ?string,
  administrator?: ?string,
  completedBy?: ?string,
  completedDate?: ?string,
  caseNumber?: ?string,
  affectedThings?: ?Array<string>,
  actorsAndRoles?: Array<ActorsAndRoles>,
  note?: ?string
};

export type ConservatonSubType = {
  id: number,
  noTerm: string,
  enTerm: string
};

export type SubEventComponentNoteType = {
  eventTypeId: number,
  note: string,
  actorsAndRoles: Array<Person>,
  affectedThings?: Array<string>,
  expanded: boolean,
  toggleExpanded: Function,
  toggleSingleExpanded: Function
};

type SubEventComponentProps = {
  index?: number,
  appSession?: AppSession,
  viewMode?: boolean,
  onChange: Function,
  onDelete?: Function,
  onChangePersonActorRole: Function,
  expanded?: boolean,
  toggleExpanded: Function,
  actorsAndRoles: Array<Person>,
  roleList: Array<any>,
  extraAttributes?: ?any,
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>
};

export type HseRiskType = SubEventComponentNoteType;
export type TechnicalDescriptionType = SubEventComponentNoteType;
export type ConditionAssessmentType = SubEventComponentNoteType & {
  conditionCode: number
};
export type ReportType = SubEventComponentNoteType;

export type TreatmentType = {
  keywords?: Array<string>,
  materials?: Array<string>
} & SubEventComponentNoteType;

export type StorageAndHandlingType = {
  lightAndUvLevel: string,
  relativeHumidity: string,
  temperature: string
} & SubEventComponentNoteType;

export type SubEventComponentNoteProps = {
  subEvent: SubEventComponentNoteType
} & SubEventComponentProps;

export type TreatmentProps = {
  materials: Array<any>,
  keywords: Array<any>,
  treatment: TreatmentType
} & SubEventComponentProps;

export type TechnicalDescriptionProps = {
  technicalDescription: SubEventComponentNoteType
} & SubEventComponentProps;

export type HseRiskProps = {
  hseRisk: SubEventComponentNoteType
} & SubEventComponentProps;

export type StorageAndHandlingProps = {
  storageAndHandling: StorageAndHandlingType,
  storageAndHandling: StorageAndHandlingType
} & SubEventComponentProps;

export type ConditionAssessmentProps = {
  conditionAssessment: ConditionAssessmentType,
  conditionCodes: Array<ConditionCodeType>
} & SubEventComponentProps;

export type ReportProps = {
  report: SubEventComponentNoteType
} & SubEventComponentProps;

export type ConservationSubTypes =
  | TreatmentType
  | TechnicalDescriptionType
  | StorageAndHandlingType
  | HseRiskType
  | ConditionAssessmentType
  | ReportType;
