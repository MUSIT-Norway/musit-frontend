import * as React from 'react';
import DatePicker from '../../../components/DatePicker';
import * as FontAwesome from 'react-fontawesome';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';
import {} from '../../../stores/appSession';
import { AppSession } from '../../../types/appSession';
import {
  OutputPerson,
  PersonName as StorePersonName
} from '../../../models/object/person';
//import { throws } from 'assert';
import { PersonStoreState } from './PersonStore';
import { EditList, databaseOption, databaseOptions } from '../components/EditList';
import { dataBaseValues } from './mockdata/data';
import { History } from 'history';
import config from '../../../config';
import { AjaxResponse } from 'rxjs';
import { museumCollection, collections, museum } from '../person/mockdata/data';

export type PersonName = {
  title?: string;
  firstName?: string;
  lastName?: string;
  nameString: string;
};

export type ExternalId = {
  database?: string;
  uuid?: string;
};
export type SynState = 'SEARCH' | 'SYNONYMIZE' | 'CONFIRM';
export type SynProps = { state: SynState; synPersons: SynPersons } & {
  onClickNext: () => void;
};

export type SynPersons = {
  fullName: string;
  bornDate?: string;
  synonymes?: string;
}[];

type Collection = { museum_id: number; collection_id: number };

export interface PersonState {
  uuid?: string;
  fullName: PersonName;
  legalEntityType: string;
  synState: SynState;
  url?: string;
  externalIds?: ExternalId[];
  editingIds?: ExternalId;
  editingIndex?: number;
  synonymes?: PersonName[];
  newPerson?: PersonName;
  bornDate?: string;
  deadDate?: string;
  collections: Collection[];
  museumAffiliation?: string;
}

export class PersonState implements PersonState {
  uuid?: string;
  fullName: PersonName;
  legalEntityType: string;
  synState: SynState;
  url?: string;
  externalIds?: ExternalId[];
  editingIds?: ExternalId;
  editingIndex?: number;
  synonymes?: PersonName[];
  newPerson?: PersonName;
  bornDate?: string;
  deadDate?: string;
  verbatimDate?: string;
  collections: Collection[];
  museumAffiliation?: string;

  constructor(
    fullName: PersonName,
    legalEntityType: string,
    collections: Collection[],
    synState: SynState,
    uuid?: string,
    url?: string,
    externalIds?: ExternalId[],
    synonymes?: PersonName[],
    newPerson?: PersonName,
    bornDate?: string,
    deadDate?: string,
    museumAffiliation?: string
  ) {
    this.uuid = uuid;
    this.fullName = fullName;
    this.legalEntityType = legalEntityType;
    this.synState = synState;
    this.url = url;
    this.externalIds = externalIds;
    this.synonymes = synonymes;
    this.newPerson = newPerson;
    this.bornDate = bornDate;
    this.deadDate = deadDate;
    this.collections = collections;
    this.museumAffiliation = museumAffiliation;
  }
}

