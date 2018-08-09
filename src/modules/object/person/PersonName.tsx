import * as React from 'react';
//import FieldMultiSelect from "../../../forms/components/FieldMultiSelect";
import { PersonPage } from './Person';
import { PersonState, PersonProps, PersonName } from './Person';
import {
  EditList,
  editListProps,
  databaseOption,
  databaseOptions
} from '../components/EditList';
import { dataBaseValues } from './mockdata/data';

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
      personName: {},
      personForName: '0',
      person: { synState: 'SEARCH' }
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
        {this.state.visPersonForm && (
          <PersonPage
            {...this.state.person}
            onClickNext={() =>
              this.setState((ps: AddPersonNameState) => {
                const nextState =
                  ps.person.synState === 'SEARCH'
                    ? 'SYNONYMIZE'
                    : ps.person.synState === 'SYNONYMIZE'
                      ? 'CONFIRM'
                      : 'SEARCH';
                return {
                  ...ps,
                  person: { ...ps.person, synState: nextState }
                };
              })
            }
            dataBaseValues={dataBaseValues}
            onAddExternalId={() => {
              this.setState((ps: AddPersonNameState) => {
                const newPersonState = ps.person;
                const editIndex =
                  newPersonState.externalIds && newPersonState.externalIds.length
                    ? newPersonState.externalIds.length
                    : 0;
                const editItem = {};
                return {
                  ...ps,
                  person: {
                    ...newPersonState,
                    editingIds: editItem,
                    editingIndex: editIndex
                  }
                };
              });
            }}
            onSaveExternalId={() => {
              this.setState((ps: AddPersonNameState) => {
                const newPersonState = ps.person;
                const editIndex = newPersonState.editingIndex
                  ? newPersonState.editingIndex
                  : 0;
                const currentEditItem = newPersonState.editingIds;
                const currentExternalIds =
                  (newPersonState.externalIds && newPersonState.externalIds) || [];
                const nextExternalIds = currentEditItem
                  ? [
                      ...currentExternalIds.slice(0, editIndex),
                      currentEditItem,
                      ...currentExternalIds.slice(editIndex + 1)
                    ]
                  : currentExternalIds;

                return {
                  ...ps,
                  person: {
                    ...newPersonState,
                    externalIds: nextExternalIds,
                    editingIndex: undefined,
                    editingIds: undefined
                  }
                };
              });
            }}
            onChangeExternalIds={(fn: string) => (value: string) => {
              this.setState((ps: AddPersonNameState) => {
                return {
                  ...ps,
                  person: {
                    ...ps.person,
                    editingIds: {
                      ...ps.person.editingIds,
                      [fn]: value
                    }
                  }
                };
              });
            }}
            onChangeDbValue={(inputValue: databaseOption) => {
              this.setState((ps: AddPersonNameState) => {
                return {
                  ...ps,
                  person: {
                    ...ps.person,
                    editingIds: {
                      ['database']: inputValue.label
                    }
                  }
                };
              });
            }}
            onDeleteExternalId={(index: number) => (
              e: React.SyntheticEvent<HTMLAnchorElement>
            ) => {
              e.preventDefault();
              this.setState((p: AddPersonNameState) => {
                const personState = p.person;
                const newExteralIDItem = (personState.externalIds
                  ? personState.externalIds.slice(0, index)
                  : []
                ).concat(
                  personState.externalIds ? personState.externalIds.slice(index + 1) : []
                );
                return {
                  ...p,
                  person: {
                    ...personState,
                    externalIds: newExteralIDItem
                  }
                };
              });
            }}
            setEditingIndex={(index: number) => {
              this.setState((p: AddPersonNameState) => {
                const personState = p.person;
                const editingItem =
                  personState.externalIds && personState.externalIds[index];
                return {
                  ...p,
                  person: {
                    ...personState,
                    editingIndex: index,
                    editingIds: editingItem
                  }
                };
              });
            }}
            onChange={(fieldName: string) => (newValue: string) => {
              this.setState((ps: AddPersonNameState) => {
                return {
                  ...ps,
                  person: { ...ps.person, [fieldName]: newValue }
                };
              });
            }}
            onChangeBornDate={() => {
              return;
            }}
            onChangeDeathDate={() => {
              return;
            }}
            onClearBornDate={() => {
              return;
            }}
            onClearDeathDate={() => {
              return;
            }}
            onChangeFullName={(fieldName: string) => (value: string) => {
              this.setState((ps: AddPersonNameState) => {
                const newPersonState = ps.person;

                const lastName =
                  fieldName === 'lastName'
                    ? value
                    : newPersonState.fullName && newPersonState.fullName.lastName;
                const title =
                  fieldName === 'title'
                    ? value
                    : newPersonState.fullName && newPersonState.fullName.title;
                const firstName =
                  fieldName === 'firstName'
                    ? value
                    : newPersonState.fullName && newPersonState.fullName.firstName;
                const nameString = `${lastName || ''}${
                  title || firstName ? ', ' : ''
                }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

                return {
                  ...ps,
                  person: {
                    ...newPersonState,
                    fullName: {
                      ...newPersonState.fullName,
                      nameString,
                      [fieldName]: value
                    }
                  }
                };
              });
            }}
            onChangePersonName={(fieldName: string) => (value: string) => {
              this.setState((ps: AddPersonNameState) => {
                const newPersonState = ps.person;

                const lastName =
                  fieldName === 'lastName'
                    ? value
                    : newPersonState.newPerson && newPersonState.newPerson.lastName;
                const title =
                  fieldName === 'title'
                    ? value
                    : newPersonState.newPerson && newPersonState.newPerson.title;
                const firstName =
                  fieldName === 'firstName'
                    ? value
                    : newPersonState.newPerson && newPersonState.newPerson.firstName;
                const nameString = `${lastName || ''}${
                  title || firstName ? ', ' : ''
                }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

                return {
                  ...ps,
                  person: {
                    ...newPersonState,
                    newPerson: {
                      ...newPersonState.newPerson,
                      nameString,
                      [fieldName]: value
                    }
                  }
                };
              });
            }}
            onClickAdd={(newPersonName?: PersonName) => {
              if (newPersonName) {
                this.setState((ps: AddPersonNameState) => {
                  const pn = ps.person;
                  return {
                    ...ps,
                    person: {
                      ...pn,
                      synonymes:
                        newPersonName && (pn.synonymes || []).concat([newPersonName]),
                      newPerson: undefined
                    }
                  };
                });
              }
            }}
            onChangeCollections={(v: string) => {
              this.setState((ps: AddPersonNameState) => {
                console.log(ps, v);
                const person = {
                  ...ps.person,
                  collections: ps.collections ? ps.collections + ',' + v : v
                };
                return {
                  ...ps,
                  person
                };
              });
            }}
          />
        )}
      </div>
    );
  }
}

export default AddPersonName;
