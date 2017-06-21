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

export type ObjectData = {
  id: number,
  nodeId: string,
  mainObjectId: number,
  uuid: string,
  objectId: ?string,
  objectUUID: string,
  objectType: string,
  collection: number,
  subNo: string,
  term: string,
  museumNo: string,
  arkForm: ?string,
  arkFindingNo: ?string,
  natStage: ?string,
  natGender: ?string,
  natLegDate: ?string,
  materials: ?Array<any>,
  locations: ?Array<any>,
  currentLocation: { pathNames: Array<any> },
  coordinates: ?Array<ArkCoordinate>
};

export type ObjectProps = {
  id: number,
  museumId: {},
  collectionId: {},
  token: string,
  callBack: any
};

export type objectTypeAndId = Array<{ objectType: string, id: string }>;
