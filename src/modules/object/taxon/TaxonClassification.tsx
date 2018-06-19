import * as React from 'react';

import { TaxonSuggest } from '../../../components/suggest/TaxonSuggest';
//import { AppSession } from "../../../types/appSession";
//import appSession$ from "../../../stores/appSession";

type TaxonNameState = {
  taxonSuggestion?: ScientificName;
  taxonName: string;
  presicionType?: 'C' | 'A';
  taxonCathegory?: 'VA' | 'SS' | 'SP' | 'GE';
};

type TaxonEditingState = {
  selectedGenus?: number;
};

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

type ScientificName = {
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

const appSession = { museumId: 99 };

type TaxonState = {
  editingIndex: number;
  taxonNames: TaxonNameState[];
  infraspesName?: string;
  det: DetState;
  note?: string;
};

type TaxonProps = TaxonState & {
  onChangeNoteField: (value: string) => void;
  onChangeSuggests: (v: any) => void;
  onAddTaxon: () => void;
  onAddPerson: () => void;
  onDeletePerson: (i: number) => void;
  onChangeTaxonSuggest: (suggestion: ScientificName) => void;
  setDetEditingIndex: (i: number) => void;
  onChangePerson: (i: number) => (field: string) => (value: string) => void;
  setEditingIndex: (i: number) => void;
  onChangeTaxonField: (index: number) => (fieldName: string) => (value: string) => void;
};

type SexAndLifeStage = {
  count?: number;
  estimated?: number;
  sex?: string;
  stage?: string;
};

type SexAndLifeStageState = {
  sexAndStages: SexAndLifeStage[];
  editingIndex: number;
  note?: string;
};

type SexAndLifeStageProps = SexAndLifeStageState & {
  onChangeNoteField: (value: string) => void;
  onAddSexAndLifeStage: () => void;
  setEditingIndex: (i: number) => void;
  onChangeSexAndLifeStageField: (
    index: number
  ) => (fieldName: string) => (value: string) => void;
};

type ClassificationHistoryState = {
  taxonEditingState?: TaxonEditingState;
  taxonClassifications: TaxonState[];
  currentTaxonClassificationIndex: number;
  sexAndStage: SexAndLifeStageState;
};

type ClassificationHistoryProps = ClassificationHistoryState;

type Det = {
  personId?: number;
  personName?: string;
};
type DetState = {
  editingIndex: number;
  detTable: Det[];
};

type DetProps = DetState & {
  onAddPerson: () => void;
  onDeletePerson: (i: number) => void;
  setDetEditingIndex: (i: number) => void;
  onChangePerson: (i: number) => (field: string) => (value: string) => void;
};

class DetTable extends React.Component<DetProps> {
  constructor(props: DetProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.detTable.length > 1 ? (
          <div className="row">
            <div className="col-md-12">
              <table className="table table-condensed table-hover">
                <thead>
                  <tr>
                    <th>Previous determinators</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.props.detTable.map((d: Det, i: number) => (
                    <tr
                      key={`det-row-${i}`}
                      className={i === this.props.editingIndex ? 'info' : ''}
                      onClick={e => {
                        e.preventDefault();
                        this.props.setDetEditingIndex(i);
                      }}
                    >
                      <td>{d.personName}</td>
                      <td>
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            this.props.onDeletePerson(i);
                          }}
                        >
                          Delete person
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ' '
        )}
        <div className="row">
          <div className="col-md-12">
            {' '}
            <div className="form-group">
              <label htmlFor="personName">Det</label>
              <input
                type="text"
                className="form-control"
                id="personName"
                value={
                  this.props.editingIndex >= 0 &&
                  this.props.detTable[this.props.editingIndex] ? (
                    this.props.detTable[this.props.editingIndex].personName
                  ) : (
                    ''
                  )
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangePerson(this.props.editingIndex)('personName')(
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class SexAndLifeStageTable extends React.Component<SexAndLifeStageProps> {
  render() {
    return (
      <div>
        {this.props.sexAndStages &&
        this.props.sexAndStages.length > 1 && (
          <table className="table table-condensed table-hover">
            <thead>
              <tr>
                <th>Sex</th>
                <th> Stage</th>
                <th> Count</th>
                <th> Estimated count</th>{' '}
              </tr>
            </thead>
            <tbody>
              {this.props.sexAndStages.map((t: SexAndLifeStage, i: number) => {
                return (
                  <tr
                    key={`tr-row${i}`}
                    className={i === this.props.editingIndex ? 'info' : ''}
                    onClick={e => {
                      e.preventDefault();
                      this.props.setEditingIndex(i);
                    }}
                  >
                    <td>{t.sex}</td>
                    <td>{t.stage}</td>
                    <td>{t.count}</td>
                    <td>{t.estimated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="sex">Sex</label>
              <input
                type="text"
                className="form-control"
                id="sex"
                value={
                  this.props.sexAndStages &&
                  this.props.sexAndStages[this.props.editingIndex] ? (
                    this.props.sexAndStages[this.props.editingIndex].sex
                  ) : (
                    ''
                  )
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(this.props.editingIndex)('sex')(
                    e.target.value
                  );
                }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="presicionType">Stage</label>

              <input
                id="presicionType"
                className="form-control"
                value={
                  this.props.sexAndStages &&
                  this.props.sexAndStages[this.props.editingIndex] ? (
                    this.props.sexAndStages[this.props.editingIndex].stage
                  ) : (
                    ''
                  )
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(this.props.editingIndex)(
                    'stage'
                  )(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="taxonCathegory">Count</label>

              <input
                id="taxonCathegory"
                className="form-control"
                value={
                  this.props.sexAndStages &&
                  this.props.sexAndStages[this.props.editingIndex] ? (
                    this.props.sexAndStages[this.props.editingIndex].count
                  ) : (
                    ''
                  )
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(this.props.editingIndex)(
                    'count'
                  )(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="estimated">Estimated count</label>
              <input
                type="text"
                className="form-control"
                id="estimated"
                value={
                  this.props.sexAndStages &&
                  this.props.sexAndStages[this.props.editingIndex] ? (
                    this.props.sexAndStages[this.props.editingIndex].estimated
                  ) : (
                    ''
                  )
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(this.props.editingIndex)(
                    'estimated'
                  )(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TaxonTable extends React.Component<TaxonProps> {
  render() {
    let value = '';
    console.log(this.props.taxonNames[this.props.editingIndex].taxonSuggestion);
    const sugg = this.props.taxonNames[this.props.editingIndex].taxonSuggestion;
    const taxonPath =
      sugg && sugg.higherClassification
        ? sugg.higherClassification.reduce(
            (t: string, p: ScientificName) =>
              t ? `${t + '/' + p.scientificName}` : p.scientificName,
            ''
          )
        : '';
    if (sugg) {
      value =
        sugg.scientificName +
        (sugg.scientificNameAuthorship ? ' ' + sugg.scientificNameAuthorship : '');
    }

    return (
      <div>
        {this.props.taxonNames &&
        this.props.taxonNames.length > 1 && (
          <div className="row">
            <div className="col-md-12">
              <table className="table table-condensed table-hover">
                <thead>
                  <tr>
                    <th> Taxon name</th>
                    <th> Presicion</th>
                    <th> Taxon cathegry</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.taxonNames.map((t: TaxonNameState, i: number) => {
                    return (
                      <tr
                        key={`tr-row${i}`}
                        className={i === this.props.editingIndex ? 'info' : ''}
                        onClick={e => {
                          e.preventDefault();
                          this.props.setEditingIndex(i);
                        }}
                      >
                        <td>{t.taxonName}</td>
                        <td>{t.presicionType}</td>
                        <td>{t.taxonCathegory}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {taxonPath && <div className="row">{taxonPath}</div>}
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="taxonSuggestADB">Taxon</label>
              <TaxonSuggest
                id="taxonSuggestADB"
                value={value}
                placeHolder="Taxon"
                appSession={appSession}
                onChange={(suggestion: ScientificName) => {
                  this.props.onChangeTaxonSuggest(suggestion);
                }}
              />
            </div>
          </div>

          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="presicionType">Precision</label>

              <select
                id="presicionType"
                className="form-control"
                value={this.props.taxonNames[this.props.editingIndex].presicionType || ''}
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeTaxonField(this.props.editingIndex)('presicionType')(
                    e.target.value
                  );
                }}
              >
                <option>Velg type</option>
                <option>cf.</option>
                <option>aff.</option>
              </select>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="taxonCathegory">Taxon cathegory</label>

              <select
                id="taxonCathegory"
                className="form-control"
                value={
                  this.props.taxonNames[this.props.editingIndex].taxonCathegory || ''
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeTaxonField(this.props.editingIndex)(
                    'taxonCathegory'
                  )(e.target.value);
                }}
              >
                <option>Velg type</option>
                <option>Order</option>
                <option>Family</option>
                <option>Genus</option>
                <option>Species</option>
                <option>Sub species</option>
                <option>Variety</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class TaxonComponent extends React.Component<TaxonProps> {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-11">
                <TaxonTable {...this.props} />
              </div>
              <div className="col-md-1">
                <div style={{ textAlign: 'left', verticalAlign: 'bottom' }}>
                  <label htmlFor="btnAddTaxon">Add</label>
                  <button
                    type="button"
                    className="btn btn-default form-control"
                    onClick={e => {
                      e.preventDefault();
                      this.props.onAddTaxon();
                    }}
                    id="btnAddTaxon"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2">
                <div className="form-group">
                  <label htmlFor="infraspesRank">Infraspesific rank</label>
                  <input type="text" className="form-control" id="infraspesRank" />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="infraspesName">Infraspesific name</label>
                  <input type="text" className="form-control" id="infraspesName" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="taxonNote">Note</label>
                  <textarea className="form-control" id="taxonNote" rows={5} />
                </div>
              </div>
            </div>
            <div className="row" />
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-11">
                <DetTable
                  {...this.props.det}
                  onAddPerson={this.props.onAddPerson}
                  onDeletePerson={this.props.onDeletePerson}
                  onChangePerson={this.props.onChangePerson}
                  setDetEditingIndex={this.props.setDetEditingIndex}
                />
              </div>
              <div className="col-md-1">
                <div style={{ textAlign: 'left', verticalAlign: 'bottom' }}>
                  <label htmlFor="btnAddPerson">Add</label>
                  <button
                    type="button"
                    className="btn btn-default form-control"
                    onClick={e => {
                      e.preventDefault();
                      this.props.onAddPerson();
                    }}
                    id="btnAddPerson"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export class SexAndStages extends React.Component<SexAndLifeStageProps> {
  render() {
    return (
      <div className="grid">
        <div className="row">
          <div className="col-md-12">
            <SexAndLifeStageTable {...this.props} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-default"
                id="btnAddSexAndStage"
                onClick={e => {
                  e.preventDefault();
                  this.props.onAddSexAndLifeStage();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7">
            <div className="form-group">
              <label htmlFor="sexAndStageNote">Note</label>
              <textarea className="form-control" id="sexAndStageNote" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ClassificationHistoryTable extends React.Component<ClassificationHistoryProps> {
  render() {
    return <div />;
  }
}

export default class ClassificationComponent extends React.Component<
  ClassificationHistoryProps,
  ClassificationHistoryState
> {
  constructor(props: ClassificationHistoryProps) {
    super(props);

    this.state = {
      taxonClassifications: [
        {
          taxonNames: [{ taxonName: '' }],
          editingIndex: 0,
          det: { detTable: [{ personName: '' }], editingIndex: 0 }
        }
      ],
      currentTaxonClassificationIndex: 0,
      sexAndStage: { sexAndStages: [], editingIndex: -1 }
    };

    this.getFullHybridName = this.getFullHybridName.bind(this);
  }

  getFullHybridName() {
    return '';
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
                {...this.state.taxonClassifications[
                  this.state.currentTaxonClassificationIndex
                ]}
                onChangeTaxonSuggest={(suggestion: ScientificName) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClassification =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];
                    const currentTaxState =
                      currentClassification.taxonNames[
                        currentClassification.editingIndex
                      ];
                    const newTaxonName = {
                      ...currentTaxState,
                      taxonSuggestion: suggestion
                    };
                    const newTaxonNames = [
                      ...currentClassification.taxonNames.slice(
                        0,
                        currentClassification.editingIndex
                      ),
                      newTaxonName,
                      ...currentClassification.taxonNames.slice(
                        currentClassification.editingIndex + 1
                      )
                    ];

                    return {
                      ...ps,
                      taxonClassifications: [
                        ...ps.taxonClassifications.slice(
                          0,
                          ps.currentTaxonClassificationIndex
                        ),
                        {
                          ...ps.taxonClassifications[ps.currentTaxonClassificationIndex],
                          taxonNames: newTaxonNames
                        },
                        ...ps.taxonClassifications.slice(
                          ps.currentTaxonClassificationIndex + 1
                        )
                      ]
                    };
                  });
                }}
                onChangeNoteField={(value: string) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClassification =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];

                    return {
                      ...ps,
                      taxonClassifications: [
                        ...ps.taxonClassifications.slice(
                          0,
                          ps.currentTaxonClassificationIndex
                        ),
                        {
                          ...currentClassification,
                          taxon: {
                            ...currentClassification,
                            note: value
                          }
                        },
                        ...ps.taxonClassifications.slice(
                          ps.currentTaxonClassificationIndex + 1
                        )
                      ]
                    };
                  });
                }}
                setEditingIndex={(index: number) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    return {
                      ...ps,
                      taxonClassifications: [
                        ...ps.taxonClassifications.slice(
                          0,
                          ps.currentTaxonClassificationIndex
                        ),
                        {
                          ...ps.taxonClassifications[ps.currentTaxonClassificationIndex],
                          editingIndex: index
                        },
                        ...ps.taxonClassifications.slice(
                          ps.currentTaxonClassificationIndex + 1
                        )
                      ]
                    };
                  });
                }}
                onChangeTaxonField={(index: number) => (fieldName: string) => (
                  value: any
                ) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClassification =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];
                    const currentTaxonName = currentClassification.taxonNames[index];
                    const newTaxon = {
                      ...currentTaxonName,
                      [fieldName]: value
                    };
                    return {
                      ...ps,
                      taxonClassifications: [
                        ...ps.taxonClassifications.slice(
                          0,
                          ps.currentTaxonClassificationIndex
                        ),
                        {
                          ...currentClassification,
                          taxonNames: [
                            ...currentClassification.taxonNames.slice(0, index),
                            newTaxon,
                            ...currentClassification.taxonNames.slice(index + 1)
                          ]
                        },
                        ...ps.taxonClassifications.slice(
                          ps.currentTaxonClassificationIndex + 1
                        )
                      ]
                    };
                  });
                }}
                onChangeSuggests={(nv: any) =>
                  this.setState((ps: ClassificationHistoryState) => ({
                    ...ps,
                    nv
                  }))}
                setDetEditingIndex={(i: number) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClass =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];
                    const currentDet = currentClass.det;
                    const newDet = { ...currentDet, editingIndex: i };
                    const newClass = { ...currentClass, det: newDet };

                    const newTaxonClassifications = [
                      ...ps.taxonClassifications.slice(
                        0,
                        ps.currentTaxonClassificationIndex
                      ),
                      newClass,
                      ...ps.taxonClassifications.slice(
                        ps.currentTaxonClassificationIndex + 1
                      )
                    ];

                    return {
                      ...ps,
                      taxonClassifications: newTaxonClassifications
                    };
                  });
                }}
                onDeletePerson={(i: number) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClass =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];
                    const currentDet = currentClass.det;
                    const currentDetTable = currentDet.detTable;
                    const newDetTable = [
                      ...currentDetTable.slice(0, i),
                      ...currentDetTable.slice(i + 1)
                    ];

                    const newDet = {
                      ...currentDet,
                      detTable: newDetTable,
                      editingIndex:
                        currentDet.editingIndex > 0 ? currentDet.editingIndex - 1 : 0
                    };
                    const newClass = { ...currentClass, det: newDet };

                    const newTaxonClassifications = [
                      ...ps.taxonClassifications.slice(
                        0,
                        ps.currentTaxonClassificationIndex
                      ),
                      newClass,
                      ...ps.taxonClassifications.slice(
                        ps.currentTaxonClassificationIndex + 1
                      )
                    ];

                    return {
                      ...ps,
                      taxonClassifications: newTaxonClassifications
                    };
                  });
                }}
                onAddPerson={() => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClass =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];
                    const currentDet = currentClass.det;
                    const currentDetTable = currentDet.detTable;
                    const newDetState = { personName: '' };
                    const newDetTable = [...currentDetTable, newDetState];

                    const newDet = {
                      ...currentDet,
                      detTable: newDetTable,
                      editingIndex: newDetTable.length - 1
                    };
                    const newClass = { ...currentClass, det: newDet };

                    const newTaxonClassifications = [
                      ...ps.taxonClassifications.slice(
                        0,
                        ps.currentTaxonClassificationIndex
                      ),
                      newClass,
                      ...ps.taxonClassifications.slice(
                        ps.currentTaxonClassificationIndex + 1
                      )
                    ];

                    return {
                      ...ps,
                      taxonClassifications: newTaxonClassifications
                    };
                  });
                }}
                onChangePerson={(i: number) => (field: string) => (value: string) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClass =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];
                    const currentDet = currentClass.det;
                    const currentDetTable = currentDet.detTable;
                    const currentDetState = currentDetTable[i];
                    const newDetState = { ...currentDetState, [field]: value };
                    const newDetTable = [
                      ...currentDetTable.slice(0, i),
                      newDetState,
                      ...currentDetTable.slice(i + 1)
                    ];
                    const newDet = { ...currentDet, detTable: newDetTable };
                    const newClass = { ...currentClass, det: newDet };

                    const newTaxonClassifications = [
                      ...ps.taxonClassifications.slice(
                        0,
                        ps.currentTaxonClassificationIndex
                      ),
                      newClass,
                      ...ps.taxonClassifications.slice(
                        ps.currentTaxonClassificationIndex + 1
                      )
                    ];

                    return {
                      ...ps,
                      taxonClassifications: newTaxonClassifications
                    };
                  });
                }}
                onAddTaxon={() => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const newTaxonNames = [
                      ...ps.taxonClassifications[ps.currentTaxonClassificationIndex]
                        .taxonNames,
                      {
                        taxonName: '',
                        presicionType: undefined,
                        taxonCathegory: undefined,
                        infraspesName: undefined
                      }
                    ];
                    const currentClassification =
                      ps.taxonClassifications[ps.currentTaxonClassificationIndex];
                    return {
                      ...ps,
                      taxonClassifications: [
                        ...ps.taxonClassifications.slice(
                          0,
                          ps.currentTaxonClassificationIndex
                        ),
                        {
                          ...currentClassification,
                          editingIndex: currentClassification.editingIndex + 1,
                          taxonNames: newTaxonNames
                        },
                        ...ps.taxonClassifications.slice(
                          ps.currentTaxonClassificationIndex + 1
                        )
                      ]
                    };
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="well">
              <h3>Sex and stages</h3>
              <SexAndStages
                {...this.state.sexAndStage}
                onChangeNoteField={(value: string) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    return {
                      ...ps,
                      sexAndStage: { ...ps.sexAndStage, note: value }
                    };
                  });
                }}
                setEditingIndex={(index: number) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    return {
                      ...ps,
                      sexAndStage: { ...ps.sexAndStage, editingIndex: index }
                    };
                  });
                }}
                onChangeSexAndLifeStageField={(index: number) => (fieldName: string) => (
                  value: any
                ) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentSexAndStage = ps.sexAndStage.sexAndStages[index];
                    const newSexAndStage = {
                      ...currentSexAndStage,
                      [fieldName]: value
                    };
                    const newSexAndStages = [
                      ...ps.sexAndStage.sexAndStages.slice(0, index),
                      newSexAndStage,
                      ...ps.sexAndStage.sexAndStages.slice(index + 1)
                    ];

                    return {
                      ...ps,
                      sexAndStage: {
                        ...ps.sexAndStage,
                        sexAndStages: newSexAndStages
                      }
                    };
                  });
                }}
                onAddSexAndLifeStage={() => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currSexAndStage = ps.sexAndStage || {
                      sexAndStages: []
                    };
                    const newSexAndStage = [
                      ...currSexAndStage.sexAndStages,
                      {
                        sex: undefined,
                        stage: undefined,
                        count: undefined,
                        estimated: undefined
                      }
                    ];
                    return {
                      ...ps,
                      sexAndStage: {
                        ...ps.sexAndStage,
                        sexAndStages: newSexAndStage
                      }
                    };
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="well">
              <h3>Revisions</h3>
              <ClassificationHistoryTable {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
