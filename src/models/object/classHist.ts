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

export interface Det {
  firstName?: string;
  lastName?: string;
  title?: string;
  nameString: string;
}

export interface ClassEvent {
  taxon?: TaxonTable;
  det?: Det;
  detDate?: Date;
  note?: string;
}
