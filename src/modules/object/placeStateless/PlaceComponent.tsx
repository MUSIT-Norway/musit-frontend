import * as React from 'react';
import {
  InputCoordinate,
  InputCoordinateAttribute,
  InputPlace,
  DerivedCoordinate
} from '../../../models/object/place';
import CoordinateComponent from './CoordinateComponent';
import CoordinateHeader from './CoordinateHeader';
import AdmPlaceComponent from './AdmPlaceComponent';
import Map from '../mapcomponent/MapComponent';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';
import { EditState, NonEditState } from '../types';
import EditAndSaveButtons from '../components/EditAndSaveButtons';
import config from '../../../config';
import * as Geodesy from 'geodesy';

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
  onCoordinateMGRSKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCoordinateUTMKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCoordinateLatLonKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
  editState: EditState | NonEditState;
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
  editState: EditState | NonEditState;
  constructor(
    admPlace: AdmPlace,
    editingInputCoordinate: InputCoordinate,
    editingCoordinateAttributes: InputCoordinateAttribute,
    editingAttributes: MarinePlaceAttribute,
    coordinateInvalid: boolean,
    editState: EditState | NonEditState,
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
    (this.editState = editState), (this.coordinateCollapsed = coordinateCollapsed);
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

export const coordLatLongStrToDerived: (
  coordStr: string, //Assume like ' 32VNN2345545432 [zone][band][100kmE][100kmN][Easting][Northing]
  coordType: string,
  datum: 'WGS84' | 'ED50'
) => DerivedCoordinate | undefined = (coordStr, coordType, datum) => {
  if (coordType === 'LAT/LONG') {
    let coordStrings = coordStr.split(' ');
    if (coordStrings.length !== 2) {
      coordStrings = coordStr.match(/\d.*?(N|S|E|W)/g) as string[];
    }

    console.log(coordStrings);
    const latStr = coordStrings ? coordStrings[0].trim() : '';
    const longStr = coordStrings ? coordStrings[1].trim() : '';
    const lat = Geodesy.Dms.parseDMS(latStr);
    const long = Geodesy.Dms.parseDMS(longStr);
    const d =
      datum === 'ED50'
        ? Geodesy.LatLonEllipsoidal.datum.ED50
        : datum === 'WGS84'
          ? Geodesy.LatLonEllipsoidal.datum.WGS84
          : undefined;

    const latLng = new Geodesy.LatLonEllipsoidal(lat, long, d);

    let u;
    try {
      u = latLng.toUtm();
    } catch {
      u = {
        easting: undefined,
        northing: undefined
      };
    }

    if (u || latLng) {
      return {
        utmX: u.easting,
        utmY: u.northing,
        lat: latLng.lat,
        lng: latLng.lon
      };
    }
  }
  return undefined;
};

export const coordMGRSStrToDerived: (
  coordStr: string, //Assume like ' 32V NN(-NM) 23455(-34567), 45432(-56789) [zone][band][100kmE][100kmN][Easting][Northing]
  coordType: string,
  datum: 'WGS84' | 'ED50',
  zone?: string,
  band?: string
) => DerivedCoordinate | undefined = (coordStr, coordType, datum, zone, band) => {
  if (coordType === 'MGRS' && coordStr) {
    const parsedCoordStr = coordStr.replace(/^\d\d[A-Z]/i, '');
    const letterPart = parsedCoordStr.match(/[A-Z][A-Z](\-[A-Z][A-Z])?/i);
    let digitPartArr = parsedCoordStr.match(
      /(\d{1}(\-\d{1})?(\,|\s)\d{1}(\-\d{1})?)|(\d{2}(\-\d{2})?(\,|\s)\d{2}(\-\d{2})?)|(\d{3}(\-\d{3})?(\,|\s)\d{3}(\-\d{3})?)|(\d{4}(\-\d{4})?(\,|\s)\d{4}(\-\d{4})?)|(\d{5}(\-\d{5})?(\,|\s)\d{5}(\-\d{5})?)/g
    );
    let eastingAndNorthing = digitPartArr ? digitPartArr[0].trim().split(',') : undefined;
    console.log('Hei');

    if (eastingAndNorthing && eastingAndNorthing.length !== 2) {
      eastingAndNorthing = digitPartArr ? digitPartArr[0].trim().split(' ') : undefined;
    }
    let easting, northing;
    if (eastingAndNorthing && eastingAndNorthing.length === 2) {
      easting = eastingAndNorthing[0];
      northing = eastingAndNorthing[1];
    }
    const eastingArr = easting && easting.split('-');
    const northingArr = northing && northing.split('-');
    const letters = letterPart && letterPart[0];
    const letterArr = letters && letters.split('-');
    const b1 = letterArr && letterArr[0];
    const b2 = letterArr && letterArr[1] ? letterArr[1] : b1;
    const e1 = eastingArr && eastingArr[0] ? eastingArr[0] : '';
    const n1 = northingArr && northingArr[0] ? northingArr[0] : '';

    const e2 = eastingArr && eastingArr[1] ? eastingArr[1] : e1;
    const n2 = northingArr && northingArr[1] ? northingArr[1] : n1;
    const s1 = (zone ? zone : '') + (band ? band : '') + ' ' + b1 + ' ' + e1 + ' ' + n1;

    const s2 =
      (zone ? zone.toString() : '') +
      (band ? band : '') +
      ' ' +
      b2 +
      ' ' +
      +e2 +
      ' ' +
      n2;
    console.log('SQ', s1, s2);

    const m1 = Geodesy.Mgrs.parse(s1);
    const mgrs = new Geodesy.Mgrs(
      m1.zone,
      m1.band,
      m1.e100k,
      m1.n100k,
      m1.easting,
      m1.northing,
      datum
    );

    console.log('MGRS', mgrs);

    const u = mgrs.toUtm();
    const latLng = u.toLatLonE();
    if (u && latLng) {
      return {
        utmX: u.easting,
        utmY: u.northing,
        lat: latLng.lat,
        lng: latLng.lon,
        d1: s1,
        d2: s2
      };
    }
  }
  return undefined;
};

export const toPlaceBackend: (placeState: PlaceState) => InputPlace = (
  placeState: PlaceState
) => {
  return {
    admPlaceUuid: placeState.admPlace ? placeState.admPlace.admPlaceUuid : undefined,
    coordinate: {
      ...placeState.editingInputCoordinate,
      zone:
        placeState.editingInputCoordinate && placeState.editingInputCoordinate.zone
          ? placeState.editingInputCoordinate.zone.toString()
          : undefined
    },
    coordinateAttributes: placeState.editingCoordinateAttribute,
    attributes: placeState.editingAttributes
  };
};

const PlaceComponent = (
  props: PlaceState & {
    onChangeAdmPlace: (value: AdmPlace) => void;
    onChangeOthers: (field: string) => (value: string) => void;
    getAdmPlaceData: (field: string) => (a: AdmPlace) => string;
    setDraftState: (fieldName: string, value: boolean) => void;
    setEditMode: () => void;
    appSession: AppSession;
    history: History;
    readOnly?: boolean;
    isDraft?: boolean;
    showButtonRow?: boolean;
    collectingEventUUid?: string;
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
        {props.editingInputCoordinate &&
          props.editingInputCoordinate.derivedCoordinate && (
            <Map
              coord={
                props.editingInputCoordinate &&
                props.editingInputCoordinate.derivedCoordinate
                  ? {
                      lat:
                        props.editingInputCoordinate &&
                        props.editingInputCoordinate.derivedCoordinate &&
                        props.editingInputCoordinate.derivedCoordinate.lat,
                      lng:
                        props.editingInputCoordinate &&
                        props.editingInputCoordinate.derivedCoordinate &&
                        props.editingInputCoordinate.derivedCoordinate.lng
                    }
                  : undefined
              }
            />
          )}
        <CoordinateHeader {...props} />
        <CoordinateComponent {...props} />

        {props.showButtonRow && (
          <EditAndSaveButtons
            onClickCancel={() => {}}
            onClickEdit={() => {
              const URL = props.collectingEventUUid
                ? config.magasin.urls.client.collectingEvent.edit(
                    props.appSession,
                    props.collectingEventUUid
                  )
                : undefined;
              if (URL) {
                props.setEditMode();
                props.history.push(URL);
              }
            }}
            onClickDraft={() => {}}
            onClickSave={props.onClickSave}
            editButtonState={{ visible: true, disabled: props.readOnly ? false : true }}
            draftButtonState={{
              visible: props.isDraft ? true : false,
              disabled: props.readOnly ? true : props.editState === 'Not editing' || false
            }}
            cancelButtonState={{
              visible: true,
              disabled: props.readOnly ? true : props.editState === 'Not editing' || false
            }}
            saveButtonState={{
              visible: true,
              disabled: props.readOnly ? true : props.editState === 'Not editing' || false
            }}
            saveButtonText="Lagre"
            draftButtonText="Lagre utkast"
            editButtonText="Endre"
            cancelButtonText="Avbryt"
          />
        )}
      </div>
    </div>
  );
};

export default PlaceComponent;
