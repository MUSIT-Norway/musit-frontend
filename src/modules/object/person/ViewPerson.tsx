import * as React from 'react';
//import FieldMultiSelect from "../../../forms/components/FieldMultiSelect";
import { PersonPage } from './Person';
import { PersonState, PersonProps, PersonName } from './Person';
import { makeRequest } from '../../../shared/ajaxPromise';
import { emitError, emitSuccess } from '../../../shared/errors';
import config from '../../../config';
import { TODO } from '../../../types/common';

type PersonNameState = {
  title?: string;
  firstName?: string;
  lastName?: string;
};

type ViewPersonState = {
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

type Match = {
  match: {
    params: {
      id: number;
    };
  };
};

export class ViewPerson extends React.Component<
  PersonNameProps & PersonProps & Match,
  ViewPersonState
> {
  constructor(props: PersonNameProps & PersonProps & Match) {
    super(props);
    this.state = {
      visPersonForm: false,
      personName: {},
      personForName: '0',
      person: { synState: 'SEARCH' }
    };
  }

  async componentWillMount() {
    if (this.props.match.params.id) {
      try {
       // const url = 'http://localhost:3001/persons/person/';
       const url = config.api.persons.getUrl(this.props.match.params.id as TODO);

        const person: any = await makeRequest({
          method: 'GET',
          url: url // + this.props.match.params.id //b0b7400d-4db0-4908-a326-5286efe56043
        });
        const parsedPerson = JSON.parse(person);
        console.log('person____________', parsedPerson);

        this.setState((ps: ViewPersonState) => ({
          ...ps,
          person: {
            ...ps.person,
            synonymes: parsedPerson.synonyms,
            fullName: {
              firstName: parsedPerson.firstName,
              lastName: parsedPerson.lastName,
              nameString: parsedPerson.name,
              title: parsedPerson.title
            },
            url: parsedPerson.personAttribute.URL,
            //parsedPerson.collections,
            ...parsedPerson.personAttribute
          }
        }));
      } catch (error) {
        emitError({
          type: 'error',
          message: 'Error to get the person.' + JSON.stringify(error)
        });
      }
    }
  }

  async AddNewPerson() {
    if (this.props.match.params.id) {
      try {
        //const url = 'http://localhost:3001/persons/person/';
        const url = config.api.persons.addUrl;
        const person: any = this.state.person;
        const fullName: any = person.fullName;
        await makeRequest({
          method: 'POST',
          url: url,
          params: JSON.stringify({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            title: fullName.title,
            name: fullName.nameString,
            collections: [{ museum_id: 5, collection_id: 10 }],
            personAttribute: {
              legalEntityType: person.legalEntityType || 'Person',
              displayName: fullName.lastName + ', ' + fullName.firstName,
              URL: person.url
            },
            synonyms: [
              {
                firstName: 'Rituvesh',
                lastName: 'Kumar',
                name: 'R. Kumar',
                title: 'Mr.'
              }
            ]
          })
        });
        emitSuccess({
          type: 'saveSuccess',
          message: 'Added the person successfully!'
        });
      } catch (error) {
        emitError({
          type: 'error',
          message: 'Error to get the person.' + JSON.stringify(error)
        });
      }
    }
  }

  async EditPerson() {
    if (this.props.match.params.id) {
      try {
        const url = 'http://localhost:3001/persons/person/edit/';
        const person: any = this.state.person;
        const fullName: any = person.fullName;
        await makeRequest({
          method: 'POST',
          url: url + this.props.match.params.id,
          params: JSON.stringify({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            title: fullName.title,
            name: fullName.nameString,
            collections: [{ museum_id: 5, collection_id: 10 }],
            personAttribute: {
              legalEntityType: person.legalEntityType,
              displayName: fullName.lastName + ', ' + fullName.firstName,
              URL: person.url
            },
            synonyms: [
              {
                firstName: 'Rituvesh',
                lastName: 'Kumar',
                name: 'R. Kumar',
                title: 'Mr.'
              }
            ]
          })
        });
        emitSuccess({
          type: 'saveSuccess',
          message: 'Edited the person successfully!'
        });
      } catch (error) {
        emitError({
          type: 'error',
          message: 'Error to get the person.' + JSON.stringify(error)
        });
      }
    }
  }

  render() {
    return (
      <div style={{ padding: '25px' }}>
        {console.log('State', this.state, this.props.match.params.id)}
        <PersonPage
          {...this.state.person}
          onClickNext={() =>
            this.setState((ps: ViewPersonState) => {
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
          onAddExternalId={() => {
            this.setState((ps: ViewPersonState) => {
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
            this.setState((ps: ViewPersonState) => {
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
          onChangeExternalIds={(field: string) => (value: string) => {
            this.setState((ps: ViewPersonState) => {
              return {
                ...ps,
                person: {
                  ...ps.person,
                  editingIds: {
                    ...ps.person.editingIds,
                    [field]: value
                  }
                }
              };
            });
          }}
          onDeleteExternalId={(index: number) => (
            e: React.SyntheticEvent<HTMLAnchorElement>
          ) => {
            e.preventDefault();
            this.setState((p: ViewPersonState) => {
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
            this.setState((p: ViewPersonState) => {
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
            this.setState((ps: ViewPersonState) => {
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
            this.setState((ps: ViewPersonState) => {
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
            this.setState((ps: ViewPersonState) => {
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
              this.setState((ps: ViewPersonState) => {
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
            this.setState((ps: ViewPersonState) => {
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
        <button style={{ marginLeft: '220px' }} onClick={() => this.AddNewPerson()}>
          ADD Person
        </button>
        <button style={{ marginLeft: '220px' }} onClick={() => this.EditPerson()}>
          Edit Person
        </button>
      </div>
    );
  }
}

export default ViewPerson;
