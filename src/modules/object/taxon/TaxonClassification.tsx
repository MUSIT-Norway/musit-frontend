import * as React from "react";
import { uniqBy } from "lodash";

//import { TaxonSuggest } from "../../../components/suggest/TaxonSuggest";
//import { AppSession } from "../../../types/appSession";
//import appSession$ from "../../../stores/appSession";
import scientificNames from "./scientificNames.json";

type TaxonNameState = {
  taxonName: string;
  presicionType?: "C" | "A";
  taxonCathegory?: "VA" | "SS" | "SP" | "GE";
};

const names: ScientificName[] = scientificNames.filter(
  (s: ScientificName) => s.taxonRank === "species"
);

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

//const appSession = { museumId: 99 };

type TaxonState = {
  editingIndex: number;
  taxonNames: TaxonNameState[];
  infraspesName?: string;
  det?: { personName: string }[];
  note?: string;
};

type TaxonProps = TaxonState & {
  onChangeNoteField: (value: string) => void;
  onChangeSuggests: (v: any) => void;
  onAddTaxon: () => void;
  setEditingIndex: (i: number) => void;
  taxonEditingState?: TaxonEditingState;
  onChangeTaxonEditingStatus: (field: string) => (value: number) => void;
  onChangeTaxonField: (
    index: number
  ) => (fieldName: string) => (value: string) => void;
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

type Genus = {
  id: number;
  name: string;
};

type TaxonName = {
  genus: number;
  genusName: string;
  name: string;
};
const speciesSelect: TaxonName[] = names.map((s: ScientificName) => {
  const g: ScientificName | undefined = s.higherClassification.find(
    (g: ScientificName) => g.taxonRank === "genus"
  );
  const name: string = s.scientificName;
  return {
    genus: g ? g.scientificNameID : 0,
    name,
    genusName: g ? g.scientificName : "G"
  };
});

const genusSelect = uniqBy(
  speciesSelect.map(m => ({
    id: m.genus,
    name: m.genusName
  })),
  s => s.name
);

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
                <th> Estimated count</th>{" "}
              </tr>
            </thead>
            <tbody>
              {this.props.sexAndStages.map((t: SexAndLifeStage, i: number) => {
                return (
                  <tr
                    key={`tr-row${i}`}
                    className={i === this.props.editingIndex ? "info" : ""}
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
                  this.props.sexAndStages[this.props.editingIndex].sex || ""
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(
                    this.props.editingIndex
                  )("sex")(e.target.value);
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
                  this.props.sexAndStages[this.props.editingIndex].stage || ""
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(
                    this.props.editingIndex
                  )("stage")(e.target.value);
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
                  this.props.sexAndStages[this.props.editingIndex].count || ""
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(
                    this.props.editingIndex
                  )("count")(e.target.value);
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
                  this.props.sexAndStages[this.props.editingIndex].estimated ||
                  ""
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeSexAndLifeStageField(
                    this.props.editingIndex
                  )("estimated")(e.target.value);
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
    return (
      <div>
        {this.props.taxonNames &&
        this.props.taxonNames.length > 1 && (
          <div className="row">
            <div className="col-md-12">
              <table className="table table-condensed table-hover">
                <thead>
                  <tr>
                    <th>Taxon name</th>
                    <th> Presicion</th>
                    <th> Taxon cathegry</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.taxonNames.map((t: TaxonNameState, i: number) => {
                    return (
                      <tr
                        key={`tr-row${i}`}
                        className={i === this.props.editingIndex ? "info" : ""}
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
        <div className="row">
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="genus">Genus</label>
              <select
                className="form-control"
                id="genus"
                value={
                  this.props.taxonEditingState &&
                  this.props.taxonEditingState.selectedGenus
                }
                onChange={e => {
                  e.preventDefault();
                  console.log(e.target.value);
                  this.props.onChangeTaxonEditingStatus("selectedGenus")(
                    parseInt(e.target.value)
                  );
                }}
              >
                {(genusSelect ? genusSelect : [])
                  .sort((s, t) => {
                    if (s.name > t.name) {
                      return 1;
                    } else if (s.name < t.name) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
                  .map((t: Genus, i: number) => (
                    <option key={`opt-${i}`} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="taxonName">Taxon</label>
              <select
                className="form-control"
                id="taxonName"
                value={
                  this.props.taxonNames &&
                  this.props.taxonNames[this.props.editingIndex].taxonName
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeTaxonField(this.props.editingIndex)(
                    "taxonName"
                  )(e.target.value);
                }}
              >
                {(speciesSelect ? speciesSelect : [])
                  .filter(
                    (t: TaxonName) =>
                      this.props.taxonEditingState &&
                      t.genus === this.props.taxonEditingState.selectedGenus
                  )
                  .sort((s, t) => {
                    if (s.name > t.name) {
                      return 1;
                    } else if (s.name < t.name) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
                  .map((t: TaxonName, i: number) => (
                    <option key={`opt-${i}`}>{t.name}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="presicionType">Precision</label>

              <select
                id="presicionType"
                className="form-control"
                value={
                  this.props.taxonNames[this.props.editingIndex]
                    .presicionType || ""
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeTaxonField(this.props.editingIndex)(
                    "presicionType"
                  )(e.target.value);
                }}
              >
                <option>Velg type</option>
                <option>cf.</option>
                <option>aff.</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="taxonCathegory">Taxon cathegory</label>

              <select
                id="taxonCathegory"
                className="form-control"
                value={
                  this.props.taxonNames[this.props.editingIndex]
                    .taxonCathegory || ""
                }
                onChange={e => {
                  e.preventDefault();
                  this.props.onChangeTaxonField(this.props.editingIndex)(
                    "taxonCathegory"
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
      <div className="grid">
        <div className="row">
          <div className="col-md-6">
            <TaxonTable {...this.props} />
          </div>
          <div className="col-md-1">
            <div style={{ textAlign: "left", verticalAlign: "bottom" }}>
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
                Add
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="aggregatedTaxonName">Taxon name</label>
            <input
              className="form-control"
              readOnly
              value="Hei"
              id="aggregatedTaxonName"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="infraspesName">Infraspesific name</label>
              <input type="text" className="form-control" id="infraspesName" />
            </div>
            <div className="form-group">
              <label htmlFor="infraspesName">Infraspesific name</label>
              <input type="text" className="form-control" id="infraspesName" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="infraspesRank">Infraspesific rank</label>
              <input type="text" className="form-control" id="infraspesRank" />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="taxonNote">Note</label>
              <textarea className="form-control" id="taxonNote" rows={5} />
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
            <div style={{ textAlign: "right" }}>
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

class ClassificationHistoryTable extends React.Component<
  ClassificationHistoryProps
> {
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
        { taxonNames: [{ taxonName: "" }], editingIndex: 0 }
      ],
      taxonEditingState: {},
      currentTaxonClassificationIndex: 0,
      sexAndStage: { sexAndStages: [{}], editingIndex: 0 }
    };

    this.getFullHybridName = this.getFullHybridName.bind(this);
  }

  getFullHybridName() {
    return "";
  }

  render() {
    return (
      <div
        style={{
          paddingTop: "30px",
          paddingLeft: "20px",
          paddingRight: "20px"
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
                taxonEditingState={this.state.taxonEditingState}
                onChangeTaxonEditingStatus={(field: string) => (value: any) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    return {
                      ...ps,
                      taxonEditingState: ps.taxonEditingState
                        ? { ...ps.taxonEditingState, [field]: value }
                        : { [field]: value }
                    };
                  });
                }}
                onChangeNoteField={(value: string) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentClassification =
                      ps.taxonClassifications[
                        ps.currentTaxonClassificationIndex
                      ];

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
                          ...ps.taxonClassifications[
                            ps.currentTaxonClassificationIndex
                          ],
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
                      ps.taxonClassifications[
                        ps.currentTaxonClassificationIndex
                      ];
                    const currentTaxonName =
                      currentClassification.taxonNames[index];
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
                onAddTaxon={() => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const newTaxonNames = [
                      ...ps.taxonClassifications[
                        ps.currentTaxonClassificationIndex
                      ].taxonNames,
                      {
                        taxonName: "",
                        presicionType: undefined,
                        taxonCathegory: undefined,
                        infraspesName: undefined
                      }
                    ];
                    const currentClassification =
                      ps.taxonClassifications[
                        ps.currentTaxonClassificationIndex
                      ];
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
                onChangeSexAndLifeStageField={(index: number) => (
                  fieldName: string
                ) => (value: any) => {
                  this.setState((ps: ClassificationHistoryState) => {
                    const currentSexAndStage =
                      ps.sexAndStage.sexAndStages[index];
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
