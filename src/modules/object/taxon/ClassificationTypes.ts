import { ScientificName } from './TaxonClassification';

export interface IClassification {
  date?: string;
  actors?: string;
  eventType: string;
  eventData: () => string;
}

export interface DetPerson {
  personName?: string;
  personId?: string;
}

export interface IDet {
  detTable: DetPerson[];
  editingIndex?: number;
}
export class Det implements IDet {
  detTable: DetPerson[];
  editingIndex?: number;
  constructor(det: IDet) {
    this.detTable = det.detTable;
    this.editingIndex = det.editingIndex;
  }
  toString() {
    return '';
  }
}

export class Classification implements IClassification {
  date?: string;
  actors?: string;
  eventType: string;
  constructor(eventType: string, date?: string, actors?: string) {
    this.date = date;
    this.actors = actors;
    this.eventType = eventType;
  }
  eventData() {
    return '';
  }
}

export interface ITaxonClassification {
  taxonNames: ITaxonTerm[];
  editingState?: ITaxonTerm;
  editingIndex?: number;
  date?: string;
  note: string;
  det: IDet;
}

export class TaxonClassifiation extends Classification {
  taxonNames: ITaxonTerm[];
  editingState?: ITaxonTerm;
  editingIndex?: number;
  note?: string;
  det: Det;
  constructor(t: ITaxonClassification) {
    super('Taxon', t.date, t.det.toString());
    this.note = t.note;
    this.editingIndex = t.editingIndex;
    this.taxonNames = t.taxonNames;
    this.editingState = t.editingState;
    this.det = t.det;
  }
}

export interface ITaxonTerm {
  taxonName?: ScientificName;
  taxonSuggestion?: ScientificName;
  precisionCode: string | undefined;
  precisionRank: string | undefined;
  infraspesRank: string | undefined;
  infraspesTerm: string | undefined;
}

export class TaxonTerm implements ITaxonTerm {
  taxonName?: ScientificName;
  taxonSuggestion?: ScientificName;
  precisionCode: string | undefined;
  precisionRank: string | undefined;
  infraspesRank: string | undefined;
  infraspesTerm: string | undefined;
  constructor(taxonTerm: ITaxonTerm) {
    this.taxonName = taxonTerm.taxonName;
    this.taxonSuggestion = taxonTerm.taxonSuggestion;
    this.precisionCode = taxonTerm.precisionCode;
    this.precisionRank = taxonTerm.precisionRank;
    this.infraspesRank = taxonTerm.infraspesRank;
    this.infraspesTerm = taxonTerm.infraspesTerm;
  }

  getTaxonTerm(previous?: ScientificName) {
    if (previous) {
      return '';
    } else {
      return 'not previous';
    }
  }
  getTaxonTermWithAuthor(previous: ScientificName) {
    if (previous) {
      return '';
    } else {
      return 'not previous';
    }
  }
}

interface ISexAndStage {
  sex: string | undefined;
  stage: string | undefined;
  count: number;
  estimatedCount: boolean;
}

export class SexAndStage {
  sex: string | undefined;
  stage: string | undefined;
  count: number;
  estimatedCount: boolean;
  constructor(sexAndStage: ISexAndStage) {
    this.sex = sexAndStage.sex;
    this.stage = sexAndStage.stage;
    this.count = sexAndStage.count;
    this.estimatedCount = sexAndStage.estimatedCount;
  }
  toString() {
    return `Sex: ${this.sex} Stage: ${this.stage} Count: ${this.count}${
      this.estimatedCount ? '(est.)' : ''
    }`;
  }
}

export class SexAndStages {
  sexAndStages: SexAndStage[];
  note: string;
  constructor(sexAndStages: SexAndStage[] = [], note: string = '') {
    this.sexAndStages = sexAndStages;
    this.note = note;
  }
}

export class Classifications {
  classifications: (SexAndStages | TaxonClassifiation)[];
  classTypesToShow: { taxonType: boolean; sexAndStageType: boolean };
  currentTaxonClassificationIndex?: number;
  currentTaxonClassification?: TaxonClassifiation;
  currentSexAndStagesClassificationIndex?: number;
  currentSexAndStagesClassification?: SexAndStages;
  constructor(classifications: (SexAndStages | TaxonClassifiation)[] = []) {
    this.classifications = classifications;
  }
  addClassification(newClassification: TaxonClassifiation | SexAndStages) {
    this.classifications = [...this.classifications, newClassification];
    if (newClassification instanceof TaxonClassifiation) {
      this.currentTaxonClassification = newClassification;
      this.currentTaxonClassificationIndex = this.classifications.length - 1;
    } else {
      this.currentSexAndStagesClassification = newClassification;
      this.currentSexAndStagesClassificationIndex = this.classifications.length - 1;
    }
  }

  getTaxonClassifications() {
    return this.classifications.filter(c => c instanceof TaxonClassifiation);
  }

  getSexAndStagesClassifications() {
    return this.classifications.filter(c => c instanceof SexAndStages);
  }
  getLastTaxonClassification() {
    const lastIndex = this.getTaxonClassifications.length - 1;
    return this.getTaxonClassifications[lastIndex];
  }

  getLastSexAndStagesClassification() {
    const lastIndex = this.getSexAndStagesClassifications.length - 1;
    return this.getSexAndStagesClassifications[lastIndex];
  }
}
