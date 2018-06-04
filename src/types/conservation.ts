// @flow

import type { MusitObject } from '../types/object';
//import type { SampleDataExtended } from '../types/samples';
import type { Person } from '../types/person';
import type { AppSession } from '../types/appSession';
import type { Field } from '../forms/form';

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

export type ObjectInfo = MusitObject;

export type ObjectInfoAffectedThing = ?ObjectInfo & ?AffectedThing;

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

export type MeasurementData = {
  weight?: number,
  length?: number,
  width?: number,
  thickness?: number,
  height?: number,
  largestLength?: number,
  largestWidth?: number,
  largestThickness?: number,
  largestHeight?: number,
  diameter?: number,
  tverrmaal?: number,
  largestMeasurement?: number,
  measurement?: string,
  quantity?: number,
  quantitySymbol?: string,
  fragmentQuantity?: number
};

export type SubEventComponentNoteType = {
  eventTypeId: number,
  note: string,
  actorsAndRoles: Array<Person>,
  affectedThings?: Array<string>,
  documents?: Array<string>,
  files?: Array<any>,
  expanded: boolean,
  toggleExpanded: Function,
  toggleSingleExpanded: Function,
  measurementData?: MeasurementData
};

type SubEventComponentProps = {
  index?: number,
  appSession?: AppSession,
  objects?: any,
  searchStore?: any,
  viewMode?: boolean,
  onChange: Function,
  onDelete?: Function,
  onEdit?: Function,
  onSave?: Function,
  onCancel?: Function,
  onChangePersonActorRole: Function,
  onAddAffectedThings: Function,
  getEventObjectDetails: Function,
  onAddObjectsToSubEvent: Function,
  addNewObjectToSubEventAndProcess: Function,
  expanded?: boolean,
  toggleExpanded: Function,
  actorsAndRoles: Array<Person>,
  roleList: Array<any>,
  extraAttributes?: ?any,
  affectedThingsWithDetailsMainEvent?: ?Array<ObjectInfo>,
  onDocumentUpload?: Function,
  isFormValid: Function,
  editable: ?number,
  isUpdated?: boolean,
  objectsReadOnly?: boolean,
  downloadConservationReport?: Function
};

export type HseRiskType = SubEventComponentNoteType;
export type TechnicalDescriptionType = SubEventComponentNoteType;
export type ConditionAssessmentType = SubEventComponentNoteType & {
  conditionCode: number
};

export type MeasurementDeterminationType = SubEventComponentNoteType;

export type ReportType = {
  archiveReference?: string
} & SubEventComponentNoteType;

export type TreatmentType = {
  keywords?: Array<string>,
  materials?: Array<string>
} & SubEventComponentNoteType;

export type StorageAndHandlingType = {
  lightLevel: string,
  uvLevel: string,
  relativeHumidity: string,
  temperature: string
} & SubEventComponentNoteType;

export type Material = {
  materialId: number,
  materialExtra: string,
  sorting: number
};

export type MaterialInfo = Array<Material>;

export type MaterialDeterminationType = {
  materialInfo: MaterialInfo
} & SubEventComponentNoteType;

export type NoteType = SubEventComponentNoteType;

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

export type MeasurementDeterminationProps = {
  measurementDetermination: MeasurementDeterminationType
} & SubEventComponentProps;

export type StorageAndHandlingProps = {
  storageAndHandling: StorageAndHandlingType
} & SubEventComponentProps;

export type ConditionAssessmentProps = {
  conditionAssessment: ConditionAssessmentType,
  conditionCodes: Array<ConditionCodeType>
} & SubEventComponentProps;

export type ReportProps = {
  report: SubEventComponentNoteType
} & SubEventComponentProps;

export type MaterialDeterminationProps = {
  materialDeterminationList: Array<any>,
  materialDetermination: SubEventComponentNoteType
} & MaterialDeterminationType;

export type NoteProps = {
  note: SubEventComponentNoteType
} & SubEventComponentProps;

export type ConservationSubTypes =
  | TreatmentType
  | TechnicalDescriptionType
  | StorageAndHandlingType
  | HseRiskType
  | ConditionAssessmentType
  | ReportType
  | MaterialDeterminationType
  | MeasurementDeterminationType
  | NoteType;

export type EditableValuesMainEvent = {
  caseNumber: ?string,
  note: ?string,
  actorsAndRoles: ?Array<ActorsAndRoles>
};

export type EditableValuesForm = {
  editable: ?Field<EditableValuesMainEvent | Array<ConservationSubTypes>>
};

export type ConservationCollection = {
  id: number,
  editable: ?number,
  editableValues: any,
  registeredBy?: ?string,
  registeredDate?: ?string,
  updatedBy?: ?string,
  updatedDate?: ?string,
  note?: ?string,
  affectedThings?: ?Array<ObjectInfo>,
  caseNumber?: ?string,
  events: Array<any>,
  actorsAndRoles?: Array<ActorsAndRoles>
};

export type ConservationStoreState = {
  loadingConservation?: boolean,
  conservation?: ?ConservationCollection,
  conservationTypes?: Array<string>
};

export type SavedFile = {
  id: string,
  fid: string,
  title: string,
  fileType: string,
  owner: { ownerId: string, ownerType: string },
  collection: string,
  path: string,
  version: number,
  published: boolean,
  createdStamp: { date: string, by: string },
  documentDetails: { number: number }
};

export type ErrorSaving = {
  error: { status: number, response?: any },
  file: File
};

export type MaybeSelectedObject = {
  objectUUID: string,
  selected: boolean,
  musNo: string,
  term: string
};

export type FormData = {
  id: Field<string>,
  eventTypeId: Field<number>,
  editable: Field<number>,
  expandOnView: Field<boolean>,
  editableValues: Field<string>,
  actorsAndRoles: Field<Array<Person>>,
  registeredBy: Field<string>,
  registeredByName: Field<string>,
  registeredDate: Field<string>,
  note: Field<string>,
  caseNumber: Field<string>,
  affectedThings: Field<Array<string>>,
  objects: Field<Array<ObjectInfo>>,
  updatedBy: Field<string>,
  updatedByName: Field<string>,
  addtionalObjects: Field<Array<string>>,
  singleObjectSelected: Field<string>,
  updatedDate: Field<string>,
  subEventTypes: Field<string>,
  events: Field<Array<ConservationSubTypes>>,
  objectsExpanded: Field<boolean>,
  isUpdated: Field<boolean>
};
