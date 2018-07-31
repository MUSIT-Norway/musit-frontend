import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import { TaxonSuggest } from '../../../components/suggest/TaxonSuggest';
import {
  TaxonClassificationProps,
  ScientificName,
  ITaxonTerm,
  appSession
} from './TaxonClassification';

export class TaxonTable extends React.Component<TaxonClassificationProps> {
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
