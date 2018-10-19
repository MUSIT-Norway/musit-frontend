import * as React from 'react';
import { ClassificationHistoryTable } from './ClassificationHistoryTable';
import { SexAndStagesComponent } from './SexAndStagesComponent';
import { TaxonComponent } from './TaxonComponent';
import { ScientificName, personDet } from '../../../models/object/classHist';
import { Collapse } from 'react-bootstrap';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';
//import EditableTable from '../components/EditableTable';

// Datastructure
export interface IPersonName {
  personNameId?: string;
  personUuid?: string;
  personName?: string;
}

interface IDet {
  personNames?: IPersonName[];
  editingDet?: IPersonName;
  editingIndex?: number;
}

class Det {
  personNames?: IPersonName[];
  editingDet?: IPersonName;
  editingIndex?: number;
  constructor(d: IDet) {
    this.personNames = d.personNames;
    this.editingDet = d.editingDet;
    this.editingIndex = d.editingIndex;
  }
}

export type DetProps = IDet & {
  appSession: AppSession;
  history: History;
  onAddPerson: () => void;
  onSavePerson: () => void;
  onDeletePerson: (i: number) => void;
  setDetEditingIndex: (i: number) => void;
  //onChangePerson: (field: string) => (value: string) => void;
  onChangePersonDet: (suggestion: personDet) => void;
};

export interface ITaxonTerm {
  scientificName?: ScientificName;
  taxonSuggestion?: ScientificName;
  precisionCode?: 'cf' | 'aff';
  precisionRank?: string;
}

class TaxonTerm implements ITaxonTerm {
  scientificName?: ScientificName;
  taxonSuggestion?: ScientificName;
  precisionCode?: 'cf' | 'aff';
  precisionRank?: string;
  constructor(term: ITaxonTerm) {
    this.scientificName = term.scientificName;
    this.taxonSuggestion = term.taxonSuggestion;
    this.precisionCode = term.precisionCode;
    this.precisionRank = term.precisionCode
      ? term.taxonSuggestion && term.taxonSuggestion.taxonRank
      : '';
    console.log('Rank:', this.precisionRank, term.scientificName || term.taxonSuggestion);
  }
}
interface ITaxonClassification {
  taxonNames?: ITaxonTerm[];
  editingName?: ITaxonTerm;
  editingIndex?: number;
  det: IDet;
  infraspesRank?: string;
  infraSpesName?: string;
  note?: string;
  getEventType?: () => string;
  getEventData?: () => string;
  getPersonData?: () => string;
  getDate?: () => string;
}

export class TaxonClassification implements ITaxonClassification {
  taxonNames?: ITaxonTerm[];
  editingName?: ITaxonTerm;
  editingIndex?: number;
  det: IDet;
  infraspesRank?: string;
  infraSpesName?: string;
  note?: string;
  constructor(taxonClass: ITaxonClassification) {
    this.taxonNames = (taxonClass.taxonNames || []).map(
      (t: ITaxonTerm) => new TaxonTerm(t)
    );
    this.det = new Det(taxonClass.det);
    this.editingIndex = taxonClass.editingIndex;
    this.editingName = taxonClass.editingName;
    this.infraSpesName = taxonClass.infraSpesName;
    this.infraspesRank = taxonClass.infraspesRank;
    this.note = taxonClass.note;
  }

  getEventType() {
    return 'Taxon';
  }
  getEventData() {
    return (this.taxonNames || []).reduce((pr: string, curr: ITaxonTerm) => {
      if (pr === '') {
        return curr && curr.taxonSuggestion ? curr.taxonSuggestion.scientificName : '';
      }
      return pr + ' x ' + curr && curr.taxonSuggestion
        ? curr.taxonSuggestion.scientificName
        : '';
    }, '');
  }
  getPersonData() {
    return 'Pettersen, Per, Olsen, Egil Drillo';
  }
  getDate() {
    return '2017-01-01';
  }
}

