import * as React from 'react';
//import FieldMultiSelect from "../../../forms/components/FieldMultiSelect";
//import { PersonPage } from './Person';
import { PersonState, PersonProps, PersonName } from './PersonComponent';

type PersonNameState = {
  title?: string;
  firstName?: string;
  lastName?: string;
};

type AddPersonNameProps = PersonNameProps &
  PersonProps & { location: { state: { newName: string } } };

type AddPersonNameState = {
  visPersonForm: boolean;
  collections?: string;
  personForName: string;
  personName: PersonNameState;
  person: PersonState;
};

type PersonNameProps = PersonNameState & {
  onClick?: () => void;
  showAddPersonButton: () => boolean;
  onChangePersonForPersonname: (val?: string) => void;
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
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-3">
                <label htmlFor="person">Synonyme for</label>
                <select
                  className="form-control"
                  id="person"
                  onChange={e => props.onChangePersonForPersonname(e.target.value)}
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
            {' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
              }}
            >
              Cancel{' '}
            </a>
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
    super(props);
    this.state = {
      visPersonForm: false,
      personName: { firstName: 'Stein', lastName: 'Olsen' },
      personForName: '0',
      person: { synState: 'SEARCH', fullName: { nameString: 'Hei hei' }, collections: [] }
    };
  }

  render() {
    return (
      <div style={{ padding: '25px' }}>
        <PersonName
          firstName={
            this.props.location.state && this.props.location.state.newName
              ? this.props.location.state.newName
              : this.props.firstName
          }
          title={this.props.title}
          lastName={this.props.lastName}
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
        />
      </div>
    );
  }
}

export default AddPersonName;
