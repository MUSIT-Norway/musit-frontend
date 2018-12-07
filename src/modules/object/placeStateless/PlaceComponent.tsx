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
import { CollectingEventMethod } from '../collectingEvent/CollectingEventStore';

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
  showMap?: boolean;
  toggleShowMap: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  selectedCountry?: string;
  admPlace: AdmPlace | null;
  editingInputCoordinate?: InputCoordinate;
  editingCoordinateAttribute?: InputCoordinateAttribute;
  editingAttributes?: MarinePlaceAttribute;
  editCoordinateMode?: boolean;
  coordinateInvalid: boolean;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
  editState: EditState | NonEditState;
  showMap?: boolean;
}

export class PlaceState implements PlaceState {
  placeUuid?: PlaceUuid;
  selectedCountry?: string;
  admPlace: AdmPlace | null;
  editingInputCoordinate?: InputCoordinate;
  editingCoordinateAttribute?: InputCoordinateAttribute;
  editingAttributes?: MarinePlaceAttribute;
  editCoordinateMode?: boolean;
  coordinateInvalid: boolean;
  coordinateCollapsed?: boolean;
  altitudeCollapsed?: boolean;
  editState: EditState | NonEditState;
  showMap?: boolean;
  constructor(
    admPlace: AdmPlace,
    editingInputCoordinate: InputCoordinate,
    editingCoordinateAttributes: InputCoordinateAttribute,
    editingAttributes: MarinePlaceAttribute,
    coordinateInvalid: boolean,
    editState: EditState | NonEditState,
    selectedCountry?: string,
    editCoordinateMode?: boolean,
    coordinateCollapsed?: boolean,
    altitudeCollapsed?: boolean,
    placeUuid?: PlaceUuid,
    showMap?: boolean
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
    this.selectedCountry = selectedCountry;
    this.showMap = showMap;
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
    let str = coordStr;
    let coordStrings = str.split(' ');
    if (coordStrings.length !== 2) {
      coordStrings = str.match(/\d.*?(N|S|E|W)/g) as string[];
    }
    if (coordStrings.length === 2) {
      coordStrings = coordStrings.map(s => s.replace(/\,/, '.'));
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

export const coordUTMStrToDerived: (
  coordStr: string,
  coordType: string,
  datum: 'WGS84' | 'ED50',
  zone?: string,
  NS?: string
) => DerivedCoordinate | undefined = (coordStr, coordType, datum, zone, NS) => {
  if (coordType === 'UTM' && coordStr) {
    const coordArr = coordStr.match(/\d+((\,|\.)\d+)?/g);
    console.log('ARR', coordArr);
    let easting;
    let northing;
    if (coordArr && coordArr.length === 2) {
      easting = Number.parseFloat(coordArr[0]);
      northing = Number.parseFloat(coordArr[1]);
    }
    const parseStr = zone + ' ' + NS + ' ' + easting + ' ' + northing;

    const utm = Geodesy.Utm.parse(parseStr);

    console.log('UTM', parseStr, utm);

    const latLng = utm.toLatLonE();

    if (utm && latLng) {
      return {
        utmX: utm.easting,
        utmY: utm.northing,
        lat: latLng.lat,
        lng: latLng.lon,
        d1: parseStr
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

    const mgrs = Geodesy.Mgrs.parse(s1);

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
    coordinate: placeState.editingInputCoordinate
      ? {
          ...placeState.editingInputCoordinate,
          zone:
            placeState.editingInputCoordinate && placeState.editingInputCoordinate.zone
              ? placeState.editingInputCoordinate.zone.toString()
              : undefined
        }
      : undefined,
    coordinateAttributes: placeState.editingCoordinateAttribute,
    attributes: placeState.editingAttributes
  };
};

export const PlaceView = (props: PlaceState & { onClickEdit: () => void }) => {
  const pathArray =
    props.admPlace && props.admPlace.path ? props.admPlace.path.split(':') : undefined;
  const admPlaceName = pathArray ? pathArray[pathArray.length - 1] : '';
  const country = pathArray ? pathArray[3] : undefined;
  const fylke = pathArray ? pathArray[4] : undefined;
  const kommune = pathArray ? pathArray[5] : undefined;
  const admPlaceString = `${country || ''}${fylke ? ': ' + fylke : ''} ${
    kommune ? ': ' + kommune : ''
  } ${admPlaceName && admPlaceName !== kommune ? ': (' + admPlaceName + ')' : ''}`;
  let altitude =
    props.editingCoordinateAttribute &&
    props.editingCoordinateAttribute.altitudeFrom &&
    props.editingCoordinateAttribute.altitudeFrom.toString();
  altitude =
    altitude &&
    props.editingCoordinateAttribute &&
    props.editingCoordinateAttribute.altitudeTo
      ? altitude + '-' + props.editingCoordinateAttribute.altitudeTo.toString()
      : altitude;
  altitude =
    altitude &&
    props.editingCoordinateAttribute &&
    props.editingCoordinateAttribute.altitudeUnit
      ? altitude + props.editingCoordinateAttribute.altitudeUnit
      : altitude;
  altitude =
    altitude &&
    props.editingCoordinateAttribute &&
    props.editingCoordinateAttribute.altitudeCa
      ? 'Ca.' + altitude
      : altitude;

  let depth =
    props.editingCoordinateAttribute &&
    props.editingCoordinateAttribute.depthFrom &&
    props.editingCoordinateAttribute.depthFrom.toString();
  depth =
    depth && props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthTo
      ? depth + '-' + props.editingCoordinateAttribute.depthTo.toString()
      : depth;
  depth =
    depth &&
    props.editingCoordinateAttribute &&
    props.editingCoordinateAttribute.depthUnit
      ? depth + props.editingCoordinateAttribute.depthUnit
      : depth;
  depth =
    depth && props.editingCoordinateAttribute && props.editingCoordinateAttribute.depthCa
      ? 'Ca.' + depth
      : depth;

  let coordinateString = props.editingInputCoordinate
    ? props.editingInputCoordinate.coordinateString
    : '';
  coordinateString =
    props.editingCoordinateAttribute && props.editingCoordinateAttribute.coordinateCa
      ? 'Ca.' + coordinateString
      : coordinateString;
  coordinateString =
    props.editingCoordinateAttribute && props.editingCoordinateAttribute.addedLater
      ? '[ ' + coordinateString + ' ]'
      : coordinateString;
  if (
    props.editingInputCoordinate &&
    (props.editingInputCoordinate.coordinateType === 'MGRS' ||
      props.editingInputCoordinate.coordinateType === 'UTM')
  ) {
    coordinateString =
      props.editingInputCoordinate.zone && props.editingInputCoordinate.bend
        ? props.editingInputCoordinate.zone +
          props.editingInputCoordinate.bend +
          coordinateString
        : coordinateString;
  }

  const datumStr = props.editingInputCoordinate ? props.editingInputCoordinate.datum : '';
  const coordType = props.editingInputCoordinate
    ? props.editingInputCoordinate.coordinateType
    : '';

  const coordStrLabel = (
    <span>
      {coordType}
      <sub>{datumStr}</sub>
    </span>
  );
  return (
    <div className="container-fluid">
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-1" htmlFor="admPlace">
            Admplace
          </label>
          <div className="col-md-4">
            <div className="form-control-static" id="admPlace">
              {admPlaceString}
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-3">
            <label className="control-label" htmlFor="lokalitet">
              Lokalitet
            </label>
            <div className="form-control-static" id="lokalitet">
              {props.editingAttributes ? props.editingAttributes.locality : ''}
            </div>
          </div>
          <div className="col-md-3">
            <label className="control-label" htmlFor="ecology">
              Økologi
            </label>
            <div className="form-control-static" id="ecology">
              {props.editingAttributes ? props.editingAttributes.ecology : ''}
            </div>
          </div>
          <div className="col-md-2">
            <label className="control-label" htmlFor="station">
              Station
            </label>
            <div className="form-control-static" id="station">
              {props.editingAttributes ? props.editingAttributes.station : ''}
            </div>
          </div>
          <div className="col-md-2">
            <label className="control-label" htmlFor="sample">
              Sample
            </label>
            <div className="form-control-static" id="sample">
              {props.editingAttributes ? props.editingAttributes.sample : ''}
            </div>
          </div>
          <div className="col-md-2">
            <label className="control-label" htmlFor="ship">
              Ship
            </label>
            <div className="form-control-static" id="ship">
              {props.editingAttributes ? props.editingAttributes.ship : ''}
            </div>
          </div>
        </div>
        <hr />
        <div className="form-group row">
          {props.editingInputCoordinate &&
          props.editingInputCoordinate.coordinateType === 'LAT/LONG' ? (
            <div className="col-md-2">
              <label className="control-label" htmlFor="geometry">
                Geometry
              </label>
              <div className="form-control-static" id="datum">
                {props.editingInputCoordinate
                  ? props.editingInputCoordinate.coordinateGeometry
                  : ''}
              </div>
            </div>
          ) : (
            <div>
              <label className="control-label col-md-1" htmlFor="coordStr">
                {coordStrLabel}
              </label>
              <div className="col-md-4">
                <div className="form-control-static" id="coordStr">
                  {coordinateString}
                </div>
              </div>
            </div>
          )}

          <div className="col-md-3">
            <label className="control-label" htmlFor="coordSource">
              Coordinate source
            </label>
            <div className="form-control-static" id="coordSource">
              {props.editingCoordinateAttribute
                ? props.editingCoordinateAttribute.coordinateSource
                : ''}
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-2">
              <label className="control-label" htmlFor="precision">
                Precision
              </label>
              <div className="form-control-static" id="precision">
                {props.editingCoordinateAttribute
                  ? props.editingCoordinateAttribute.precision
                  : ''}
              </div>
            </div>
            <div className="col-md-2">
              <label className="control-label" htmlFor="gpsAccuracy">
                Accuracy
              </label>
              <div className="form-control-static" id="gpsAccuracy">
                {props.editingCoordinateAttribute
                  ? props.editingCoordinateAttribute.gpsAccuracy
                  : ''}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <label className="control-label" htmlFor="altitude">
              Altitude{' '}
            </label>
            <div className="form-control-static" id="altitude">
              {altitude}
            </div>
          </div>
          <div className="col-md-3">
            <label className="control-label" htmlFor="depth">
              Depth
            </label>
            <div className="form-control-static" id="depth">
              {depth}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const PlaceComponent = (
  props: PlaceState & {
    toggleShowMap: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onChangeAdmPlace: (value: AdmPlace) => void;
    onChangeOthers: (field: string) => (value: string) => void;
    getAdmPlaceData: (field: string) => (a: AdmPlace) => string;
    setDraftState: (fieldName: string, value: boolean) => void;
    onSelectCountry: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    setEditMode: () => void;
    methodId?: number;
    onChangeMethod: (methodId: string) => void;
    appSession: AppSession;
    history: History;
    readOnly?: boolean;
    isDraft?: boolean;
    showButtonRow?: boolean;
    collectingEventUUid?: string;
    countries: AdmPlace[];
    collectingEventMethods: CollectingEventMethod[];
  } & CoordinateProps
) => {
  return (
    <div className="container-fluid panel-group">
      <div className="form-group">
        <AdmPlaceComponent
          {...props}
          onChangeOthers={props.onChangeOthers}
          onChange={props.onChangeAdmPlace}
          getAdmPlaceData={props.getAdmPlaceData}
          readOnly={props.readOnly || false}
        />
        <CoordinateHeader {...props} />
        <div className="col-md-10 col-md-offset-2">
          {props.editingInputCoordinate &&
            props.editingInputCoordinate.derivedCoordinate &&
            props.showMap && (
              <Map
                style={{
                  height: '40vh',
                  width: '60%'
                }}
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
        </div>
        <div className="row">
          <div className="col-md-12" />
        </div>
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