interface ISexAndStage {
  sex?: string;
  stage?: string;
  count?: number;
  estimatedCount?: boolean;
}

export class SexAndStage implements ISexAndStage {
  sex?: string;
  stage?: string;
  count?: number;
  estimatedCount?: boolean;
  constructor(s: ISexAndStage) {
    this.sex = s.sex;
    this.stage = s.stage;
    this.count = s.count;
    this.estimatedCount = s.estimatedCount;
  }
  getSexTerm() {
    switch (this.sex) {
      case 'm': {
        return 'male';
      }
      case 'f': {
        return 'female';
      }
      case 'h': {
        return 'hermaphrodite';
      }
      case 'd': {
        return 'doubtful gender';
      }
      case 'u': {
        return 'unknown';
      }
      default: {
        return 'unknown';
      }
    }
  }
  getStageTerm() {
    switch (this.stage) {
      case 'e': {
        return 'egg';
      }
      case 'l': {
        return 'larvae';
      }
      case 'p': {
        return 'pupae';
      }
      case 'x': {
        return 'pupae exuviae';
      }
      case 's': {
        return 'subimago';
      }

      case 'j': {
        return 'juvenile';
      }

      case 'n': {
        return 'nymph';
      }

      case 'a': {
        return 'adult';
      }

      case 'u': {
        return 'unknown';
      }
      default: {
        return 'unknown';
      }
    }
  }
}

interface ISexAndStagesClassification {
  sexAndStages?: ISexAndStage[];
  editingSexAndStage?: ISexAndStage;
  editingIndex?: number;
  det?: IDet;
  note?: string;
  getEventType?: () => string;
  getEventData?: () => string;
  getPersonData?: () => string;
  getDate?: () => string;
}

export type SexAndLifeStageProps = ISexAndStagesClassification & {
  onChangeNoteField: (value: string) => void;
  onAddSexAndLifeStage: () => void;
  onSaveSexAndLifeStage: () => void;
  setEditingIndex: (i: number) => void;
  onDelete: (i: number) => void;
  onChangeBooleanValue: (index: number) => (fieldName: string) => void;
  onChangeSexAndLifeStageField: (fieldName: string) => (value: string | number) => void;
};

export type TaxonClassificationProps = ITaxonClassification & {
  appSession: AppSession;
  history: History;
  setEditingIndex: (i: number) => void;
  onChangeTaxonField: (fieldName: string) => (value: string) => void;
  onChangeTaxonClassificationFields: (fieldName: string) => (value: string) => void;
  onChangeSuggests: (v: any) => void;
  onAddTaxon: () => void;
  onSaveTaxonTerm: () => void;
  onAddPerson: () => void;
  onSavePerson: () => void;
  onDeletePerson: (i: number) => void;
  onDeleteTaxon: (i: number) => void;
  onChangeTaxonSuggest: (suggestion: ScientificName) => void;
  //onCreateNewTaxonRevision: () => void;
  setDetEditingIndex: (i: number) => void;
  //onChangePerson: (field: string) => (value: string) => void;
  onChangePersonDet: (suggestion: personDet) => void;
};

export type TaxonClassificationsSubProps = {
  onChangeTaxonClassificationFields: (fieldName: string) => (value: string) => void;
};

export class SexAndStagesClassification implements ISexAndStagesClassification {
  sexAndStages?: ISexAndStage[];
  editingSexAndStage?: ISexAndStage;
  editingIndex?: number;
  det?: IDet;
  note?: string;
  constructor(sexAndStagesClass: ISexAndStagesClassification) {
    this.sexAndStages = (sexAndStagesClass.sexAndStages || []).map(
      (s: ISexAndStage) => new SexAndStage(s)
    );
    this.editingIndex = sexAndStagesClass.editingIndex;
    this.editingSexAndStage = sexAndStagesClass.editingSexAndStage;
    this.det = sexAndStagesClass.det ? new Det(sexAndStagesClass.det) : undefined;
    this.note = sexAndStagesClass.note;
  }

