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
};

export type Coordinate = {
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
};

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

export type PlaceState = {
  coordinateHistory: CoordinateHistory;
  editingCoordinate: Coordinate;
  coordinateHistoryIndeks: number;
  editCoorditeMode?: boolean;
  coordinateInvalid: boolean;
  admPlace?: AdmPlace;
  locality?: string;
  ecology?: string;
  station?: string;
  sample?: string;
  ship?: string;
  method?: string;
  methodDescription?: string;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
};

export type CoordinateProps = {
  coordinateHistory: CoordinateHistory;
  editingCoordinate: Coordinate;
  editCoordinateMode: boolean;
  coordinateHistoryIndeks: number;
  coordinateCollapsed: boolean;
  coordinateType: string;
  coordinateInvalid: boolean;
  onChangeAltitudeString: (value: string) => void;
  onChangeDepthString: (value: string) => void;
  onChangeCoordinateNumber: (fieldName: string) => (value: number) => void;
  onSetEditingIndex: (i: number) => void;
  onChangeCoordinateText: (fieldName: string) => (value: string) => void;
  onChangeHistoryItem: (fieldName: string) => (value: string) => void;
  getCurrentCoordinate: (ind: number) => Coordinate;
  getCurrentHistoryItem: (ind: number) => CoordinateHistoryItem;
  onChangeCheckBoxBoolean: (fieldName: string) => (value: string | boolean) => void;
  onClickSaveRevision: () => void;
  onClickSaveEdit: () => void;
  onChangeEditMode: (edit: boolean) => void;
  onToggleCollapse: () => void;
};

export type CheckBoxProps = {
  id: string;
  checked: boolean;
  displayValue: string;
  onChange: string;
};

export const PlaceComponent = (
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