export type PersonProps = PersonState & {
  onClickSave: Function;
  appSession: AppSession;
  onChange: (fieldName: string) => (newValue: string) => void;
  onChangePersonName: (fieldName: string) => (newValue: string) => void;
  onClickAddPersonName: (newPersonName?: PersonName) => void;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onAddExternalId: () => void;
  onSaveExternalId: () => void;
  onClickNext: () => void;
  onChangeCollections: (newString: string) => void;
  onDeleteExternalId: (i: number) => (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
  onChangeExternalIds: (field: string) => (value: string) => void;
  setEditingIndex: (i: number) => void;
  onChangeDbValue: (inputValue: databaseOption) => void; //=> (event: React.SyntheticEvent<HTMLSelectElement>)
  dataBaseValues: databaseOptions;
  onClearBornDate: Function;
  onChangeBornDate: Function;
  onClearDeathDate: Function;
  onChangeDeathDate: Function;
  heading?: string;
  standAlone?: boolean;
  readOnly?: boolean;
};

const ExternalIDStrings = (props: {
  editingIndex?: number;
  externalIds?: ExternalId[];
  editingIds?: ExternalId;
  dataBaseValues: databaseOptions;
  onAdd: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onSave: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onChange: (field: string) => (value: string) => void;
  onDelete: (i: number) => (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
  setEditingIndex: (i: number) => void;
  onChangeDbValue: (inputValue: databaseOption) => void; //(event: React.SyntheticEvent<HTMLSelectElement>) =>
}) => (
  <div>
    <h4>External ID's</h4>
    <div className="grid">
      {props.externalIds &&
        props.externalIds.length > 0 && (
          <div className="row">
            <table className="table table-condensed table-hover">
              <thead className="row">
                <tr className="row">
                  <th className="col-md-2">
                    <b>Database</b>
                  </th>
                  <th className="col-md-2">
                    <b> UUID</b>
                  </th>
                  <th className="col-md-2">
                    <b> </b>
                  </th>
                  <th className="col-md-2">
                    <b> </b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.externalIds.map((e, i) => (
                  <tr key={`tr-row${i}`} className="row">
                    <td className="col-md-2"> {e.database}</td>
                    <td className="col-md-2">{e.uuid}</td>
                    <td className="col-md-2">
                      <a
                        href=""
                        onClick={e => {
                          e.preventDefault();
                          props.setEditingIndex(i);
                        }}
                      >
                        <FontAwesome name="edit" />
                      </a>
                    </td>
                    <td className="col-md-2">
                      <a href="" onClick={props.onDelete(i)}>
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      {props.editingIndex !== undefined && (
        <div className="row">
          <div className="col-sm-2 form-group">
            <EditList
              dataBaseValues={props.dataBaseValues}
              editingValue={
                props.editingIds && props.editingIds.database
                  ? props.editingIds.database
                  : ''
              }
              onChangeSelection={props.onChangeDbValue}
            />
          </div>
          <div className="col-sm-2 form-group">
            <input
              className="form-control"
              value={props.editingIds && props.editingIds.uuid}
              onChange={e => props.onChange('uuid')(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
    <div>
      <button
        type="button"
        className="btn btn-default"
        onClick={props.onAdd}
        disabled={props.editingIndex !== undefined}
      >
        Add new external ID
      </button>
      <button
        type="button"
        className="btn btn-default"
        onClick={props.onSave}
        disabled={props.editingIndex === undefined}
      >
        Save external ID
      </button>
    </div>
  </div>
);
const SynDo = (props: { synPersons: SynPersons; onClickNext: () => void }) => {
  return (
    <div>
      <b style={{ color: 'red' }}>
        Her kommer liste over valge personer å synonymisere, og knapp som utfører
        synonymiseringen (# {props.synPersons.length})
      </b>
      <br />
      <button
        type="button"
        className="btn btn-default"
        onClick={() => {
          props.onClickNext();
        }}
      >
        Next
      </button>
    </div>
  );
};

const SynSearch = (props: SynProps) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-3">
          <div className="input-group">
            <input type="text" className="form-control" id="inputSynSearch" />
            <div className="input-group-btn">
              <button className="btn btn-default" onClick={props.onClickNext}>
                Søk
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <b style={{ color: 'red' }}>
            Man søker opp navn man vil synonymisere, får opp en liste, velger fra denne,
            og går videre
          </b>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <table className="table">
            <thead>
              <tr>
                <th>Person name</th>
                <th> Born date</th>
                <th>Synonymes</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Olsen, Stein</td>
                <td>11.03.1967</td>
                <td>Olsen, Stein; SAO; S.A.Olsen; Stein Alexander Olsen</td>
                <td>
                  <input type="checkbox" value="" />
                </td>
              </tr>
              <tr>
                <td>Glenndal, Svein Gunnar</td>
                <td>11.03.1971</td>
                <td>Glenndal, Svein; SGG; Glennis; S.G. Glenndal</td>
                <td>
                  <input type="checkbox" value="" />
                </td>
              </tr>
              <tr>
                <td>Løfall, Bjørn Petter</td>
                <td>01.03.1966</td>
                <td>BPL; Løfall, B.P.; Løfall, Bjørn P; Løfall</td>
                <td>
                  <input type="checkbox" value="" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-1">
          <button
            className="btn btn-default"
            onClick={e => {
              e.preventDefault();
              props.onClickNext();
            }}
          >
            Neste
          </button>
        </div>
      </div>
    </div>
  );
};

const Synonymizer = (props: SynProps) => {
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">
          <h4>Synonymizer</h4>
        </div>
        <ul className="nav nav-pills">
          <li className={props.state === 'SEARCH' ? 'active' : ''}>
            <a
              href=""
              onClick={e => {
                e.preventDefault();
              }}
            >
              Find persons
            </a>
          </li>
          <li className={props.state === 'SYNONYMIZE' ? 'active' : ''}>
            <a href="">Do synonymizing</a>
          </li>
          <li className={props.state === 'CONFIRM' ? 'active' : ''}>
            <a href="">Confirm</a>
          </li>
        </ul>
      </div>
      <div className="panel-body">
        {props.state === 'SEARCH' ? (
          <SynSearch
            onClickNext={props.onClickNext}
            synPersons={props.synPersons}
            state={props.state}
          />
        ) : props.state === 'SYNONYMIZE' ? (
          <SynDo synPersons={props.synPersons} onClickNext={props.onClickNext} />
        ) : (
          <div>
            <b style={{ color: 'red' }}>Her skal man bekrefte synonymiseringen</b>
            <br />
            <button type="button" className="btn btn-default">
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AddPersonName = (props: {
  newPerson?: PersonName;
  onChange: (fieldName: string) => (value: string) => void;
  heading?: string;
  standAlone?: boolean;
}) => (
  <div>
    <h4> Add one or more synonymes</h4>
    {props.standAlone ||
      (props.heading && <h5 style={{ color: 'red' }}>{props.heading}</h5>)}
    <div className="row">
      <div className="col-sm-3 form-group">
        <label htmlFor="title"> Tittel </label>
        <input
          id="title"
          className="form-control"
          type="text"
          value={(props.newPerson && props.newPerson.title) || ''}
          onChange={e => props.onChange('title')(e.target.value)}
        />
      </div>{' '}
      <div className="col-sm-3 form-group">
        <label htmlFor="firstName"> Fornavn </label>
        <input
          id="firstName"
          className="form-control"
          type="text"
          value={(props.newPerson && props.newPerson.firstName) || ''}
          onChange={e => props.onChange('firstName')(e.target.value)}
        />
      </div>{' '}
      <div className="col-sm-3 form-group">
        <label htmlFor="lastName"> Etternavn </label>
        <input
          id="lastName"
          className="form-control"
          type="text"
          value={(props.newPerson && props.newPerson.lastName) || ''}
          onChange={e => props.onChange('lastName')(e.target.value)}
        />
      </div>
    </div>
  </div>
);

const PersonNames = (props: {
  synonymes?: Array<PersonName>;
  newPerson?: PersonName;
  onChange: Function;
  onClickAdd: (newPersonName: PersonName) => void;
}) => (
  <div>
    <h3>Synonymer</h3>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Title</th>
          <th>First name</th>
          <th>Last Name</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {props.synonymes &&
          props.synonymes.map((s, i) => (
            <tr key={`rowno_${i}`}>
              <td>{s.title}</td>
              <td>{s.firstName}</td>
              <td>{s.lastName}</td>
              <td>{s.nameString}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export const PersonPage = (props: PersonProps) => {
  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-body">
          <form>
            <div className="well">
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label htmlFor="legalEntityType">Legal entity type</label>
                    {!!!props.readOnly ? (
                      <select
                        className="form-control"
                        id="legalEntityType"
                        value={props.legalEntityType}
                        onChange={v => {
                          console.log('sssdsds', v.target.value);
                          props.onChange('legalEntityType')(v.target.value);
                        }}
                      >
                        <option value="person">Person</option>
                        <option value="group">Group</option>
                        <option value="organisasion">Organisation</option>
                        <option value="institution">Institution</option>
                        <option value="business">Business</option>
                      </select>
                    ) : (
                      <div className="form-control-static">{props.legalEntityType}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-8">
                  <FieldMultiSelect
                    stringValue={props.collections.join(',')}
                    viewMode={props.readOnly}
                    labelAbove={true}
                    options={museumCollection.map((e, i) => ({
                      label: `${museum[e.museumId] && museum[e.museumId].abbreviation} -
                            ${(collections[e.collectionId] &&
                              collections[e.collectionId].collectionName) ||
                              ''}`,
                      value: i
                    }))}
                    singleSelect={false}
                    onChange={(event: string) => {
                      props.onChangeCollections(event);
                    }}
                    values={props.collections}
                    title="Samlinger for person"
                  />
                </div>
              </div>
              <div className="well well-sm">
                <h4>Full name</h4>
                <div className="row">
                  <div className="col-sm-3 form-group">
                    <label htmlFor="title"> Tittel </label>
                    <input
                      id="title"
                      className="form-control"
                      type="text"
                      value={(props.fullName && props.fullName.title) || ''}
                      onChange={e => props.onChangeFullName('title')(e.target.value)}
                    />
                  </div>{' '}
                  <div className="col-sm-3 form-group">
                    <label htmlFor="firstName"> Fornavn </label>
                    <input
                      id="firstName"
                      className="form-control"
                      type="text"
                      value={(props.fullName && props.fullName.firstName) || ''}
                      onChange={e => props.onChangeFullName('firstName')(e.target.value)}
                    />
                  </div>{' '}
                  <div className="col-sm-3 form-group">
                    <label htmlFor="lastName"> Etternavn </label>
                    <input
                      id="lastName"
                      className="form-control"
                      type="text"
                      value={(props.fullName && props.fullName.lastName) || ''}
                      onChange={e => props.onChangeFullName('lastName')(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-3">
                  <label htmlFor="bornDate"> Født dato</label>
                  <DatePicker
                    onClear={props.onClearBornDate}
                    onChange={props.onChangeBornDate}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="deathDate"> Død dato</label>
                  <DatePicker
                    onClear={props.onClearDeathDate}
                    onChange={props.onChangeDeathDate}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="verbatimDate"> Verbatim dato</label>
                  <input className="form-control" type="text" id="verbatimDate" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="url"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    props.onChange('url')(e.target.value)
                  }
                />
              </div>
            </div>
            <div className="well well-sm">
              {props.synonymes &&
                props.synonymes.length > 0 && (
                  <PersonNames
                    synonymes={props.synonymes}
                    newPerson={props.newPerson}
                    onChange={props.onChange}
                    onClickAdd={props.onClickAddPersonName}
                  />
                )}

              <AddPersonName
                newPerson={props.newPerson}
                onChange={props.onChangePersonName}
                standAlone={props.standAlone}
                heading="Skal denne vises når man kommer fra person name?"
              />

              <button
                type="button"
                className="btn btn-default"
                onClick={() => props.onClickAddPersonName(props.newPerson)}
              >
                Add person name
              </button>
            </div>
            <div className="well well-sm">
              <ExternalIDStrings
                editingIndex={props.editingIndex}
                externalIds={props.externalIds}
                editingIds={props.editingIds}
                onAdd={props.onAddExternalId}
                onSave={props.onSaveExternalId}
                onChange={props.onChangeExternalIds}
                onDelete={props.onDeleteExternalId}
                setEditingIndex={props.setEditingIndex}
                onChangeDbValue={props.onChangeDbValue}
                dataBaseValues={props.dataBaseValues}
              />
            </div>
            {props.standAlone && (
              <Synonymizer
                state={props.synState}
                onClickNext={props.onClickNext}
                synPersons={[]}
              />
            )}
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => props.onClickSave(props.appSession)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const toFrontend: (p: OutputPerson) => PersonState = (p: OutputPerson) => {
  const innP: OutputPerson = p;
  if (innP) {
    const r = new PersonState(
      { firstName: innP.firstName, lastName: innP.lastName, nameString: innP.name },
      innP.personAttribute ? innP.personAttribute.legalEntityType : '',
      innP.collections,
      'SEARCH',
      innP.personUuid,
      innP.personAttribute && innP.personAttribute.URL,
      [],
      innP.synonyms &&
        innP.synonyms.map((p: StorePersonName) => ({
          nameString: p.name,
          firstName: p.firstName,
          lastName: p.lastName,
          title: p.title
        })),
      undefined,
      innP.personAttribute && innP.personAttribute.bornDate,
      innP.personAttribute && innP.personAttribute.deathDate,
      undefined
    );
    return r;
  }
  return {
    fullName: { nameString: 'y' },
    collections: [],
    legalEntityType: 'person',
    synState: 'SEARCH'
  };
};

export class Person extends React.Component<PersonComponentProps, PersonState> {
  constructor(props: PersonComponentProps) {
    super(props);
    console.log('STORE', props.store);
    this.state = props.store.localState
      ? props.store.localState
      : {
          fullName: { nameString: '' },
          synState: 'SEARCH',
          collections: [],
          legalEntityType: 'person'
        };
  }
  componentWillReceiveProps(props: PersonComponentProps) {
    console.log('Recieve props: ====>', props);
    if (props.store.localState && !this.state.uuid) {
      this.setState(() => ({ ...props.store.localState }));
    }
  }
  render() {
    console.log('State: ', this.state);
    return (
      <div className="container" style={{ paddingTop: '25px' }}>
        <PersonPage
          readOnly={this.props.readOnly}
          appSession={this.props.appSession}
          standAlone
          onClickSave={(appSession: AppSession) =>
            this.props.addPerson &&
            this.props.addPerson({
              data: this.state,
              token: appSession.accessToken,
              collectionId: appSession.collectionId,
              callback: {
                onComplete: (r: AjaxResponse) => {
                  console.log('OnComplete', this.props, r.response);
                  const url = config.magasin.urls.client.person.viewPerson(
                    appSession,
                    r.response.personUuid
                  );
                  this.props.history && this.props.history.replace(url);
                }
              }
            })
          }
          synonymes={this.state.synonymes}
          synState={this.state.synState}
          onClickNext={() =>
            this.setState((ps: PersonState) => {
              const nextState: SynState =
                ps.synState === 'SEARCH'
                  ? 'SYNONYMIZE'
                  : ps.synState === 'SYNONYMIZE'
                    ? 'CONFIRM'
                    : 'SEARCH';

              return { ...ps, synState: nextState };
            })
          }
          collections={this.state.collections}
          editingIndex={this.state.editingIndex}
          editingIds={this.state.editingIds}
          legalEntityType={this.state.legalEntityType}
          externalIds={this.state.externalIds || []}
          fullName={this.state.fullName}
          onChangeCollections={(v: string) => {
            this.setState((ps: PersonState) => {
              const selectedIndexes: number[] =
                v !== '' ? v.split(',').map((s: string) => parseInt(s)) : [];
              const newCollection: {
                museum_id: number;
                collection_id: number;
              }[] = selectedIndexes.map((s: number) => ({
                museum_id: museumCollection[s].museumId,
                collection_id: museumCollection[s].collectionId
              }));
              return {
                ...ps,
                collections: newCollection || []
              };
            });
          }}
          newPerson={this.state.newPerson}
          onChange={(fieldName: string) => (newValue: string) => {
            this.setState(p => ({ ...p, [fieldName]: newValue }));
            console.log(fieldName, newValue);
          }}
          onClickAddPersonName={(newPersonName?: PersonName) => {
            if (newPersonName) {
              this.setState(ps => ({
                ...ps,
                synonymes: newPersonName && (ps.synonymes || []).concat([newPersonName]),
                newPerson: undefined
              }));
            }
          }}
          dataBaseValues={dataBaseValues}
          onAddExternalId={() => {
            this.setState((ps: PersonState) => {
              const editIndex = (ps.externalIds || []).length
                ? (ps.externalIds || []).length
                : 0;
              const newEditItem = {};
              return {
                ...ps,
                editingIndex: editIndex,
                editingIds: newEditItem
              };
            });
          }}
          onSaveExternalId={() => {
            this.setState((ps: PersonState) => {
              const editIndex = ps.editingIndex ? ps.editingIndex : 0;
              const currentEditItem = ps.editingIds;
              const currentExternalIds = (ps.externalIds && ps.externalIds) || [];
              const nextExternalIds = currentEditItem
                ? [
                    ...currentExternalIds.slice(0, editIndex),
                    currentEditItem,
                    ...currentExternalIds.slice(editIndex + 1)
                  ]
                : currentExternalIds;
              return {
                ...ps,
                externalIds: nextExternalIds,
                editingIndex: undefined,
                editingIds: undefined
              };
            });
          }}
          onChangeExternalIds={(field: string) => (value: string) => {
            this.setState((ps: PersonState) => {
              const newPersonState = {
                ...ps,
                editingIds: {
                  ...ps.editingIds,
                  [field]: value
                }
              };
              return newPersonState;
            });
          }}
          onDeleteExternalId={(index: number) => (
            e: React.SyntheticEvent<HTMLAnchorElement>
          ) => {
            e.preventDefault();
            this.setState((p: PersonState) => {
              const newExteralIDItem = (p.externalIds
                ? p.externalIds.slice(0, index)
                : []
              ).concat(p.externalIds ? p.externalIds.slice(index + 1) : []);
              return {
                ...p,
                externalIds: newExteralIDItem
              };
            });
          }}
          setEditingIndex={(index: number) => {
            this.setState((ps: PersonState) => {
              const editingItem = ps.externalIds && ps.externalIds[index];
              const upgragedPerson = {
                ...ps,
                editingIndex: index,
                editingIds: editingItem
              };
              return upgragedPerson;
            });
          }}
          onChangeDbValue={(inputValue: databaseOption) => {
            this.setState((ps: PersonState) => {
              const newPersonState = {
                ...ps,
                editingIds: {
                  ...ps.editingIds,
                  ['database']: inputValue.label
                }
              };
              return newPersonState;
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
          onChangePersonName={(fieldName: string) => (value: string) => {
            this.setState((ps: PersonState) => {
              const lastName =
                fieldName === 'lastName' ? value : ps.newPerson && ps.newPerson.lastName;
              const title =
                fieldName === 'title' ? value : ps.newPerson && ps.newPerson.title;
              const firstName =
                fieldName === 'firstName'
                  ? value
                  : ps.newPerson && ps.newPerson.firstName;
              const nameString = `${lastName || ''}${
                title || firstName ? ', ' : ''
              }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

              return {
                ...ps,
                newPerson: ps.newPerson
                  ? { ...ps.newPerson, nameString, [fieldName]: value }
                  : { nameString, [fieldName]: value }
              };
            });
          }}
          onChangeFullName={(fieldName: string) => (value: string) => {
            this.setState((ps: PersonState) => {
              const lastName =
                fieldName === 'lastName' ? value : ps.fullName && ps.fullName.lastName;
              const title =
                fieldName === 'title' ? value : ps.fullName && ps.fullName.title;
              const firstName =
                fieldName === 'firstName' ? value : ps.fullName && ps.fullName.firstName;
              const nameString = `${lastName || ''}${
                title || firstName ? ', ' : ''
              }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

              return {
                ...ps,
                fullName: {
                  ...ps.fullName,
                  nameString,
                  [fieldName]: value
                }
              };
            });
          }}
        />
      </div>
    );
  }
}

export type PersonComponentProps = {
  addPerson?: Function;
  editPerson?: Function;
  getPerson?: Function;
  store: PersonStoreState;
  appSession: AppSession;
  history: History;
  readOnly: boolean;
};

export default (props: PersonComponentProps) => (
  <Person
    appSession={props.appSession}
    store={props.store}
    addPerson={props.addPerson && props.addPerson(props.appSession)}
    editPerson={props.editPerson}
    getPerson={props.getPerson}
    history={props.history}
    readOnly={props.readOnly || false}
  />
);
