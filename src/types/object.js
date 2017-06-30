// @flow

export type NatLocation = {
  natCountry: ?string,
  natStateProv: ?string,
  natMunicipality: ?string,
  natLocality: ?string,
  natCoordinate: ?string,
  natCoordDatum: ?string,
  natSoneBand: ?string
};

export type ArkCoordinate = {
  projection: ?string,
  precision: ?string,
  north: ?string,
  east: ?string
};

export type ArkLocation = {
  farmName: ?string,
  farmNo: ?number,
  propertyUnitNo: ?string
};

export type EtnoLocation = {
  place: ?string,
  country: ?string,
  region1: ?string,
  region2: ?string,
  area: ?string
};

export type ArkMaterial = {
  material: string,
  spesMaterial: ?string,
  sortering: ?string
};

export type EtnoMaterial = {
  material: string,
  materialType: ?string,
  materialElement: ?string
};
export type Material = EtnoMaterial | ArkMaterial;
export type Location = EtnoLocation | ArkLocation | NatLocation;

/**
 * This is the actual response object from the backend.
 */
export type NamedPathElement = {
  name: string,
  nodeId: number,
  nodeUuid: string
};

/**
 * This is the actual response object from the backend.
 */
export type MusitObject = {
  id: number,
  uuid: string,
  museumId: number,
  museumNo: string,
  subNo?: ?string,
  term: string,
  currentLocationId?: ?string,
  path?: ?string,
  pathNames?: ?Array<NamedPathElement>,
  mainObjectId?: ?number,
  collection?: ?number,
  arkForm?: ?string,
  arkFindingNo?: ?string,
  natStage?: ?string,
  natGender?: ?string,
  natLegDate?: ?string,
  materials?: ?Array<any>,
  locations?: ?Array<any>,
  coordinates?: ?Array<ArkCoordinate>,
  objectType: 'sample' | 'collection'
};

export type ObjectData = {
  // not provided from the backend
  objectId?: ?string,
  objectUUID: string,
  currentLocation: { pathNames: ?Array<NamedPathElement> },
  nodeId: string
} & MusitObject;

export type objectTypeAndId = Array<{ objectType: string, id: string }>;
