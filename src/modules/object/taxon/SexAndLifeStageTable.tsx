import * as React from 'react';
import { sexList, stadiumList } from './constants';
import { CheckBox } from '../components/CheckBox';
import * as FontAwesome from 'react-fontawesome';
import { SexAndStage, SexAndLifeStageProps } from './TaxonClassification';
import { validatePositiveInteger } from '../../../shared/util';

export class SexAndLifeStageTable extends React.Component<SexAndLifeStageProps> {
  render() {
    return (
      <div>
        <div className="row">
          <div>
            <div className="col-md-2">
              <div className="form-group">
                <label htmlFor="sex">Sex</label>
                <select
                  className="form-control"
                  disabled={this.props.editingSexAndStage === undefined}
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
            <div className="col-md-2">
              <div className="form-group">
                <label htmlFor="stage">Stage</label>

                <select
                  className="form-control"
                  disabled={this.props.editingSexAndStage === undefined}
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
            <div className="col-md-1">
              <div className="form-group">
                <label htmlFor="count">Count</label>
                <input
                  id="count"
                  className="form-control"
                  disabled={this.props.editingSexAndStage === undefined}
                  value={
                    this.props.editingSexAndStage && this.props.editingSexAndStage.count
                      ? this.props.editingSexAndStage.count
                      : ''
                  }
                  onChange={e => {
                    e.preventDefault();
                    if (validatePositiveInteger(e.target.value)) {
                      this.props.onChangeSexAndLifeStageField('count')(e.target.value);
                    } else {
                      alert('Count should be positive number');
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-md-1">
              <div className="form-group">
                <label htmlFor="count" />
                <CheckBox
                  id="checkbox-estimated"
                  viewMode={this.props.editingSexAndStage === undefined}
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
          <div className="col-md-6">
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
          </div>
        </div>

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
