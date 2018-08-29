import * as React from 'react';
import DetTable from './DetTable';
import { TaxonTable } from './TaxonTable';
import { TaxonClassificationProps } from './TaxonClassification';
//import { ClassificationHistoryTable } from './ClassificationHistoryTable';

export class TaxonComponent extends React.Component<TaxonClassificationProps> {
  render() {
    return (
      <div className="container-fluid">
        <div className="panel-group">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title" />
            </div>
            <div id="collapse1" className="panel-collapse collapse">
              <div className="panel-body">Panel Body</div>
              <div className="panel-footer">Panel Footer</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-12">
                <TaxonTable {...this.props} />
              </div>
            </div>
            <br />
          </div>
          <div className="col-md-3">
            <div className="row">
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

            <div className="row">
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
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="form-group">
                <label htmlFor="taxonNote">Note</label>
                <textarea
                  className="form-control"
                  id="taxonNote"
                  rows={5}
                  onChange={e => {
                    e.preventDefault();
                    this.props.onChangeTaxonClassificationFields('note')(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row align-items-end">
          {/* <button
            type="button"
            className="btn btn-default"
            onClick={e => {
              e.preventDefault();
              this.props.onCreateNewTaxonRevision();
            }}
          >
            Add new revision
          </button> */}
        </div>
      </div>
    );
  }
}
