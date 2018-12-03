import { Uuid } from './collectingEvent';
import { Observable } from 'rxjs';
import { simplePost, simpleGet } from '../../shared/RxAjax';
import { Callback, AjaxPost, AjaxGet } from '../../types/ajax';
import { Star } from '../../types/common';
import Config from '../../config';

//export type Uuid = string;
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

export interface OutPlace extends InputPlace {
  placeUuid: PlaceUuid;
  admPlace: AdmPlace;
}

export class inputPlace implements InputPlace {
  placeUuid?: PlaceUuid;
  admPlaceUuid?: AdmPlaceUuid;
  coordinate?: InputCoordinate;
  coordinateAttributes?: InputCoordinateAttribute;
  attributes?: MarinePlaceAttribute;

  constructor(
    placeUuid?: PlaceUuid,
    admPlaceUuid?: AdmPlaceUuid,
    coordinate?: InputCoordinate,
    coordinateAttributes?: InputCoordinateAttribute,
    attributes?: MarinePlaceAttribute
  ) {
    this.placeUuid = placeUuid;
    this.admPlaceUuid = admPlaceUuid;
    this.coordinate = coordinate;
    this.coordinateAttributes = coordinateAttributes;
    this.attributes = attributes;
  }
}

export const addPlace: (
  ajaxPost: AjaxPost<Star>
) => (
  props: {
    token: string;
    data: any;
    callback?: Callback<Star>;
  }
) => Observable<InputPlace> = (ajaxPost = simplePost) => ({ data, token, callback }) => {
  const URL = Config.api.places.addPlaceUrl;
  return ajaxPost(URL, data, token, callback).map(({ response }) => response);
};

export const loadDatum: (
  ajaxGet: AjaxGet<Star>
) => (props: { token: string; callback?: Callback<Star> }) => Observable<Star> = (
  ajaxGet = simpleGet
) => ({ token, callback }) => {
  const URL = Config.api.places.getDatumURL;
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};

export const loadCoordinateTypes: (
  ajaxGet: AjaxGet<Star>
) => (
  props: {
    token: string;
    callback?: Callback<Star>;
  }
) => Observable<Star> = (ajaxGet = simpleGet) => ({ token, callback }) => {
  const URL = Config.api.places.getCoordinateTypesURL;
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};

export const loadCoordinateSources: (
  ajaxGet: AjaxGet<Star>
) => (props: { token: string; callback?: Callback<Star> }) => Observable<Star> = (
  ajaxGet = simpleGet
) => ({ token, callback }) => {
  const URL = Config.api.places.getCoordinateSourceURL;
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};

export const loadGeometryTypes: (
  ajaxGet: AjaxGet<Star>
) => (props: { token: string; callback?: Callback<Star> }) => Observable<Star> = (
  ajaxGet = simpleGet
) => ({ token, callback }) => {
  const URL = Config.api.places.getCoordinateGeometriesURL;
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};

export const loadCountries: (
  ajaxGet: AjaxGet<Star>
) => (props: { token: string; callback?: Callback<Star> }) => Observable<Star> = (
  ajaxGet = simpleGet
) => ({ token, callback }) => {
  const URL = Config.api.places.loadAdmPlaceWithType('land');
  return ajaxGet(URL, token, callback).map(({ response }) => response);
};

export interface InputPlaceWithUuid {
  placeUuid?: PlaceUuid;
  admPlaceUuid?: AdmPlaceUuid;
  coordinateUuid?: CoordinateUuid;
  coordAttrUuid?: CoordinateAttrUuid;
  attributes?: MarinePlaceAttribute;
}

export interface DbPlace {
  placeUuid: PlaceUuid;
  admPlaceUuid?: AdmPlaceUuid;
  coordinateUuid?: CoordinateUuid;
  coordAttrUuid?: CoordinateAttrUuid;
  concatPlace?: string;
  aggrAdmPlace: string;
  aggrCoordinate: string;
  aggrAttribute: string;
}

export interface DbAdmPlace {
  admPlaceUuid: AdmPlaceUuid;
  admPlaceId: number;
  ofType: string;
  partOf?: Uuid;
  partOfId?: number;
  name: string;
  fullPath: string;
}

export type DerivedCoordinate = {
  lat: number;
  lng: number;
  utm33X?: number;
  utm33Y?: number;
  utmX?: number;
  utmY?: number;
  d1?: string;
  d2?: string;
};

export interface InputCoordinate {
  coordinateUuid?: CoordinateUuid;
  coordinateType?: string;
  datum?: string;
  zone?: string;
  bend?: string;
  coordinateString?: string;
  coordinateGeometry?: string;
  derivedCoordinate?: DerivedCoordinate;
}

export interface InputCoordinateAttribute {
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
}

export interface DbCoordinateAttribute extends InputCoordinateAttribute {
  coordAttrUuid: Uuid;
  concatCoordinateAttribute: string;
}

export interface DbCoordinate extends InputCoordinate {
  coordinateUuid: CoordinateAttrUuid;
  concatCoordinate: string;
}

export interface DbAttribute {
  placeAttributeId: number;
  placeUuid: PlaceUuid;
  attributeType: string;
  valueText?: string;
  valueInteger?: number;
  concatAttribute: string;
}

export interface AdmPlace {
  admPlaceUuid: Uuid;
  name: string;
  type: string;
  path: string;
}

export interface MarinePlaceAttribute {
  locality?: string;
  station?: string;
  ecology?: string;
  host?: string;
  sample?: string;
  ship?: string;
  eis?: string;
}
