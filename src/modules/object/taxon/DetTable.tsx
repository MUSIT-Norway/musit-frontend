import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
//import { Link } from 'react-router-dom';
import { PersonNameSuggest } from '../../../components/suggest/PersonNameSuggest';
import AdmplaceSuggest from '../../../components/suggest/AdmPlaceSuggest';
import { DetProps, IPersonName } from './TaxonClassification';
import { personDet } from '../../../models/object/classHist';
import { AdmPlace } from '../../../models/object/place';

class DetTable extends React.Component<DetProps> {
  constructor(props: DetProps) {
    super(props);
  }

  render() {
    const admPlaceAsString = (a: AdmPlace) => {
      return (
        <span className="suggestion-content">
          {a.name ? 'Admplace: ' + a.name + '(' + a.type + ')  Path : ' + a.path : ''}
        </span>
      );
    };
    const personNameAsString = (n: personDet) => {
      return (
        <span className="suggestion-content">
          {n.name ? 'Full Name: ' + n.name + ' last Name : ' + n.lastName : ''}
        </span>
      );
    };
    return (
      <div>
        <div className="row">
          <AdmplaceSuggest
            id="personNameSuggest"
            disabled={this.props.editingDet === undefined}
            value={
              this.props.editingDet && this.props.editingDet.personName
                ? this.props.editingDet.personName || ''
                : ''
            }
            renderFunc={admPlaceAsString}
            placeHolder="Admplace"
            appSession={this.props.appSession}
            onChange={this.props.onChangePersonDet}
            history={this.props.history}
          />
        </div>
        <div className="row">
          <PersonNameSuggest
            id="personNameSuggest"
            disabled={this.props.editingDet === undefined}
            value={
              this.props.editingDet && this.props.editingDet.personName
                ? this.props.editingDet.personName || ''
                : ''
            }
            renderFunc={personNameAsString}
            placeHolder="Person Name"
            appSession={this.props.appSession}
            onChange={this.props.onChangePersonDet}
            history={this.props.history}
            labelText="Det"
            hideCreateNewPerson={false}
          />
        </div>
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
      </div>
    );
  }
}

export default DetTable;
