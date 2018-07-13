import * as React from 'react';
//import FieldMultiSelect from "../../../forms/components/FieldMultiSelect";
import { PersonPage } from './Person';
import { PersonState, PersonProps, PersonName, ExternalId } from './Person';
import { makeRequest } from '../../../shared/ajaxPromise';
import { emitError } from '../../../shared/errors';

type PersonNameState = {
  title?: string;
  firstName?: string;
  lastName?: string;
};

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

type Match = {
  match: {
    params: {
      id: number;
    };
  };
};

export class ViewPerson extends React.Component<
  PersonNameProps & PersonProps & Match,
  AddPersonNameState
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
        const url = 'http://localhost:3001/persons/person/';

        const person: any = await makeRequest({
          method: 'GET',
          url: url + this.props.match.params.id //b0b7400d-4db0-4908-a326-5286efe56043
        });
        const parsedPerson = JSON.parse(person);
        console.log('person____________', parsedPerson);

        this.setState((ps: AddPersonNameState) => ({
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

  render() {
    return (
      <div style={{ padding: '25px' }}>
        {console.log('State', this.state, this.props.match.params.id)}
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
          onChange={(fieldName: string) => (newValue: string) => {
            this.setState((ps: AddPersonNameState) => {
              return {
                ...ps,
                person: { ...ps.person, [fieldName]: newValue }
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
          onAddExternalId={() => {
            this.setState((ps: AddPersonNameState) => {
              const newPersonState = ps.person;
              return {
                ...ps,
                person: {
                  ...newPersonState,
                  externalIds: (newPersonState.externalIds || []).concat([
                    { database: '', uuid: '' }
                  ])
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
          onChangeExternalIds={(index: number) => (fn: string) => (value: string) => {
            this.setState((ps: AddPersonNameState) => {
              const newPersonState = ps.person;
              const newExternalIDItem: ExternalId =
                newPersonState.externalIds && newPersonState.externalIds[index]
                  ? { ...newPersonState.externalIds[index], [fn]: value }
                  : { [fn]: value };

              return {
                ...ps,
                person: {
                  ...newPersonState,
                  externalIds: newPersonState.externalIds
                    ? [
                        ...newPersonState.externalIds.slice(0, index),
                        newExternalIDItem,
                        ...newPersonState.externalIds.slice(index + 1)
                      ]
                    : []
                }
              };
            });
          }}
        />
      </div>
    );
  }
}

export default ViewPerson;
