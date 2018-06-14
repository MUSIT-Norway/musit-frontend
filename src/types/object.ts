// @flow
import { Maybe, Star } from './common';

export type NatLocation = {
  natCountry: Maybe<string>;
  natStateProv: Maybe<string>;
  natMunicipality: Maybe<string>;
  natLocality: Maybe<string>;
  natCoordinate: Maybe<string>;
  natCoordDatum: Maybe<string>;
  natSoneBand: Maybe<string>;
};

export type ArkCoordinate = {
  projection: Maybe<string>;
  precision: Maybe<string>;
  north: Maybe<string>;
  east: Maybe<string>;
};

export type ArkLocation = {
  farmName?: Maybe<string>;
  farmNo?: Maybe<number>;
  propertyUnitNo?: Maybe<string>;
};

export type EtnoLocation = {
  place: Maybe<string>;
  country: Maybe<string>;
  region1: Maybe<string>;
  region2: Maybe<string>;
  area: Maybe<string>;
};

export type ArkMaterial = {
  material: string;
  spesMaterial: Maybe<string>;
  sortering: Maybe<string>;
};

export type EtnoMaterial = {
  material: string;
  materialType: Maybe<string>;
  materialElement: Maybe<string>;
};
export type Material = EtnoMaterial | ArkMaterial;

/**
 * This is the actual response object from the backend.
 */
export type NamedPathElement = {
  name: string;
  nodeId: number;
  nodeUuid: string;
};

/**
 * This is the actual response object from the backend.
 */
export type MusitObject = {
  id: number;
  uuid: string;
  museumId: number;
  museumNo: string;
  subNo?: Maybe<string>;
  term: string;
  currentLocationId?: Maybe<string>;
  path?: Maybe<string>;
  pathNames?: Maybe<Array<NamedPathElement>>;
  mainObjectId?: Maybe<number>;
  collection?: Maybe<number>;
  arkForm?: Maybe<string>;
  arkFindingNo?: Maybe<string>;
  natStage?: Maybe<string>;
  natGender?: Maybe<string>;
  natLegDate?: Maybe<string>;
  materials?: Maybe<Array<Star>>;
  locations?: Maybe<Array<Star>>;
  coordinates?: Maybe<Array<ArkCoordinate>>;
  objectType: 'sample' | 'collection';
};

export type ObjectData = {
  // not provided from the backend
  objectId?: Maybe<string>;
  objectUUID?: Maybe<string>;
  currentLocation?: { pathNames: Maybe<Array<NamedPathElement>> };
  nodeId: string;
} & MusitObject;

export type objectTypeAndId = Array<{ objectType: string; id: string }>;