  getEventType() {
    return 'SexAndStages';
  }
  getEventData() {
    return '3M, 4J, ?';
  }
  getPersonData() {
    return 'Pettersen, Per, Olsen, Egil Drillo';
  }
  getDate() {
    return '2017-01-01';
  }
}

export interface IClassifications {
  classifications: (ITaxonClassification | ISexAndStagesClassification)[];
  currentTaxonClassificationIndex: number;
  currentSexAndStagesClassificationIndex: number;
}

export class Classifications implements IClassifications {
  classifications: (ITaxonClassification | ISexAndStagesClassification)[];
  currentTaxonClassificationIndex: number;
  currentSexAndStagesClassificationIndex: number;
  constructor(c: IClassifications) {
    this.classifications = c.classifications.map(
      (m: ITaxonClassification | ISexAndStagesClassification) => {
        if (m instanceof TaxonClassification) {
          return new TaxonClassification(m);
        } else if (m instanceof SexAndStagesClassification) {
          return new SexAndStagesClassification(m);
        } else {
          throw new Error('Should never get here');
        }
      }
    );
    this.currentTaxonClassificationIndex = c.currentTaxonClassificationIndex;
    this.currentSexAndStagesClassificationIndex =
      c.currentSexAndStagesClassificationIndex;
  }
  currentTaxonClassification() {
    return this.classifications[
      this.currentTaxonClassificationIndex
    ] as ITaxonClassification;
  }
  currentSexAndStagesClassification() {
    return this.classifications[
      this.currentSexAndStagesClassificationIndex
    ] as ISexAndStagesClassification;
  }
}

interface IClassificationsToShow {
  taxon: boolean;
  sexAndStages: boolean;
}

interface IState {
  classifications: IClassifications;
  classificationsToShow: IClassificationsToShow;
  sexAndStagesExpanded: Boolean;
}

class State implements IState {
  classifications: Classifications;
  classificationsToShow: IClassificationsToShow;
  sexAndStagesExpanded: Boolean;
  constructor(s: IState) {
    this.classifications = new Classifications(s.classifications);
    this.classificationsToShow = s.classificationsToShow;
    this.sexAndStagesExpanded = s.sexAndStagesExpanded;
  }
}

type Props = { appSession: AppSession; history: History };

