// @flow

import React from 'react';
import FieldMultiSelect from '../../forms/components/FieldMultiSelect';

type StateProps = {
  visPersonForm: boolean,
  collectionsString?: string
};
type PersonNameProps = {
  title?: string,
  firstName?: string,
  lastName?: string,
  onClick?: () => void
};

type PersonProps = {
  displayName?: string,
  legalEntityType?: string,
  onChangeCollections: Function,
  collectionsString?: string
};

const Person = (props: PersonProps) => (
  <div>
    <form style={{ padding: '25px' }}>
      <h3>Add new person</h3>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="displayName">Display name</label>
          <input type="text" className="form-control" id="displayName" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="legal-entity">Legal entity type</label>
          <select type="text" className="form-control" id="legal-entity">
            <option>Person</option>
            <option>Gruppe</option>
            <option>Organisasjon</option>
            <option>Institusjon</option>
            <option>Firma</option>
          </select>
        </div>
      </div>
      <FieldMultiSelect
        stringValue={props.collectionsString}
        labelAbove
        options={[
          { label: 'Lav', value: 'L' },
          { label: 'Karplanter', value: 'V' },
          { label: 'Mose', value: 'M' },
          { label: 'Alger', value: 'A' },
          { label: 'Sopp', value: 'F' },
          { label: 'Terristiske evertebrater', value: 'TI' },
          { label: 'Terristiske evertebrater', value: 'MI' }
        ]}
        multi={false}
        onChange={v => props.onChangeCollections(v)}
        title="Samlinger for person"
      />
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="bornDate">Født</label>
          <input type="text" className="form-control" id="bornDate" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="deadDate">Død</label>
          <input type="text" className="form-control" id="deadDate" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-6">
          <table className="table table-bordered form-group">
            <thead>
              <tr>
                <th>Database</th>
                <th>Ekstern identifikator (UUID)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select>
                    <option>HUH</option>
                    <option>ISNI</option>{' '}
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control" id="row1" />
                </td>
              </tr>
              <tr>
                <td>
                  <select>
                    <option>HUH</option>
                    <option>ISNI</option>{' '}
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control" id="row1" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-6">
          <label htmlFor="url">URL</label>
          <input type="text" className="form-control" id="url" />
        </div>
      </div>
    </form>
  </div>
);

const PersonName = (props: PersonNameProps) => (
  <div>
    {' '}
    <form style={{ padding: '25px' }}>
      <h3>Person-name</h3>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" id="title" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="first-name">First name</label>
          <input type="text" className="form-control" id="first-name" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="last-name">Last name</label>
          <input type="text" className="form-control" id="Last-name" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="person">Synonyme for</label>
          <select className="form-control" id="person">
            <option>And, Arne</option>
            <option>Duck, Dolly</option>
            <option>Duck, Donald</option>
            <option>Mus, Mikke</option>
            <option>Kent, Clark</option>
            <option>Wayne, Bruce</option>
            <option>Parker, Peter</option>
            <option>Lane, Louise</option>
          </select>
          <button type="button" className="btn btn-default" onClick={props.onClick}>
            Ny person
          </button>
        </div>
      </div>
    </form>
  </div>
);

export class AddPersonName extends React.Component<
  PersonNameProps & PersonProps,
  StateProps
> {
  constructor(props: PersonNameProps & PersonProps) {
    super(props);
    this.state = { visPersonForm: false };
    this.onChangeCollections = this.onChangeCollections.bind(this);
  }
  onChangeCollections = (v: string) => {
    this.setState((p: StateProps, props: PersonProps) => {
      return {
        ...p,
        collectionsString: v
      };
    });
  };
  render() {
    return (
      <div>
        <PersonName
          firstName={this.props.firstName}
          title={this.props.title}
          lastName={this.props.lastName}
          onClick={() =>
            this.setState((prev: any, props: PersonNameProps) => ({
              ...prev,
              visPersonForm: true
            }))}
        />
        {this.state.visPersonForm && (
          <Person
            displayName={this.props.displayName}
            onChangeCollections={this.onChangeCollections}
            collectionsString={this.state.collectionsString}
          />
        )}
      </div>
    );
  }
}

export default AddPersonName;
