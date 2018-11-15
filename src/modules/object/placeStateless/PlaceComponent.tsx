import * as React from 'react';
import { InputCoordinate, InputCoordinateAttribute } from '../../../models/object/place';
import CoordinateComponent from './CoordinateComponent';
import CoordinateHeader from './CoordinateHeader';
import AdmPlaceComponent from './AdmPlaceComponent';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';

/* export type AdmPlace = {
  admPlaceId: number;
  name?: string;
  type?: string;
  overordnet?: string;
  kommune?: string;
  fylke?: string;
  land?: string;
  lat?: number;
  long?: number;
  zoom?: number;
  admPlaceUuid?: string;
}; */

/* export type Coordinate = {
  coordinateSource?: string;
  coordinateType?: string;
  coordinateGeomertry?: string;
  coordinatePrecision?: number;
  caAltitude?: boolean;
  gpsAccuracy?: number;
  datum?: string;
  utmZone?: number;
  mgrsBand?: string;
  utmNorthSouth?: string;
  coordinateString?: string;
  caCoordinate?: boolean;
  coordinateAddedLater?: boolean;
  coordinateNote?: string;
  altitudeLow?: number;
  altitudeHigh?: number;
  altitudeAggregated?: string;
  altitudeUnit?: string;
  depthLow?: number;
  depthAggregated?: string;
  depthHigh?: number;
  depthUnit?: string;
  caDepth?: boolean;
  isAddedLater?: boolean;
}; */

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
  onClickSaveRevision: () => void;
  onToggleCollapse: () => void;
};

export type CheckBoxProps = {
  id: string;
  checked: boolean;
  displayValue: string;
  onChange: string;
};

/////////////////////// NEW TYPES MAPPED TO BACKEDN /////////////////////////
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
/*
 // coordinateHistory: nCoordinateHistory;
  // coordinateHistoryIndeks: number;
 
  export type nCoordinateHistoryItem = {
  coordinateId?: number;
  registeredBy?: string;
  registeredDate?: string;
  note?: string;
  coordinate: nCoordinate;
  coordinateRevisionType?: CoordinateRevisionType;
};
export type nCoordinateHistory = Array<nCoordinateHistoryItem>; */

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
    <div className="container panel-group">
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
        <div className="col-md-2" style={{ textAlign: 'right' }}>
          <button
            className="btn btn-default"
            onClick={e => {
              e.preventDefault();
              props.onClickSaveRevision();
            }}
          >
            {props.editCoordinateMode ? 'Save' : 'Save revision'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceComponent;