export default class ClassificationComponent extends React.Component<Props, IState> {
  constructor(props: Props) {
    const c = {
      sexAndStagesExpanded: false,
      classifications: {
        classifications: [
          new TaxonClassification({
            editingIndex: 0,
            editingName: {},
            det: { editingIndex: 0, editingDet: {} }
          }),
          new SexAndStagesClassification({
            editingIndex: 0,
            editingSexAndStage: {}
          })
        ],
        currentTaxonClassificationIndex: 0,
        currentSexAndStagesClassificationIndex: 1
      },
      classificationsToShow: {
        taxon: true,
        sexAndStages: false
      }
    };
    super(props);
    console.log('IN taxon ', props);
    this.state = new State(c);
    this.getFullHybridName = this.getFullHybridName.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  getFullHybridName() {
    return '';
  }

  onCreateNewTaxonRevision() {
    this.setState((ps: State) => {
      const emptyTaxonRevision: ITaxonClassification = {
        taxonNames: [{}],
        editingIndex: 0,
        editingName: {},
        note: '',
        det: new Det({ personNames: [{}], editingDet: {}, editingIndex: 0 })
      };
      const newTaxonRevision = new TaxonClassification(emptyTaxonRevision);
      const newClassifications = [
        ...ps.classifications.classifications,
        newTaxonRevision
      ];
      const currentTaxonClassificationIndex = newClassifications.length - 1;
      const currentSexAndStagesClassificationIndex =
        ps.classifications.currentSexAndStagesClassificationIndex;

      return {
        ...ps,
        classifications: new Classifications({
          classifications: newClassifications,
          currentSexAndStagesClassificationIndex,
          currentTaxonClassificationIndex
        })
      };
    });
  }

  onToggle() {
    this.setState((ps: State) => {
      const expand = !ps.classificationsToShow.sexAndStages;
      const claToShow = ps.classificationsToShow;
      const updClaToShow = {
        ...claToShow,
        sexAndStages: expand
      };

      return {
        ...ps,
        classificationsToShow: updClaToShow
      };
    });
  }

  render() {
    return (
      <div
        style={{
          paddingTop: '30px',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="well">
              <h3>Taxon</h3>
              <TaxonComponent
                {...(this.state
                  .classifications as Classifications).currentTaxonClassification()}
                /* onCreateNewTaxonRevision={() => {
                  this.setState((ps: State) => {
                    const emptyTaxonRevision: ITaxonClassification = {
                      taxonNames: [{}],
                      editingIndex: 0,
                      editingName: {},
                      note: '',
                      det: new Det({ personNames: [{}], editingDet: {}, editingIndex: 0 })
                    };
                    const newTaxonRevision = new TaxonClassification(emptyTaxonRevision);
                    const newClassifications = [
                      ...ps.classifications.classifications,
                      newTaxonRevision
                    ];
                    const currentTaxonClassificationIndex = newClassifications.length - 1;
                    const currentSexAndStagesClassificationIndex =
                      ps.classifications.currentSexAndStagesClassificationIndex;

                    return {
                      ...ps,
                      classifications: new Classifications({
                        classifications: newClassifications,
                        currentSexAndStagesClassificationIndex,
                        currentTaxonClassificationIndex
                      })
                    };
                  });
                }} */
                appSession={this.props.appSession}
                history={this.props.history}
                onAddTaxon={() => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as ITaxonClassification;
                    const currentClassificationArray = ps.classifications.classifications;
                    const currentTaxonNames = currentClassification.taxonNames || [];
                    const newTaxonName = new TaxonTerm({});
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      editingIndex: currentTaxonNames.length,
                      editingName: newTaxonName
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                onSaveTaxonTerm={() => {
                  this.setState((ps: State) => {
                    const currentClassificationArray = ps.classifications.classifications;
                    const classificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.currentTaxonClassification();
                    const currentEditingClassTerm =
                      currentClassification.editingName || {};

                    const editingIndex =
                      currentClassification.editingIndex !== undefined
                        ? currentClassification.editingIndex
                        : 0;

                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      taxonNames: [
                        ...(currentClassification.taxonNames || []).slice(
                          0,
                          editingIndex
                        ),
                        currentEditingClassTerm,
                        ...(currentClassification.taxonNames || []).slice(
                          editingIndex + 1
                        )
                      ],
                      editingIndex: undefined,
                      editingName: undefined
                    });
                    const newClassifications = new Classifications({
                      ...ps.classifications,
                      classifications: [
                        ...currentClassificationArray.slice(0, classificationIndex),
                        newClassification,
                        ...currentClassificationArray.slice(classificationIndex + 1)
                      ]
                    });

                    return { ...ps, classifications: newClassifications };
                  });
                }}
                onChangeTaxonSuggest={(suggestion?: ScientificName) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentClassificationArray = ps.classifications.classifications;
                    const currentTaxName = currentClassification.editingName;
                    const newTaxName = new TaxonTerm({
                      ...currentTaxName,
                      taxonSuggestion: suggestion
                    });

                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      editingName: newTaxName
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                onChangeTaxonClassificationFields={(fieldName: string) => (
                  value: any
                ) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentClassificationArray = ps.classifications.classifications;
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      [fieldName]: value
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];
                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                setEditingIndex={(index: number) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;

                    const currentClassificationArray = ps.classifications.classifications;
                    const editingName = currentClassification.taxonNames
                      ? currentClassification.taxonNames[index]
                      : undefined;
                    if (editingName === undefined) {
                      throw new Error('Empty taxon term table when setting index');
                    }
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      editingIndex: index,
                      editingName
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                onChangeTaxonField={(fieldName: string) => (value: any) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;

                    const currentClassificationArray = ps.classifications.classifications;
                    const currentTaxonTerm = currentClassification.editingName || {};
                    const newTerm = new TaxonTerm({
                      ...currentTaxonTerm,
                      [fieldName]: value
                    });

                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      editingName: newTerm
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                onChangeSuggests={(nv: any) =>
                  this.setState((ps: State) => ({
                    ...ps,
                    nv
                  }))
                }
                setDetEditingIndex={(i: number) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentDet = currentClassification.det;
                    const newEditingDet =
                      currentDet.personNames && currentDet.personNames[i];
                    const newDet = new Det({
                      ...currentDet,
                      editingIndex: i,
                      editingDet: newEditingDet
                    });
                    const currentClassificationArray = ps.classifications.classifications;
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      det: newDet
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                onDeletePerson={(i: number) => {
                  this.setState((ps: State) => {
                    console.log('before delete', ps, i);
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentDet = currentClassification.det;
                    const currentPersonNames = currentDet.personNames || [];
                    const newDet = new Det({
                      ...currentDet,
                      personNames:
                        currentPersonNames.length === 1
                          ? undefined
                          : [
                              ...currentPersonNames.slice(0, i),
                              ...currentPersonNames.slice(i + 1)
                            ],
                      editingIndex: currentPersonNames.length === 1 ? 0 : i,
                      editingDet: currentPersonNames.length === 1 ? {} : undefined
                    });
                    console.log('after delete', newDet, newDet.editingIndex);
                    const currentClassificationArray = ps.classifications.classifications;
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      det: newDet
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                onSavePerson={() =>
                  this.setState((ps: State) => {
                    const currentRevision = ps.classifications.classifications[
                      ps.classifications.currentTaxonClassificationIndex
                    ] as ITaxonClassification;
                    const currentDet = currentRevision.det;
                    const currentEditingIndex = currentDet.editingIndex;
                    const currentEditingDet = currentDet.editingDet;
                    const currentPersonNames = currentDet.personNames || [];
                    console.log(
                      'anuradha on save person',
                      currentEditingIndex,
                      currentEditingDet
                    );
                    const newPersonTable =
                      currentEditingDet && currentEditingIndex !== undefined
                        ? [
                            ...currentPersonNames.slice(0, currentEditingIndex),
                            currentEditingDet,
                            ...currentPersonNames.slice(currentEditingIndex + 1)
                          ]
                        : currentPersonNames;

                    const newDet = new Det({
                      ...currentDet,
                      personNames: newPersonTable,
                      editingDet: undefined,
                      editingIndex: undefined
                    });
                    const newRevision = new TaxonClassification({
                      ...currentRevision,
                      det: newDet
                    });
                    const newClassifications = [
                      ...ps.classifications.classifications.slice(
                        0,
                        ps.classifications.currentTaxonClassificationIndex
                      ),
                      newRevision,
                      ...ps.classifications.classifications.slice(
                        ps.classifications.currentTaxonClassificationIndex + 1
                      )
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassifications
                      })
                    };
                  })
                }
                onAddPerson={() => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentDet = currentClassification.det;
                    const currentPersonNames =
                      currentClassification.det.personNames || [];
                    const newDet = new Det({
                      ...currentDet,
                      editingIndex: currentPersonNames.length,
                      editingDet: {}
                    });
                    const currentClassificationArray = ps.classifications.classifications;
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      det: newDet
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                /* onChangePerson={(field: string) => (value: string) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentDet = currentClassification.det;
                    const currentPerson = currentDet.editingDet || {};
                    const newPerson = { ...currentPerson, [field]: value };
                    const newDet = new Det({
                      ...currentDet,
                      editingDet: newPerson
                    });
                    const currentClassificationArray = ps.classifications.classifications;
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      det: newDet
                    });
                    console.log('NC - onchangeperson', newClassification);
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }} */
                onChangePersonDet={(suggestion: personDet) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentDet = currentClassification.det;
                    const newDet = new Det({
                      ...currentDet,
                      editingDet: {
                        personNameId: suggestion ? suggestion.personNameUuid : '',
                        personUuid: suggestion ? suggestion.personUuid : '',
                        personName: suggestion ? suggestion.name : ''
                      }
                    });
                    const currentClassificationArray = ps.classifications.classifications;
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      det: newDet
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
                onDeleteTaxon={(i: number) => {
                  this.setState((ps: State) => {
                    const currentClassificationIndex =
                      ps.classifications.currentTaxonClassificationIndex;
                    const currentClassification = ps.classifications.classifications[
                      currentClassificationIndex
                    ] as TaxonClassification;
                    const currentClassificationArray = ps.classifications.classifications;
                    const currentTaxonNames = currentClassification.taxonNames;
                    if (currentTaxonNames === undefined) {
                      throw new Error('Undefined taxterm array');
                    }
                    const newTaxonNames =
                      currentTaxonNames.length === 1
                        ? undefined
                        : [
                            ...currentTaxonNames.slice(0, i),
                            ...currentTaxonNames.slice(i + 1)
                          ];
                    const newClassification = new TaxonClassification({
                      ...currentClassification,
                      taxonNames: newTaxonNames,
                      editingIndex: currentTaxonNames.length === 1 ? 0 : i - 1,
                      editingName:
                        currentTaxonNames.length === 1 ? {} : currentTaxonNames[i]
                    });
                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentClassificationIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentClassificationIndex + 1)
                    ];

                    return {
                      ...ps,
                      classifications: new Classifications({
                        ...ps.classifications,
                        classifications: newClassArray
                      })
                    };
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="row">
            <div className="col-md-12">
              <div className="well">
                <ClassificationHistoryTable {...this.state.classifications} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="well">
                <div className="row">
                  <div className="col-md-5">
                    <h3>Sex and stages</h3>
                  </div>
                  <div className="col-md-5" />
                  <div className="col-md-2" />
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.onToggle}
                  >
                    {this.state.classificationsToShow.sexAndStages
                      ? 'Collapse'
                      : 'Expand'}
                  </button>
                </div>
                <Collapse in={this.state.classificationsToShow.sexAndStages}>
                  <div className="row">
                    <SexAndStagesComponent
                      {...(this.state
                        .classifications as Classifications).currentSexAndStagesClassification()}
                      onChangeNoteField={(value: string) => {
                        this.setState((ps: State) => {
                          const currentSexAndStageIndex =
                            ps.classifications.currentSexAndStagesClassificationIndex;
                          const currentSexAndStagesClassification = ps.classifications
                            .classifications[
                            currentSexAndStageIndex
                          ] as ISexAndStagesClassification;
                          const newCurrentSexAndStagesClassification = new SexAndStagesClassification(
                            {
                              ...currentSexAndStagesClassification,
                              note: value
                            }
                          );
                          const newCurrentClassification = new Classifications({
                            ...ps.classifications,
                            classifications: [
                              ...ps.classifications.classifications.slice(
                                0,
                                currentSexAndStageIndex
                              ),
                              newCurrentSexAndStagesClassification,
                              ...ps.classifications.classifications.slice(
                                currentSexAndStageIndex + 1
                              )
                            ]
                          });

                          return {
                            ...ps,
                            classifications: newCurrentClassification
                          };
                        });
                      }}
                      setEditingIndex={(index: number) => {
                        this.setState((ps: State) => {
                          const currentSexAndStageIndex =
                            ps.classifications.currentSexAndStagesClassificationIndex;

                          const currentSexAndStagesClassification = ps.classifications
                            .classifications[
                            currentSexAndStageIndex
                          ] as ISexAndStagesClassification;

                          const currentClassificationArray =
                            ps.classifications.classifications;
                          const editingSexAndStage = currentSexAndStagesClassification.sexAndStages
                            ? currentSexAndStagesClassification.sexAndStages[index]
                            : undefined;

                          if (editingSexAndStage === undefined) {
                            throw new Error('Empty taxon term table when setting index');
                          }

                          const newClassification = new SexAndStagesClassification({
                            ...currentSexAndStagesClassification,
                            editingIndex: index,
                            editingSexAndStage
                          });
                          const newClassArray = [
                            ...currentClassificationArray.slice(
                              0,
                              currentSexAndStageIndex
                            ),
                            newClassification,
                            ...currentClassificationArray.slice(
                              currentSexAndStageIndex + 1
                            )
                          ];

                          return {
                            ...ps,
                            classifications: new Classifications({
                              ...ps.classifications,
                              classifications: newClassArray
                            })
                          };
                        });
                      }}
                      onChangeBooleanValue={(index: number) => (fieldName: string) => {
                        this.setState((ps: State) => {
                          const currentSexAndStageIndex =
                            ps.classifications.currentSexAndStagesClassificationIndex;
                          const currentSexAndStagesClassification = ps.classifications
                            .classifications[
                            currentSexAndStageIndex
                          ] as ISexAndStagesClassification;
                          const editingSexAndStage =
                            currentSexAndStagesClassification.editingSexAndStage;
                          const newSexAndStage = new SexAndStage({
                            ...editingSexAndStage,
                            [fieldName]:
                              editingSexAndStage && editingSexAndStage[fieldName]
                                ? false
                                : true
                          });
                          const newCurrentSexAndStagesClassification = new SexAndStagesClassification(
                            {
                              ...currentSexAndStagesClassification,
                              editingSexAndStage: newSexAndStage
                            }
                          );
                          const newCurrentClassification = new Classifications({
                            ...ps.classifications,
                            classifications: [
                              ...ps.classifications.classifications.slice(
                                0,
                                currentSexAndStageIndex
                              ),
                              newCurrentSexAndStagesClassification,
                              ...ps.classifications.classifications.slice(
                                currentSexAndStageIndex + 1
                              )
                            ]
                          });
                          return {
                            ...ps,
                            classifications: newCurrentClassification
                          };
                        });
                      }}
                      onChangeSexAndLifeStageField={(fieldName: string) => (
                        value: string | number | boolean
                      ) => {
                        this.setState((ps: State) => {
                          const currentSexAndStageIndex =
                            ps.classifications.currentSexAndStagesClassificationIndex;
                          const currentSexAndStagesClassification = ps.classifications
                            .classifications[
                            currentSexAndStageIndex
                          ] as ISexAndStagesClassification;
                          const newSexAndStage = new SexAndStage({
                            ...currentSexAndStagesClassification.editingSexAndStage,
                            [fieldName]: value
                          });
                          const newCurrentSexAndStagesClassification = new SexAndStagesClassification(
                            {
                              ...currentSexAndStagesClassification,
                              editingSexAndStage: newSexAndStage
                            }
                          );
                          const newCurrentClassification = new Classifications({
                            ...ps.classifications,
                            classifications: [
                              ...ps.classifications.classifications.slice(
                                0,
                                currentSexAndStageIndex
                              ),
                              newCurrentSexAndStagesClassification,
                              ...ps.classifications.classifications.slice(
                                currentSexAndStageIndex + 1
                              )
                            ]
                          });
                          return {
                            ...ps,
                            classifications: newCurrentClassification
                          };
                        });
                      }}
                      onDelete={i => {
                        this.setState((ps: State) => {
                          const currentSexAndStageIndex =
                            ps.classifications.currentSexAndStagesClassificationIndex;
                          const currentSexAndStagesClassification = ps.classifications
                            .classifications[
                            currentSexAndStageIndex
                          ] as ISexAndStagesClassification;

                          const currentSexAndStages =
                            currentSexAndStagesClassification.sexAndStages;

                          if (currentSexAndStages === undefined) {
                            throw new Error('Undefined taxterm array');
                          }

                          const newSexAndStages =
                            currentSexAndStages.length === 1
                              ? undefined
                              : [
                                  ...currentSexAndStages.slice(0, i),
                                  ...currentSexAndStages.slice(i + 1)
                                ];
                          const newSexAndStagesClassification = new SexAndStagesClassification(
                            {
                              ...currentSexAndStagesClassification,
                              sexAndStages: newSexAndStages
                            }
                          );
                          const newCurrentClassifications = new Classifications({
                            ...ps.classifications,
                            classifications: [
                              ...ps.classifications.classifications.slice(
                                0,
                                currentSexAndStageIndex
                              ),
                              newSexAndStagesClassification,
                              ...ps.classifications.classifications.slice(
                                currentSexAndStageIndex + 1
                              )
                            ]
                          });
                          return {
                            ...ps,
                            classifications: newCurrentClassifications
                          };
                        });
                      }}
                      onAddSexAndLifeStage={() => {
                        this.setState((ps: State) => {
                          const currentSexAndStageIndex =
                            ps.classifications.currentSexAndStagesClassificationIndex;
                          const currentSexAndStagesClassification = ps.classifications
                            .classifications[
                            currentSexAndStageIndex
                          ] as ISexAndStagesClassification;
                          const currentClassificationArray =
                            ps.classifications.classifications;
                          const currentSexAndStages =
                            currentSexAndStagesClassification.sexAndStages || [];

                          const newSexAndStage = new SexAndStage({});

                          const newclassification = new SexAndStagesClassification({
                            ...currentSexAndStagesClassification,
                            editingIndex: currentSexAndStages.length,
                            editingSexAndStage: newSexAndStage
                          });

                          const newClassArray = [
                            ...currentClassificationArray.slice(
                              0,
                              currentSexAndStageIndex
                            ),
                            newclassification,
                            ...currentClassificationArray.slice(
                              currentSexAndStageIndex + 1
                            )
                          ];
                          return {
                            ...ps,
                            classifications: new Classifications({
                              ...ps.classifications,
                              classifications: newClassArray
                            })
                          };
                        });
                      }}
                      onSaveSexAndLifeStage={() => {
                        this.setState((ps: State) => {
                          const currentClassificationArray =
                            ps.classifications.classifications;
                          const currentSexAndStageIndex =
                            ps.classifications.currentSexAndStagesClassificationIndex;
                          const currentClassification = ps.classifications.currentSexAndStagesClassification();
                          const currentSexAndStagesClassification = ps.classifications
                            .classifications[
                            currentSexAndStageIndex
                          ] as ISexAndStagesClassification;
                          const editingindex =
                            currentClassification.editingIndex !== undefined
                              ? currentClassification.editingIndex
                              : 0;
                          const newSexAndStagesClassification = new SexAndStagesClassification(
                            {
                              ...currentSexAndStagesClassification,
                              sexAndStages: [
                                ...(currentClassification.sexAndStages || []).slice(
                                  0,
                                  editingindex
                                ),
                                currentClassification.editingSexAndStage || {},
                                ...(currentClassification.sexAndStages || []).slice(
                                  editingindex + 1
                                )
                              ],
                              editingSexAndStage: undefined,
                              editingIndex: undefined
                            }
                          );
                          const newClassifications = new Classifications({
                            ...ps.classifications,
                            classifications: [
                              ...currentClassificationArray.slice(
                                0,
                                currentSexAndStageIndex
                              ),
                              newSexAndStagesClassification,
                              ...currentClassificationArray.slice(
                                currentSexAndStageIndex + 1
                              )
                            ]
                          });
                          return {
                            ...ps,
                            classifications: newClassifications
                          };
                        });
                      }}
                    />
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-default"
              onClick={e => {
                e.preventDefault();
                this.onCreateNewTaxonRevision();
              }}
            >
              Add new revision
            </button>
          </div>
        </div>
      </div>
    );
  }
}
