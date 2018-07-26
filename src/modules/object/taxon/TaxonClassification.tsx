import * as React from 'react';
import { sexList, stadiumList } from './constants';
import { CheckBox } from '../components/CheckBox';
import * as FontAwesome from 'react-fontawesome';
import { TaxonSuggest } from '../../../components/suggest/TaxonSuggest';

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

// Datastructure
interface IPersonName {
  personNameId?: number;
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

type DetProps = IDet & {
  onAddPerson: () => void;
  onSavePerson: () => void;
  onDeletePerson: (i: number) => void;
  setDetEditingIndex: (i: number) => void;
  onChangePerson: (field: string) => (value: string) => void;
};

interface ITaxonTerm {
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
    this.precisionRank = term.precisionRank;
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

class SexAndStage implements ISexAndStage {
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

type SexAndLifeStageProps = ISexAndStagesClassification & {
  onChangeNoteField: (value: string) => void;
  onAddSexAndLifeStage: () => void;
  onSaveSexAndLifeStage: () => void;
  setEditingIndex: (i: number) => void;
  onDelete: (i: number) => void;
  onChangeBooleanValue: (index: number) => (fieldName: string) => void;
  onChangeSexAndLifeStageField: (fieldName: string) => (value: string | number) => void;
};

type TaxonClassificationProps = ITaxonClassification & {
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
  onCreateNewTaxonRevision: () => void;
  setDetEditingIndex: (i: number) => void;
  onChangePerson: (field: string) => (value: string) => void;
};

const appSession = { museumId: 99 };

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
}

class State implements IState {
  classifications: Classifications;
  classificationsToShow: IClassificationsToShow;
  constructor(s: IState) {
    this.classifications = new Classifications(s.classifications);
    this.classificationsToShow = s.classificationsToShow;
  }
}

type Props = IState;

export class DetTable extends React.Component<DetProps> {
  constructor(props: DetProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.personNames && this.props.personNames.length > 0 ? (
          <div className="row">
            <div className="col-md-12">
              <table className="table table-condensed table-hover">
                <thead>
                  <tr>
                    <th>Determinators</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.props.personNames.map((d: IPersonName, i: number) => (
                    <tr
                      key={`det-row-${i}`}
                      className={i === this.props.editingIndex ? 'info' : ''}
                    >
                      <td>{d.personName}</td>
                      <td>
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            this.props.setDetEditingIndex(i);
                          }}
                        >
                          <FontAwesome name="edit" />
                        </a>
                      </td>
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
        {this.props.editingDet && (
          <div className="row">
            <div className="col-md-9">
              {' '}
              <div className="form-group">
                <label htmlFor="personName">Det</label>
                <input
                  type="text"
                  className="form-control"
                  id="personName"
                  value={this.props.editingDet ? this.props.editingDet.personName : ''}
                  onChange={e => {
                    e.preventDefault();
                    this.props.editingDet &&
                      this.props.onChangePerson('personName')(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ textAlign: 'left', verticalAlign: 'bottom' }}>
                <label htmlFor="btnAddPerson">Create new</label>
                <button
                  type="button"
                  className="btn btn-default form-control"
                  onClick={e => {
                    e.preventDefault();
                    this.props.onAddPerson();
                  }}
                  id="btnAddPerson"
                >
                  <FontAwesome name="user-plus" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-default"
              disabled={this.props.editingDet !== undefined}
              id="btnAdd"
              onClick={e => {
                e.preventDefault();
                this.props.onAddPerson();
              }}
            >
              Add
            </button>
          </div>
          <div className="col-md-2">
            <button
              type="button"
              disabled={this.props.editingDet === undefined}
              className="btn btn-default"
              id="btnSave"
              onClick={e => {
                e.preventDefault();
                this.props.onSavePerson();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export class SexAndLifeStageTable extends React.Component<SexAndLifeStageProps> {
  render() {
    return (
      <div>
        {this.props.sexAndStages &&
          this.props.sexAndStages.length > 0 && (
            <table className="table table-condensed table-hover">
              <thead>
                <tr>
                  <th> Sex</th>
                  <th> Stage</th>
                  <th> Count</th>
                  <th> Estimated count</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {console.log(
                  'anuradha &&&&&&&& ',
                  this.props.sexAndStages,
                  ' test MUSARK1852 ',
                  this.props.sexAndStages.length
                )}
                {this.props.sexAndStages.map((t: SexAndStage, i: number) => {
                  return (
                    <tr
                      key={`tr-row${i}`}
                      className={i === this.props.editingIndex ? 'info' : ''}
                    >
                      <td>{t.getSexTerm()}</td>
                      <td>{t.getStageTerm()}</td>
                      <td>{t.count}</td>
                      <td>{t.estimatedCount ? 'Yes' : 'No'}</td>
                      <td>
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            this.props.onDelete(i);
                          }}
                        >
                          Delete
                        </a>
                      </td>
                      <td>
                        <a
                          href=""
                          onClick={e => {
                            e.preventDefault();
                            this.props.setEditingIndex(i);
                          }}
                        >
                          <FontAwesome name="edit" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        {this.props.editingSexAndStage && (
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="sex">Sex</label>
                <select
                  className="form-control"
                  onChange={e => {
                    e.preventDefault();
                    this.props.onChangeSexAndLifeStageField('sex')(e.target.value);
                  }}
                  value={
                    this.props.editingSexAndStage && this.props.editingSexAndStage.sex
                      ? this.props.editingSexAndStage.sex
                      : ''
                  }
                >
                  {sexList.map((t, i) => (
                    <option key={i + 'term-option'} value={t.code}>
                      {t.term}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="stage">Stage</label>

                <select
                  className="form-control"
                  onChange={e => {
                    e.preventDefault();
                    this.props.onChangeSexAndLifeStageField('stage')(e.target.value);
                  }}
                  value={
                    this.props.editingSexAndStage && this.props.editingSexAndStage.stage
                      ? this.props.editingSexAndStage.stage
                      : ''
                  }
                >
                  {stadiumList.map((t, i) => (
                    <option key={i + 'key'} value={t.code}>
                      {t.term}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label htmlFor="count">Count</label>
                <input
                  id="count"
                  className="form-control"
                  value={
                    this.props.editingSexAndStage && this.props.editingSexAndStage.count
                      ? this.props.editingSexAndStage.count
                      : ''
                  }
                  onChange={e => {
                    e.preventDefault();
                    this.props.onChangeSexAndLifeStageField('count')(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label htmlFor="count" />
                <CheckBox
                  id="checkbox-estimated"
                  checked={
                    this.props.editingSexAndStage &&
                    this.props.editingSexAndStage.estimatedCount
                      ? true
                      : false
                  }
                  displayValue=" Estimated?"
                  onChange={() =>
                    this.props.onChangeBooleanValue(
                      this.props.editingIndex ? this.props.editingIndex : 0
                    )('estimatedCount')
                  }
                />
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-md-1">
            <div className="form-group">
              <label htmlFor="btnAddSexAndStage" />
              <button
                type="button"
                className="btn btn-default btn-sm form-control"
                id="btnAddSexAndStage"
                disabled={this.props.editingSexAndStage !== undefined}
                onClick={e => {
                  e.preventDefault();
                  this.props.onAddSexAndLifeStage();
                }}
              >
                Add
              </button>
            </div>
          </div>
          <div className="col-md-1">
            <div className="form-group">
              <button
                type="button"
                className="btn btn-default btn-sm form-control"
                id="btnSaveSexAndStage"
                disabled={this.props.editingSexAndStage === undefined}
                onClick={e => {
                  e.preventDefault();
                  this.props.onSaveSexAndLifeStage();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TaxonTable extends React.Component<TaxonClassificationProps> {
  render() {
    const sugg = this.props.editingName && this.props.editingName.taxonSuggestion;

    const scentificNameAsString = (n: ScientificName) => {
      const parentArr = n.higherClassification
        ? n.higherClassification[n.higherClassification.length - 1].scientificName.split(
            ' '
          )
        : [];

      const tmp = n.scientificName.split(' ');
      const nameArr = parentArr.length <= 1 ? tmp : [...parentArr, tmp[tmp.length - 1]];
      const author = n.scientificNameAuthorship ? n.scientificNameAuthorship : '';

      const ret = nameArr.reduce((p: string, t: string, ind: number, a: string[]) => {
        if (ind === 0) {
          if (
            !(
              n.taxonRank === 'subspecies' ||
              n.taxonRank === 'species' ||
              n.taxonRank === 'variety'
            )
          ) {
            return t;
          }
          return t;
        }
        if (ind === 1) {
          if (ind + 1 === a.length) {
            return p + ' ' + t;
          } else {
            return p + ' ' + t;
          }
        }

        if (ind === 2) {
          const inf =
            ind === a.length + 1
              ? n.taxonRank === 'subspecies'
                ? 'ssp.'
                : 'var.'
              : 'ssp.';
          if (ind + 1 === a.length) {
            return p + ' ' + inf + ' ' + t;
          } else {
            return p + ' ' + inf + ' ' + t;
          }
        }

        if (ind === 3) {
          const inf =
            n.taxonRank === 'subspecies'
              ? 'ssp.'
              : n.taxonRank === 'variety'
                ? 'var.'
                : 'form';
          return p + ' ' + inf + ' ' + t;
        }

        return '';
      }, '');
      return (
        <span className="suggestion-content">
          {ret + (author ? '  ' : '')} &nbsp; <i>{author}</i> &nbsp;{' '}
          {' [' + n.taxonRank + ']'}&nbsp;{n.acceptedNameUsage
            ? '[=' + n.acceptedNameUsage.scientificName + ']'
            : ''}
        </span>
      );
    };

    const taxonPath = (this.props.taxonNames || []).reduce((p: string, c: ITaxonTerm) => {
      const lPath = c.taxonSuggestion
        ? c.taxonSuggestion.higherClassification.map(h => h.scientificName).join('/')
        : '';
      return p === '' ? lPath : p + ' × ' + lPath;
    }, '');
    const aggVal = (this.props.taxonNames || []).reduce((p: string, c: ITaxonTerm) => {
      const names = (c.taxonSuggestion
        ? c.taxonSuggestion.scientificName.split(' ')
        : []
      ).map((s: string, i: number) => {
        if (i === 0) {
          return { rank: 'genus', name: s };
        } else if (i === 1) {
          return { rank: 'species', name: s };
        } else {
          return {
            rank: c.taxonSuggestion ? c.taxonSuggestion.taxonRank : '',
            name: s
          };
        }
      });

      const name = names.reduce((pr: string, cur: { rank: string; name: string }) => {
        const uncert = cur.rank === c.precisionRank ? ' ' + c.precisionCode + ' ' : ' ';
        const currRank = c.taxonSuggestion ? c.taxonSuggestion.taxonRank : '';
        const rankf = (rank: string) => {
          if (rank === 'subspecies') {
            return 'ssp. ';
          }
          if (rank === 'variety') {
            return 'var. ';
          }
          if (rank === 'form') {
            return 'form. ';
          }
          return '';
        };

        return pr === ''
          ? uncert + cur.name
          : pr + uncert + (cur.rank === currRank ? rankf(currRank) : '') + cur.name;
      }, '');
      return p === '' ? name : p + ' × ' + name;
    }, '');

    const value = sugg
      ? sugg.scientificName +
        (sugg.scientificNameAuthorship ? ' ' + sugg.scientificNameAuthorship : '')
      : '';

    return (
      <div>
        {this.props.taxonNames &&
          this.props.taxonNames.length > 0 && (
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <table className="table table-condensed table-hover">
                    <thead>
                      <tr>
                        <th> Taxon name</th>
                        <th> Presicion</th>
                        <th> Taxon cathegry</th>
                        <th />
                        <th />>
                      </tr>
                    </thead>
                    <tbody>
                      {console.log(
                        'anuradha &&&&&&&& ',
                        this.props.taxonNames,
                        '  ',
                        this.props.taxonNames.length
                      )}
                      {this.props.taxonNames.map((t: ITaxonTerm, i: number) => {
                        return (
                          <tr
                            key={`tr-row${i}`}
                            className={i === this.props.editingIndex ? 'info' : ''}
                          >
                            <td>
                              {t.taxonSuggestion
                                ? t.taxonSuggestion.scientificName +
                                  (t.taxonSuggestion.scientificNameAuthorship
                                    ? ' ' + t.taxonSuggestion.scientificNameAuthorship
                                    : '')
                                : ''}
                            </td>
                            <td>{t.precisionCode}</td>
                            <td>{t.precisionRank}</td>
                            <td>
                              <button
                                className="btn btn-link"
                                onClick={e => {
                                  e.preventDefault();
                                  this.props.onDeleteTaxon(i);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-link"
                                onClick={e => {
                                  e.preventDefault();
                                  this.props.setEditingIndex(i);
                                }}
                              >
                                <FontAwesome name="edit" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        {taxonPath && <div className="row">{taxonPath}</div>}
        <br />
        {aggVal && (
          <div className="row">
            <i>{aggVal}</i>
          </div>
        )}
        <br />

        {this.props.editingName && (
          <div className="row">
            <div className="col-md-7">
              <div className="form-group">
                <label htmlFor="taxonSuggestADB">Taxon</label>
                <TaxonSuggest
                  id="taxonSuggestADB"
                  value={value}
                  renderFunc={scentificNameAsString}
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
                  value={
                    (this.props.editingName && this.props.editingName.precisionCode) || ''
                  }
                  onChange={e => {
                    e.preventDefault();
                    this.props.onChangeTaxonField('precisionCode')(e.target.value);
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
                <label htmlFor="taxonCategory">Taxon Category</label>

                <select
                  id="taxonCategory"
                  className="form-control"
                  value={
                    (this.props.editingName && this.props.editingName.precisionRank) || ''
                  }
                  onChange={e => {
                    e.preventDefault();
                    this.props.onChangeTaxonField('precisionRank')(e.target.value);
                  }}
                >
                  <option>Velg type</option>
                  <option value="order">Order</option>
                  <option value="family">Family</option>
                  <option value="genus">Genus</option>
                  <option value="species">Species</option>
                  <option value="subspecies">Subspecies</option>
                  <option value="variety">Variety</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-md-1">
            <button
              type="button"
              className="btn btn-default"
              disabled={this.props.editingName !== undefined}
              id="btnAdd"
              onClick={e => {
                e.preventDefault();
                this.props.onAddTaxon();
              }}
            >
              Add ×
            </button>
          </div>
          <div className="col-md-1">
            <button
              type="button"
              className="btn btn-default"
              disabled={this.props.editingName === undefined}
              id="btnSave"
              onClick={e => {
                e.preventDefault();
                this.props.onSaveTaxonTerm();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export class TaxonComponent extends React.Component<TaxonClassificationProps> {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-12">
                <TaxonTable {...this.props} />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-2">
                <div className="form-group">
                  <label htmlFor="infraspesRank">Infraspesific rank</label>
                  <select
                    className="form-control"
                    id="infraspesRank"
                    onChange={e => {
                      e.preventDefault();
                      this.props.onChangeTaxonClassificationFields('infraspesRank')(
                        e.target.value
                      );
                    }}
                  >
                    <option value="">--select--</option>
                    <option value="ssp.">Subspecies</option>
                    <option value="var.">Variety</option>
                    <option value="form.">Form</option>
                    <option value="sensu">Sensu</option>
                    <option value="s.lat.">Sensu.lat.</option>
                    <option value="s.str">Sensu str.</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="infraspesName">Infraspesific name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="infraspesName"
                    onChange={e => {
                      e.preventDefault();
                      this.props.onChangeTaxonClassificationFields('infraSpesName')(
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="taxonNote">Note</label>
                  <textarea
                    className="form-control"
                    id="taxonNote"
                    rows={5}
                    onChange={e => {
                      e.preventDefault();
                      this.props.onChangeTaxonClassificationFields('note')(
                        e.target.value
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row" />
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="col-md-12">
                <DetTable
                  {...this.props.det}
                  onAddPerson={this.props.onAddPerson}
                  onSavePerson={this.props.onSavePerson}
                  onDeletePerson={this.props.onDeletePerson}
                  onChangePerson={this.props.onChangePerson}
                  setDetEditingIndex={this.props.setDetEditingIndex}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row align-items-end">
          <button
            type="button"
            className="btn btn-default"
            onClick={e => {
              e.preventDefault();
              this.props.onCreateNewTaxonRevision();
            }}
          >
            Add new revision
          </button>
        </div>
      </div>
    );
  }
}
export class SexAndStagesComponent extends React.Component<SexAndLifeStageProps> {
  render() {
    return (
      <div className="grid">
        <div className="row">
          <div className="col-md-12">
            <SexAndLifeStageTable {...this.props} />
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

const ClassificationHistoryTable = (props: IClassifications) => {
  console.log(props);
  return (
    <div>
      <table className="table table-condensed table-hover">
        <thead>
          <tr key="event-heading">
            <th>Event type</th>
            <th>Event date</th>
            <th>Person name (Det)</th>
            <th>Event data</th>
          </tr>
        </thead>
        <tbody>
          {props.classifications && props.classifications.length >= 0 ? (
            props.classifications
              .filter(t => t.getEventType && t.getEventType() === 'Taxon')
              .map((t, i) => (
                <tr key={'eventrow-' + (i + 1)}>
                  <td>{t.getEventType && t.getEventType()}</td>
                  <td>{t.getDate && t.getDate()}</td>
                  <td>{t.getPersonData && t.getPersonData()}</td>
                  <td>{t.getEventData && t.getEventData()}</td>
                </tr>
              ))
          ) : (
            <div />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default class ClassificationComponent extends React.Component<Props, IState> {
  constructor(props: Props) {
    const c = {
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

    this.state = new State(c);

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
                {...(this.state
                  .classifications as Classifications).currentTaxonClassification()}
                onCreateNewTaxonRevision={() => {
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
                }}
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
                onChangePerson={(field: string) => (value: string) => {
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
                    console.log('NC', newClassification);
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
        <div className="row">
          <div className="col-md-12">
            <div className="well">
              <h3>Sex and stages</h3>
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

                    const currentClassificationArray = ps.classifications.classifications;
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
                      ...currentClassificationArray.slice(0, currentSexAndStageIndex),
                      newClassification,
                      ...currentClassificationArray.slice(currentSexAndStageIndex + 1)
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
                        editingSexAndStage && editingSexAndStage[fieldName] ? false : true
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
                    {
                      console.log(
                        'ANU: onChangeSexAndLifeStageField',
                        newCurrentClassification
                      );
                    }
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
                    const newSexAndStagesClassification = new SexAndStagesClassification({
                      ...currentSexAndStagesClassification,
                      sexAndStages: newSexAndStages
                    });
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

                    {
                      console.log(
                        'ANU: newCurrentClassifications : ',
                        newCurrentClassifications
                      );
                    }
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
                    const currentClassificationArray = ps.classifications.classifications;
                    const currentSexAndStages =
                      currentSexAndStagesClassification.sexAndStages || [];

                    const newSexAndStage = new SexAndStage({});

                    const newclassification = new SexAndStagesClassification({
                      ...currentSexAndStagesClassification,
                      editingIndex: currentSexAndStages.length,
                      editingSexAndStage: newSexAndStage
                    });

                    const newClassArray = [
                      ...currentClassificationArray.slice(0, currentSexAndStageIndex),
                      newclassification,
                      ...currentClassificationArray.slice(currentSexAndStageIndex + 1)
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
                    const currentClassificationArray = ps.classifications.classifications;
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
                    const newSexAndStagesClassification = new SexAndStagesClassification({
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
                    });
                    const newClassifications = new Classifications({
                      ...ps.classifications,
                      classifications: [
                        ...currentClassificationArray.slice(0, currentSexAndStageIndex),
                        newSexAndStagesClassification,
                        ...currentClassificationArray.slice(currentSexAndStageIndex + 1)
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
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="well">
              <h3>Taxon revisions</h3>
              <ClassificationHistoryTable {...this.state.classifications} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
