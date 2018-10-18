import * as React from 'react';
//import FieldMultiSelect from "../../../forms/components/FieldMultiSelect";
//import { PersonPage } from './Person';
import { PersonName } from './PersonComponent';

/* type PersonNameState = {
  title?: string;
  firstName?: string;
  lastName?: string;
  nameString?: string;
}; */

type AddPersonNameProps = PersonNameProps & { match: { params: { newName: string } } };

type AddPersonNameState = {
  visPersonForm: boolean;
  collections?: string;
  personForName: string;
  personName: PersonName;
  // person: PersonState;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
};

type PersonNameProps = PersonName & {
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  onClick?: () => void;
  showAddPersonButton: () => boolean;
  onChangePersonForPersonname: (val?: string) => void;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
};

const PersonName = (props: PersonNameProps) => (
  <div className="container">
    <div className="panel panel-default">
      <div className="panel-body">
        <form>
          <div className="well">
            {' '}
            <h3>Person-name</h3>
            <div className="form-group row">
              <div className="col-sm-3">
                <label htmlFor="title">Title</label>
                <input
                  value={props.title}
                  type="text"
                  className="form-control"
                  id="title"
                  onChange={e => props.onChangeFullName('title')(e.target.value)}
                  disabled={props.disableOnChangeOtherName}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-3">
                <label htmlFor="first-name">First name</label>
                <input
                  value={props.firstName}
                  type="text"
                  className="form-control"
                  id="first-name"
                  onChange={e => props.onChangeFullName('firstName')(e.target.value)}
                  disabled={props.disableOnChangeOtherName}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-3">
                <label htmlFor="last-name">Last name</label>
                <input
                  value={props.lastName}
                  type="text"
                  className="form-control"
                  id="Last-name"
                  onChange={e => props.onChangeFullName('lastName')(e.target.value)}
                  disabled={props.disableOnChangeOtherName}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-3">
                <label htmlFor="last-name">Navn</label>
                <input
                  value={props.nameString}
                  type="text"
                  className="form-control"
                  id="name"
                  onChange={e => props.onChangeFullName('nameString')(e.target.value)}
                  disabled={props.disableOnChangeFullName}
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-3">
                <label htmlFor="person">Synonyme for</label>
                <select
                  className="form-control"
                  id="person"
                  //onChange={e => props.onChangePersonForPersonname(e.target.value)}
                >
                  <option value="0">--No person--</option>
                  <option value="1">And, Arne</option>
                  <option value="2">Duck, Dolly</option>
                  <option value="3">Duck, Donald</option>
                  <option value="4">Mus, Mikke</option>
                  <option value="5">Kent, Clark</option>
                  <option value="6">Wayne, Bruce</option>
                  <option value="7">Parker, Peter</option>
                  <option value="8">Lane, Louise</option>
                </select>
                {props.showAddPersonButton() ? (
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={props.onClick}
                  >
                    Ny person
                  </button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="panel-footer">
        <div className="row">
          <div className="col-md-12" style={{ textAlign: 'right' }}>
            <button type="button" className="btn btn-link" onClick={() => {}}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export class AddPersonName extends React.Component<
  AddPersonNameProps,
  AddPersonNameState
> {
  constructor(props: AddPersonNameProps) {
    console.log('NEWNAME: ', props.match.params.newName);
    super(props);
    this.state = {
      visPersonForm: false,
      personName: {
        firstName:
          this.props.match.params && this.props.match.params.newName
            ? this.props.match.params.newName
            : props.firstName
              ? props.firstName
              : '',
        lastName: props.lastName ? props.lastName : '',
        nameString: props.nameString ? props.nameString : ''
      },
      personForName: '0',
      disableOnChangeOtherName: false,
      disableOnChangeFullName:
        this.props.match.params && this.props.match.params.newName ? true : false
    };
  }

  render() {
    return (
      <div style={{ padding: '25px' }}>
        <PersonName
          firstName={this.state.personName && this.state.personName.firstName}
          title={this.state.personName && this.props.title}
          lastName={this.state.personName && this.props.lastName}
          nameString={this.state.personName && this.props.nameString}
          disableOnChangeFullName={this.state.disableOnChangeFullName}
          disableOnChangeOtherName={this.state.disableOnChangeOtherName}
          showAddPersonButton={() => {
            return this.state.personForName === '0' ? true : false;
          }}
          onChangePersonForPersonname={(v: string) => {
            this.setState((ps: AddPersonNameState) => {
              return {
                ...ps,
                personForName: v,
                visPersonForm: ps.visPersonForm && v === '1' ? false : ps.visPersonForm
              };
            });
          }}
          onClick={() =>
            this.setState((prev: any, props: PersonNameProps) => ({
              ...prev,
              visPersonForm: true
            }))
          }
          onChangeFullName={(fieldName: string) => (value: string) => {
            this.setState((ps: AddPersonNameState) => {
              const lastName =
                fieldName === 'lastName'
                  ? value
                  : ps.personName && ps.personName.lastName
                    ? ps.personName.lastName
                    : '';
              const title =
                fieldName === 'title'
                  ? value
                  : ps.personName && ps.personName.title
                    ? ps.personName.title
                    : '';
              const firstName =
                fieldName === 'firstName'
                  ? value
                  : ps.personName && ps.personName.firstName
                    ? ps.personName.firstName
                    : '';
              const nameString = `${lastName || ''}${
                title || firstName ? ', ' : ''
              }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

              const disableOnChangeFullName =
                lastName || title || firstName ? true : false;

              let disableOnChangeOtherName = false;
              if (fieldName === 'nameString') {
                disableOnChangeOtherName = true;

                if (value === '') {
                  disableOnChangeOtherName = false;
                }
              }

              return {
                ...ps,
                personName: {
                  ...ps.personName,
                  nameString,
                  [fieldName]: value
                },
                disableOnChangeFullName: disableOnChangeFullName,
                disableOnChangeOtherName: disableOnChangeOtherName
              };
            });
          }}
        />
      </div>
    );
  }
}

export default AddPersonName;
