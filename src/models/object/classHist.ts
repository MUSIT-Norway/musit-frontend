// Scientificname-types
type Property = {
  Name: string;
  Value: string;
  Properties: Property[];
};

type DynamicProperty = {
  Name: string;
  Value: string;
  Properties: Property[];
};

export type ScientificName = {
  Id: string | null;
  scientificNameID: number;
  taxonID: number;
  scientificName: string;
  scientificNameAuthorship: string;
  taxonRank: string;
  taxonomicStatus: string | null;
  acceptedNameUsage: ScientificName | null;
  higherClassification: ScientificName[];
  nameAccordingTo: string | null;
  dynamicProperties: DynamicProperty[] | null;
};

export interface Taxon {
  scientificName: ScientificName;
  precisionCode?: 'cf' | 'aff';
  precisionRank?: string;
  infraspesificRank?: string;
  infraspesificName?: string;
}

export interface TaxonTable {
  taxonTable: Taxon[];
}

export interface personDet {
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  actorUuid: string;
  actorNameUuid: string;
}

export interface ClassEvent {
  taxon?: TaxonTable;
  det?: personDet;
  detDate?: Date;
  note?: string;
}
