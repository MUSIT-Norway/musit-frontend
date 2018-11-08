import * as React from 'react';
import CoordinateComponent from './CoordinateComponent';
import CoordinateHeader from './CoordinateHeader';
import AdmPlaceComponent from './AdmPlaceComponent';
import { CheckBox } from '../components/CheckBox';

export type AdmPlace = {
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
};

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
  coordinate: Coordinate;
  coordinateRevisionType?: CoordinateRevisionType;
};
export type CoordinateHistory = Array<CoordinateHistoryItem>;

export type CoordinateProps = {
  //coordinateHistory: CoordinateHistory;
  editingCoordinate: Coordinate;
  editCoordinateMode: boolean;
  //coordinateHistoryIndeks: number;
  coordinateCollapsed: boolean;
  coordinateType: string;
  coordinateInvalid: boolean;
  onChangeAltitudeString: (value: string) => void;
  onChangeDepthString: (value: string) => void;
  onChangeCoordinateNumber: (fieldName: string) => (value: number) => void;
  //onSetEditingIndex: (i: number) => void;
  onChangeCoordinateText: (fieldName: string) => (value: string) => void;
  onChangeCoordinateAttributes: (fieldName: string) => (value: string) => void;
  //onChangeHistoryItem: (fieldName: string) => (value: string) => void;
  getCurrentCoordinate: (ind: number) => Coordinate;
  //getCurrentHistoryItem: (ind: number) => CoordinateHistoryItem;
  onChangeCheckBoxBoolean: (fieldName: string) => (value: boolean) => void;
  onClickSaveRevision: () => void;
  onChangeEditMode: (edit: boolean) => void;
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
  coordinate?: Coordinate;
  editingCoordinate: Coordinate;
  editCoordinateMode?: boolean;
  coordinateInvalid: boolean;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
}

export class PlaceState implements PlaceState {
  coordinate?: Coordinate;
  editingCoordinate: Coordinate;
  editCoordinateMode?: boolean;
  coordinateInvalid: boolean;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
  constructor(
    editingCoordinate: Coordinate,
    coordinateInvalid: boolean,
    coordinate?: Coordinate,
    editCoordinateMode?: boolean,
    coordinateCollapsed?: boolean,
    altitudeCollapsed?: boolean
  ) {
    this.coordinate = coordinate;
    this.editingCoordinate = editingCoordinate;
    this.editCoordinateMode = editCoordinateMode;
    this.coordinateInvalid = coordinateInvalid;
    this.coordinateCollapsed = coordinateCollapsed;
    this.altitudeCollapsed = altitudeCollapsed;
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

export type Coordinate = {
  placeUuid?: PlaceUuid;
  admPlace: AdmPlace;
  coordinate: InputCoordinate;
  coordinateAttributes?: InputCoordinateAttribute;
  attributes?: MarinePlaceAttribute;
};

export type nAdmPlace = {
  admPlaceUuid: Uuid;
  name: string;
  type: string;
  path: string;
};
export type InputCoordinate = {
  coordinateUuid?: CoordinateUuid;
  coordinateType?: string;
  datum?: string;
  zone?: string;
  bend?: string;
  coordinateString?: string;
  coordinateGeometry?: string;
};

export type InputCoordinateAttribute = {
  coordAttrUuid?: CoordinateAttrUuid;
  coordinateSource?: string;
  gpsAccuracy?: number;
  addedLater?: boolean;
  coordinateCa?: boolean;
  precision?: number;
  altitudeString?: string;
  altitudeCa?: boolean;
  altitudeFrom?: number;
  altitudeTo?: number;
  altitudeUnit?: string;
  derivedAltitudeMeter?: number;
  depthString?: string;
  depthCa?: boolean;
  depthFrom?: number;
  depthTo?: number;
  depthUnit?: string;
  derivedDepthMeter?: number;
  note?: string;
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
////////////////////////////////////////////////

const PlaceComponent = (
  props: PlaceState & {
    onChange: (value: string) => void;
    onChangeOthers: (field: string) => (value: string) => void;
  } & CoordinateProps
) => {
  return (
    <div className="panel-group">
      <div className="row well form-group">
        <AdmPlaceComponent
          {...props}
          onChangeOthers={props.onChangeOthers}
          onChange={props.onChange}
        />
        <CoordinateHeader {...props} />
        <CoordinateComponent {...props} />
        <div className="row">
          <div className="col-md-10" style={{ textAlign: 'right' }}>
            <CheckBox
              id="CoordinateEditMode"
              checked={props.editCoordinateMode}
              displayValue="Edit mode?"
              onChange={() => props.onChangeEditMode(!props.editCoordinateMode)}
            />
          </div>
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
    </div>
  );
};

export default PlaceComponent;
