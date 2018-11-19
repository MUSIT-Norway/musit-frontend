import * as React from 'react';
import { InputCoordinate, InputCoordinateAttribute } from '../../../models/object/place';
import CoordinateComponent from './CoordinateComponent';
import CoordinateHeader from './CoordinateHeader';
import AdmPlaceComponent from './AdmPlaceComponent';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';
import { EditState, NonEditState } from '../types';
import EditAndSaveButtons from '../components/EditAndSaveButtons';

export type CoordinateRevisionType =
  | 'newCoordinate'
  | 'coordinateEdit'
  | 'coordinateRevision'
  | 'deleteCoordinate';

export type CoordinateHistoryItem = {
  coordinateId?: number;
  registeredBy?: string;
  registeredDate?: string;
  note?: string;
  //coordinate: Coordinate;
  coordinateRevisionType?: CoordinateRevisionType;
};
export type CoordinateHistory = Array<CoordinateHistoryItem>;

export type CoordinateProps = {
  //coordinateHistory: CoordinateHistory;
  editingInputCoordinate?: InputCoordinate;
  coordinatePredefined: {
    coordinateSourceTypes: { source: string }[] | null;
    coordinatDatumTypes: { datum: string }[] | null;
    coordinateGeometryTypes: { geometry: string }[] | null;
    coordinateTypes: { type_text: string }[] | null;
  };
  editingCoordinateAttribute?: InputCoordinateAttribute;
  editingAttributes?: MarinePlaceAttribute;
  editCoordinateMode: boolean;
  //coordinateHistoryIndeks: number;
  coordinateCollapsed: boolean;
  coordinateType: string;
  coordinateInvalid: boolean;
  readOnly: boolean;
  onChangeAltitudeString: (value: string) => void;
  onChangeDepthString: (value: string) => void;
  onChangeCoordinateNumber: (fieldName: string) => (value: number) => void;
  //onSetEditingIndex: (i: number) => void;
  onChangeCoordinateText: (fieldName: string) => (value: string) => void;
  onChangeCoordinateAttributes: (fieldName: string) => (value: string) => void;
  onChangeNumberCoordinateAttributes: (fieldName: string) => (value: number) => void;
  //onChangeHistoryItem: (fieldName: string) => (value: string) => void;
  getCurrentCoordinate: (ind: number) => InputPlace;
  //getCurrentHistoryItem: (ind: number) => CoordinateHistoryItem;
  onChangeCheckBoxBoolean: (fieldName: string) => (value: boolean) => void;
  onClickSave: () => void;
  //onChangeEditMode: (edit: boolean) => void;
  onToggleCollapse: () => void;
};

export type CheckBoxProps = {
  id: string;
  checked: boolean;
  displayValue: string;
  onChange: string;
};

/////////////////////// NEW TYPES MAPPED TO BACKEND /////////////////////////
export type Uuid = string;
export type PlaceUuid = Uuid;
export type AdmPlaceUuid = Uuid;
export type CoordinateUuid = Uuid;
export type CoordinateAttrUuid = Uuid;

export interface InputPlace {
  placeUuid?: PlaceUuid;
  admPlaceUuid?: AdmPlaceUuid;
  coordinate?: InputCoordinate;
  coordinateAttributes?: InputCoordinateAttribute;
  attributes?: MarinePlaceAttribute;
}

export interface PlaceState {
  placeUuid?: PlaceUuid;
  admPlace: AdmPlace | null;
  editingInputCoordinate?: InputCoordinate;
  editingCoordinateAttribute?: InputCoordinateAttribute;
  editingAttributes?: MarinePlaceAttribute;
  editCoordinateMode?: boolean;
  coordinateInvalid: boolean;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
  editState?: EditState | NonEditState;
}

export class PlaceState implements PlaceState {
  placeUuid?: PlaceUuid;
  admPlace: AdmPlace | null;
  editingInputCoordinate?: InputCoordinate;
  editingCoordinateAttribute?: InputCoordinateAttribute;
  editingAttributes?: MarinePlaceAttribute;
  editCoordinateMode?: boolean;
  coordinateInvalid: boolean;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
  constructor(
    admPlace: AdmPlace,
    editingInputCoordinate: InputCoordinate,
    editingCoordinateAttributes: InputCoordinateAttribute,
    editingAttributes: MarinePlaceAttribute,
    coordinateInvalid: boolean,
    editCoordinateMode?: boolean,
    coordinateCollapsed?: boolean,
    altitudeCollapsed?: boolean,
    placeUuid?: PlaceUuid
  ) {
    this.admPlace = admPlace;
    this.editingInputCoordinate = editingInputCoordinate;
    this.editingCoordinateAttribute = editingCoordinateAttributes;
    this.editingAttributes = editingAttributes;
    this.editCoordinateMode = editCoordinateMode;
    this.coordinateInvalid = coordinateInvalid;
    this.coordinateCollapsed = coordinateCollapsed;
    this.altitudeCollapsed = altitudeCollapsed;
    this.placeUuid = placeUuid;
  }
}

export type AdmPlace = {
  admPlaceUuid: Uuid;
  name: string;
  type: string;
  path: string;
};

export type MarinePlaceAttribute = {
  locality?: string;
  station?: string;
  ecology?: string;
  host?: string;
  sample?: string;
  ship?: string;
  eis?: string;
};

const PlaceComponent = (
  props: PlaceState & {
    onChangeAdmPlace: (value: AdmPlace) => void;
    onChangeOthers: (field: string) => (value: string) => void;
    getAdmPlaceData: (field: string) => (a: AdmPlace) => string;
    appSession: AppSession;
    history: History;
    readOnly?: boolean;
  } & CoordinateProps
) => {
  return (
    <div className="container-fluid panel-group">
      <div className="row form-group">
        <AdmPlaceComponent
          {...props}
          onChangeOthers={props.onChangeOthers}
          onChange={props.onChangeAdmPlace}
          getAdmPlaceData={props.getAdmPlaceData}
          readOnly={props.readOnly || false}
        />
        <CoordinateHeader {...props} />
        <CoordinateComponent {...props} />
        <EditAndSaveButtons
          onClickCancel={() => {}}
          onClickEdit={() => {}}
          onClickSave={() => {}}
          editButtonState={{ visible: true, disabled: props.readOnly ? false : true }}
          cancelButtonState={{ visible: true, disabled: props.readOnly ? true : false }}
          saveButtonState={{ visible: true, disabled: props.readOnly ? true : false }}
          saveButtonText="Lagre"
          editButtonText="Endre"
          cancelButtonText="Avbryt"
        />
      </div>
    </div>
  );
};

export default PlaceComponent;
