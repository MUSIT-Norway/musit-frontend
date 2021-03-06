import * as React from 'react';
import DatePicker from '../../../components/DatePicker';
import * as FontAwesome from 'react-fontawesome';
import FieldMultiSelect from '../components/FieldMultiSelect';
import {} from '../../../stores/appSession';
import { AppSession } from '../../../types/appSession';
import {
  OutputPerson,
  EventData,
  PersonName as StorePersonName
} from '../../../models/object/person';
import { PersonStoreState, GetPersonsFromPersonNameProps } from './PersonStore';
import { EditList, databaseOption, databaseOptions } from '../components/EditList';
import { History } from 'history';
import config from '../../../config';
import { AjaxResponse } from 'rxjs';
import { AjaxGet } from '../../../types/ajax';
import {
  museumAndCollections,
  museum,
  collections,
  dataBaseValues
} from '../person/mockdata/data';
import { groupBy, maxBy, minBy } from 'lodash';
import { formatISOString, maybeFormatISOString } from '../../../shared/util';
import * as moment from 'moment';

export type CombinedStore = { store: PersonStoreState; appSession: AppSession };

export type PersonName = {
  title?: string;
  firstName?: string;
  lastName?: string;
  nameString: string;
  actorNameUuid?: string;
};

export type ExternalId = {
  database?: string;
  uuid?: string;
};
export type SynProps = {
  value?: string;
  synPerson: OutputPerson;
  personList: OutputPerson[];
  appSession?: AppSession;
  personToMergeSyn?: boolean;
} & {
  onAddPersonAsSynonym: (p: OutputPerson) => void;
  onRemovePersonAsSynonym: () => void;
  onClickMerge: Function;
  onClickSearch: Function;
  onPersonSearchChange: (n: string) => void;
};

export type Collection = {
  museumId: number;
  collectionId: number;
};

export type SynonymStatus = 'NEW' | 'DEL' | 'UNCHANGED';

export type SynonymType = {
  actorNameUuid?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  nameString: string;
  status: SynonymStatus;
};

export interface PersonDet {
  firstName?: string;
  lastName?: string;
  title?: string;
  name: string;
  actorUuid: string;
  actorNameUuid: string;
}

export interface PersonState {
  uuid?: string;
  fullName: PersonName;
  legalEntityType: string;
  personToSynonymize?: OutputPerson;
  url?: string;
  externalIds?: ExternalId[];
  editingIds?: ExternalId;
  editingIndex?: number;
  synonyms?: SynonymType[];
  editSynonym?: SynonymType;
  bornDate?: string;
  deathDate?: string;
  verbatimDate?: string;
  collections: Collection[];
  museumAffiliation?: string;
  editingIndexSynonyms?: number;
  personToMergeSyn?: boolean;
  enableSave?: Boolean;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  personSearchString?: string;
}

export class PersonState implements PersonState {
  uuid?: string;
  fullName: PersonName;
  legalEntityType: string;
  url?: string;
  externalIds?: ExternalId[];
  editingIds?: ExternalId;
  editingIndex?: number;
  synonyms?: SynonymType[];
  editSynonym?: SynonymType;
  bornDate?: string;
  deathDate?: string;
  verbatimDate?: string;
  collections: Collection[];
  museumAffiliation?: string;
  editingIndexSynonyms?: number;
  personToMergeSyn?: boolean;
  enableSave?: Boolean;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;

  constructor(
    fullName: PersonName,
    legalEntityType: string,
    collections: Collection[],
    personSearchString?: string,
    uuid?: string,
    url?: string,
    externalIds?: ExternalId[],
    synonyms?: SynonymType[],
    editSynonym?: SynonymType,
    bornDate?: string,
    deathDate?: string,
    verbatimDate?: string,
    museumAffiliation?: string,
    editingIndexSynonyms?: number,
    personToMergeSyn?: boolean,
    enableSave?: Boolean,
    disableOnChangeFullName?: boolean,
    disableOnChangeOtherName?: boolean
  ) {
    this.uuid = uuid;
    this.fullName = fullName;
    this.legalEntityType = legalEntityType;
    this.personSearchString = personSearchString || this.personSearchString;
    this.url = url;
    this.externalIds = externalIds;
    this.synonyms = synonyms;
    this.editSynonym = editSynonym;
    this.bornDate = bornDate;
    this.deathDate = deathDate;
    this.verbatimDate = verbatimDate;
    this.collections = collections;
    this.museumAffiliation = museumAffiliation;
    this.editingIndexSynonyms = editingIndexSynonyms;
    this.personToMergeSyn = personToMergeSyn;
    this.enableSave = enableSave;
    this.disableOnChangeFullName = disableOnChangeFullName;
    this.disableOnChangeOtherName = disableOnChangeOtherName;
  }
}

export type PersonProps = PersonState & {
  onClickSaveEdit: Function;
  onClickCancel: Function;
  appSession: AppSession;
  onPersonSearchChange: (name: string) => void;
  onChange: (fieldName: string) => (newValue: string) => void;
  onChangePersonName: (fieldName: string) => (newValue: string) => void;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onAddExternalId: () => void;
  onSaveExternalId: () => void;
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
  personSearchList: OutputPerson[];
  onChangeVerbatimDate: (newDate?: string) => void;
  heading?: string;
  //standAlone?: boolean;
  readOnly?: boolean;
  editingIndexSynonyms?: number;
  onAddPersonAsSynonym: (p: OutputPerson) => void;
  onRemovePersonAsSynonym: () => void;
  onClickMerge: Function;
  onSelectSynonym?: (p: OutputPerson) => void;
  clearSearch: Function;
  onClickSearch: Function;
  getEnrichedPersonsFromName: (
    a?: AjaxGet<any>
  ) => (s: GetPersonsFromPersonNameProps) => void;
};

const Synonyms = (props: { synonyms?: SynonymType[]; readOnly?: boolean }) => (
  <div>
    <div className="panel-heading">
      <div className="panel-title">
        <h4>Synonyms</h4>
      </div>
    </div>
    <div className="grid">
      {props.synonyms &&
        props.synonyms.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <table
                id="synynomDataTableHeader"
                className="table table-condensed table-hover"
              >
                <thead className="row">
                  <tr className="row">
                    <th className="col-md-2">
                      <b>Tittel</b>
                    </th>
                    <th className="col-md-2">
                      <b>Fornavn</b>
                    </th>
                    <th className="col-md-2">
                      <b>Etternavn</b>
                    </th>
                    <th className="col-md-4">
                      <b>Navn</b>
                    </th>
                  </tr>
                </thead>
                <tbody id="synonymsTableBody">
                  {props.synonyms &&
                    props.synonyms.length > 0 &&
                    props.synonyms.filter(e => e.status !== 'DEL').map((e, i) => (
                      <tr key={`tr-row${i}`} className="row">
                        <td className="col-md-2"> {e.title}</td>
                        <td className="col-md-2">{e.firstName}</td>
                        <td className="col-md-2">{e.lastName}</td>
                        <td className="col-md-4">{e.nameString}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  </div>
);

export const aggEvents: (e?: EventData[]) => string = (e: EventData[]) => {
  if (!e) {
    return '';
  }
  const maxDate = maxBy(
    e.map(ed => ({ dateFrom: moment(ed.dateFrom.toString()).format('YYYY') })),
    ed => ed.dateFrom
  );
  const minDate = minBy(
    e.map(ed => ({ dateFrom: moment(ed.dateFrom.toString()).format('YYYY') })),
    ed => ed.dateFrom
  );

  const places = groupBy(
    e.filter(ed => ed.place).map(ed => ed.place && ed.place.admPlace.path),
    (s: string) => s
  );

  const placeString = Object.keys(places)
    .filter(k => k)
    .sort((a, b) => (a > b ? -1 : 1))
    .map(k => `${k}:${places[k].length}`);

  return `Years: ${minDate && minDate.dateFrom}-${maxDate &&
    maxDate.dateFrom} Places: ${placeString}`;
};
const ExternalIDStrings = (props: {
  editingIndex?: number;
  externalIds?: ExternalId[];
  editingIds?: ExternalId;
  dataBaseValues: databaseOptions;
  readOnly?: boolean;
  onAdd: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onSave: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onChange: (field: string) => (value: string) => void;
  onDelete: (i: number) => (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
  setEditingIndex: (i: number) => void;
  onChangeDbValue: (inputValue: databaseOption) => void; //(event: React.SyntheticEvent<HTMLSelectElement>) =>
}) => (
  <div>
    <div className="panel-heading">
      <div className="panel-title">
        <h4>External ID's</h4>
      </div>
    </div>
    <div className="grid">
      {props.externalIds &&
        props.externalIds.length > 0 && (
          <div className="row">
            <table
              id="externalIDTableHeader"
              className="table table-condensed table-hover"
            >
              <thead className="row">
                <tr className="row">
                  <th className="col-md-2">
                    <b>Database</b>
                  </th>
                  <th className="col-md-2">
                    <b>UUID</b>
                  </th>
                  <th className="col-md-2">
                    <b />
                  </th>
                  <th className="col-md-2">
                    <b />
                  </th>
                </tr>
              </thead>
              <tbody id="externalIDTableBody">
                {props.externalIds &&
                  props.externalIds.length > 0 &&
                  props.externalIds.map((e, i) => (
                    <tr key={`tr-row${i}`} className="row">
                      <td className="col-md-2"> {e.database}</td>
                      <td className="col-md-2">{e.uuid}</td>
                      {!props.readOnly && (
                        <div>
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
                        </div>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      {props.editingIndex !== undefined && (
        <div className="row">
          <div className="col-sm-2 form-group" id="databases">
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
              id="externalIds"
              className="form-control"
              value={props.editingIds && props.editingIds.uuid}
              onChange={e => props.onChange('uuid')(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
    {!props.readOnly && (
      <div>
        <button
          id="addExternalId"
          type="button"
          className="btn btn-default"
          onClick={props.onAdd}
          disabled={props.editingIndex !== undefined}
        >
          Add new external ID
        </button>
        <button
          id="saveExternalId"
          type="button"
          className="btn btn-primary"
          onClick={props.onSave}
          disabled={props.editingIndex === undefined}
        >
          Save external ID
        </button>
      </div>
    )}
  </div>
);
const SynDisplay = (props: {
  synPerson: OutputPerson;
  onClickMerge?: Function;
  personToMergeSyn?: boolean;
  onRemovePersonAsSynonym: Function;
  appSession?: AppSession;
}) => {
  if (props.synPerson.name) {
    return (
      <div className="container-fluid">
        <h4>Do you want to synonymize this person?</h4>
        <div className="row">
          {props.synPerson.name && (
            <table
              id="personToSynonymTableHeader"
              className="table table-condensed table-hover"
            >
              <thead className="row">
                <tr className="row">
                  <th className="col-md-2">
                    <b>Full Name</b>
                  </th>
                  <th className="col-md-4">
                    <b>Synonyms</b>
                  </th>
                  <th className="col-md-3">
                    <b> Collections</b>
                  </th>
                  <th className="col-md-3">
                    <b>External IDs</b>
                  </th>
                  <th className="col-md-1">
                    <b>URL</b>
                  </th>
                </tr>
              </thead>
              <tbody id="personToSynonymTableBody">
                <tr key={`tr-row$0`} className="row">
                  <td className="col-md-2"> {props.synPerson.name}</td>
                  <td className="col-md-3">{getSynonyms(props.synPerson)}</td>
                  <td className="col-md-3">{getCollections(props.synPerson)}</td>
                  <td className="col-md-3">{getExternalIDs(props.synPerson)}</td>
                  <td className="col-md-1">
                    {props.synPerson.personAttribute &&
                      props.synPerson.personAttribute.url}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="row">
          <div className="row">
            <div className="col-md-4">
              <button
                id="btnCancel"
                className="btn btn-link"
                disabled={props.synPerson.actorUuid ? false : true}
                onClick={e => {
                  e.preventDefault();
                  props.onRemovePersonAsSynonym();
                }}
              >
                Cancel
              </button>
              <button
                id="btnConfirm"
                data-toggle="tooltip"
                title={
                  props.synPerson.actorUuid !== ''
                    ? props.personToMergeSyn
                      ? 'Cannot Merge a Person with Same ID'
                      : 'Search Person to Synonimize'
                    : ''
                }
                className="btn btn-primary"
                disabled={props.personToMergeSyn ? props.personToMergeSyn : false}
                onClick={e => {
                  e.preventDefault();
                  props.onClickMerge && props.onClickMerge(props.appSession);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
};
const getExternalIDs = (props: OutputPerson) => {
  let externalIdsString: string;
  if (
    props.personAttribute &&
    props.personAttribute.externalIds &&
    props.personAttribute.externalIds.length > 0
  ) {
    externalIdsString =
      props.personAttribute &&
      props.personAttribute.externalIds
        .map((e, i) => e.database + '  ' + e.uuid)
        .reduce((acc, val) => acc + ' , ' + val);
  } else {
    externalIdsString = '';
  }
  return externalIdsString;
};
const getSynonyms = (props: OutputPerson) => {
  let temp: string;
  const synonymConcat =
    props.synonyms &&
    props.synonyms.length > 0 &&
    props.synonyms.map((e, i) => (temp = i === 0 ? e.name : temp + ' : ' + e.name));
  return synonymConcat;
};
const getCollections = (props: OutputPerson) => {
  let labelValue: string;
  const collectionConcat =
    props.collections &&
    props.collections.map((m, i) => {
      const museumRecord = museum.find(e => e.museumId === m.museumId);
      const collectionRecord = collections.find(e => e.collectionId === m.collectionId);
      labelValue =
        i === 0
          ? `${museumRecord ? museumRecord.abbreviation : ''}-${
              collectionRecord ? collectionRecord.collectionName : ' '
            }`
          : ', ' +
            `${museumRecord ? museumRecord.abbreviation : ''}-${
              collectionRecord ? collectionRecord.collectionName : ' '
            }`;

      return labelValue;
    });
  return collectionConcat;
};
const SynSearch = (props: SynProps) => {
  console.log('PersonList: ', props.personList);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="personSearchName">Person name</label>
            <input
              className="form-control"
              id="personSearchName"
              onChange={e => props.onPersonSearchChange(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-default"
            onClick={e => {
              e.preventDefault();
              props.onClickSearch();
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div className="row">
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Title</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Synonyms</th>
              <th>Event data</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {props.personList.map((p: OutputPerson, i: number) => {
              const ae = aggEvents(p.eventData);
              const aggSyn = p.synonyms
                ? p.synonyms.reduce(
                    (prev: string, p: StorePersonName) =>
                      `${prev.length > 0 ? prev + '; ' : ''} ${p.name}`,
                    ''
                  )
                : '';
              return (
                <tr key={`TR-${i}`}>
                  <td>{p.title}</td>
                  <td>{p.firstName}</td>
                  <td>{p.lastName}</td>
                  <td>{aggSyn}</td>
                  <td>{ae}</td>
                  <td>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        props.onAddPersonAsSynonym && props.onAddPersonAsSynonym(p);
                      }}
                    >
                      Click to merge
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const Synonymizer = (props: SynProps) => {
  return (
    <div className="well panel panel-default">
      <div className="panel-heading">
        <div className="panel-title">
          <h4>Synonymizer</h4>
        </div>
      </div>
      <div className="panel-body">
        <div className="row">
          <SynSearch
            onAddPersonAsSynonym={props.onAddPersonAsSynonym}
            onRemovePersonAsSynonym={props.onRemovePersonAsSynonym}
            onPersonSearchChange={props.onPersonSearchChange}
            appSession={props.appSession}
            personList={props.personList}
            synPerson={props.synPerson}
            onClickSearch={props.onClickSearch}
            onClickMerge={props.onClickMerge}
          />
        </div>
        <div className="row">
          <SynDisplay
            synPerson={props.synPerson}
            appSession={props.appSession}
            onClickMerge={props.onClickMerge}
            onRemovePersonAsSynonym={props.onRemovePersonAsSynonym}
            personToMergeSyn={props.personToMergeSyn}
          />
        </div>

        <div className="row" />
        <div />
      </div>
    </div>
  );
};
export const PersonPage = (props: PersonProps) => {
  const getFieldValidated = (props: PersonProps) => {
    if (props.collections && props.fullName.nameString) {
      return false;
    } else {
      return true;
    }
  };
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
                    <select
                      className="form-control"
                      id="legalEntityTypeDropDown"
                      value={props.legalEntityType}
                      disabled={props.readOnly}
                      onChange={v => {
                        props.onChange('legalEntityType')(v.target.value);
                      }}
                    >
                      <option value="Person">Person</option>
                      <option value="Group">Group</option>
                      <option value="Organisation">Organisation</option>
                      <option value="Institution">Institution</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-8">
                  <FieldMultiSelect
                    id="collectionsForPerson"
                    title="Samlinger for person"
                    labelAbove={true}
                    viewMode={props.readOnly}
                    singleSelect={false}
                    matchProp={'label'}
                    removeSelected={false}
                    closeOnSelect={true}
                    options={museumAndCollections.map(m => {
                      const museumRecord = museum.find(e => e.museumId === m.museumId);
                      const collectionRecord = collections.find(
                        e => e.collectionId === m.collectionId
                      );
                      const labelValue = `${
                        museumRecord ? museumRecord.abbreviation : ''
                      }-${collectionRecord ? collectionRecord.collectionName : ''}`;
                      return {
                        label: labelValue,
                        value: JSON.stringify(m)
                      };
                    })}
                    values={
                      props.collections && props.collections.map(m => JSON.stringify(m))
                    }
                    onChange={(event: any) => {
                      props.onChangeCollections(event);
                    }}
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
                      disabled={
                        props.readOnly ||
                        props.legalEntityType.toLowerCase() !== 'person' ||
                        props.disableOnChangeOtherName
                      }
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
                      disabled={
                        props.readOnly ||
                        props.legalEntityType.toLowerCase() !== 'person' ||
                        props.disableOnChangeOtherName
                      }
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
                      disabled={
                        props.readOnly ||
                        props.legalEntityType.toLowerCase() !== 'person' ||
                        props.disableOnChangeOtherName
                      }
                    />
                  </div>{' '}
                  <div className="col-sm-3 form-group">
                    <label htmlFor="lastName"> Navn </label>
                    <input
                      id="name"
                      className="form-control"
                      type="text"
                      value={(props.fullName && props.fullName.nameString) || ''}
                      onChange={e => props.onChangeFullName('nameString')(e.target.value)}
                      disabled={props.readOnly || props.disableOnChangeFullName}
                    />
                  </div>
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-3" id="bornDate">
                  <label htmlFor="bornDate"> Født dato</label>
                  <DatePicker
                    onClear={props.onClearBornDate}
                    onChange={props.onChangeBornDate}
                    value={props.bornDate}
                    disabled={props.readOnly}
                  />
                </div>
                <div className="col-md-3" id="deathDate">
                  <label htmlFor="deathDate"> Død dato</label>
                  <DatePicker
                    onClear={props.onClearDeathDate}
                    onChange={props.onChangeDeathDate}
                    value={props.deathDate}
                    disabled={props.readOnly}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="verbatimDate"> Verbatim dato</label>
                  <input
                    className="form-control"
                    value={props.verbatimDate || ''}
                    onChange={e => props.onChangeVerbatimDate(e.target.value)}
                    type="text"
                    id="verbatimDate"
                    disabled={props.readOnly}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="url"
                  value={props.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    props.onChange('url')(e.target.value)
                  }
                  disabled={props.readOnly}
                />
              </div>
            </div>
            <div className="well well-sm">
              <Synonyms synonyms={props.synonyms} readOnly={props.readOnly} />
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
                readOnly={props.readOnly}
              />
            </div>
            {console.log('props.personToSynonymize :', props.personToSynonymize)}
            {!props.readOnly &&
              props.uuid && (
                <Synonymizer
                  onAddPersonAsSynonym={props.onAddPersonAsSynonym}
                  onPersonSearchChange={props.onPersonSearchChange}
                  onRemovePersonAsSynonym={props.onRemovePersonAsSynonym}
                  onClickMerge={props.onClickMerge}
                  personList={props.personSearchList}
                  onClickSearch={props.onClickSearch}
                  appSession={props.appSession}
                  synPerson={
                    props.personToSynonymize
                      ? props.personToSynonymize
                      : {
                          actorUuid: '',
                          name: '',
                          collections: [],
                          personToMergeSyn: false
                        }
                  }
                  personToMergeSyn={props.personToMergeSyn}
                />
              )}
          </form>
        </div>
        <div className="panel-footer">
          <div className="row">
            <div className="col-md-12" style={{ textAlign: 'right' }}>
              <button
                id="btnCancel"
                disabled={props.readOnly}
                type="button"
                className="btn btn-link"
                onClick={() => props.onClickCancel(props.appSession)}
              >
                Cancel
              </button>
              <button
                id="saveOrEdit"
                type="button"
                disabled={!props.readOnly && getFieldValidated(props)}
                className="btn btn-primary"
                onClick={() => props.onClickSaveEdit(props.appSession)}
              >
                {props.readOnly ? `Edit` : `Save`}
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
      {
        firstName: innP.firstName,
        lastName: innP.lastName,
        title: innP.title,
        nameString: innP.name
      },
      innP.personAttribute ? innP.personAttribute.legalEntityType : '',
      innP.collections,
      undefined,
      innP.actorUuid,
      innP.personAttribute && innP.personAttribute.url,
      innP.personAttribute && innP.personAttribute.externalIds,
      innP.synonyms &&
        innP.synonyms.map<SynonymType>((p: StorePersonName) => ({
          nameString: p.name,
          firstName: p.firstName,
          lastName: p.lastName,
          title: p.title,
          status: 'UNCHANGED',
          actorNameUuid: p.actorNameUuid
        })),
      undefined,
      maybeFormatISOString(innP.personAttribute && innP.personAttribute.bornDate),
      maybeFormatISOString(innP.personAttribute && innP.personAttribute.deathDate),
      innP.personAttribute && innP.personAttribute.verbatimDate,
      undefined,
      undefined,
      true
    );
    return r;
  }
  return {
    fullName: { nameString: 'y' },
    collections: [],
    legalEntityType: 'Person',
    synState: 'SEARCH',
    personSearchString: '',
    personsToSynonymize: { actorUuid: '', name: '' },
    personToMergeSyn: true
  };
};

export class Person extends React.Component<PersonComponentProps, PersonState> {
  constructor(props: PersonComponentProps) {
    super(props);
    this.state = props.store.localState
      ? props.store.localState
      : {
          fullName: { nameString: '' },
          //synState: 'SEARCH',
          //personsToSynonymize: {},
          collections: [],
          legalEntityType: 'Person',
          personSearchString: ''
        };
  }
  componentWillReceiveProps(props: PersonComponentProps) {
    console.log('Recieve props: ====>', props);
    if (props.store.localState) {
      this.setState(() => ({ ...props.store.localState }));
    }
  }
  render() {
    return (
      <div className="container" style={{ paddingTop: '25px' }}>
        <PersonPage
          onPersonSearchChange={(name: string) => {
            this.setState((ps: PersonState) => ({ ...ps, personSearchString: name }));
          }}
          readOnly={this.props.readOnly}
          uuid={this.state.uuid}
          appSession={this.props.appSession}
          personSearchList={this.props.store.personList || []}
          getEnrichedPersonsFromName={this.props.getEnrichedPersonsFromName}
          onClickSearch={() =>
            this.props.getEnrichedPersonsFromName()({
              name: this.state.personSearchString || '',
              collectionId: this.props.appSession.collectionId,
              token: this.props.appSession.accessToken
            })
          }
          clearSearch={this.props.clearSearch}
          onAddPersonAsSynonym={(p: OutputPerson) => {
            console.log('OnAddPersonAsSynonym', p);
            this.setState((ps: PersonState) => {
              const tempsynToPerson = p.actorUuid === this.state.uuid ? true : false;
              return {
                ...ps,
                personToSynonymize: p,
                personToMergeSyn: tempsynToPerson
              };
            });
          }}
          onRemovePersonAsSynonym={() => {
            this.setState((p: PersonState) => {
              const newPerToSyn: OutputPerson = {
                actorUuid: '',
                name: '',
                collections: p.collections,
                personToMergeSyn: p.personToMergeSyn || false
              };
              return {
                ...p,
                personToSynonymize: newPerToSyn,
                personToMergeSyn: true
              };
            });
          }}
          onSelectSynonym={(p: OutputPerson) => {
            this.setState((ps: PersonState) => ({
              ...ps,
              personsToSynonymize: p
            }));
          }}
          onClickMerge={(appSession: AppSession) => {
            if (this.state.uuid) {
              this.props.mergePerson &&
                this.props.mergePerson()({
                  id: this.state.uuid,
                  data: this.state.personToSynonymize && {
                    actorUuid: this.state.personToSynonymize.actorUuid
                  },
                  token: appSession.accessToken,
                  collectionId: appSession.collectionId,
                  callback: {
                    onComplete: (r: AjaxResponse) => {
                      const url = config.magasin.urls.client.person.viewPerson(
                        appSession,
                        this.state.uuid ? this.state.uuid : '' //  r.response.actorUuid  //
                      );
                      this.props.history && this.props.history.push(url);
                    } /* ,
                    onFailure: (r: AjaxResponse) => {
                      alert(r.responseText);
                    }  */
                  }
                });
            }
          }}
          onClickCancel={(appSession: AppSession) => {
            if (!this.props.readOnly) {
              if (this.state.uuid) {
                const url = config.magasin.urls.client.person.viewPerson(
                  appSession,
                  this.state.uuid ? this.state.uuid : '' //  r.response.actorUuid  //
                );
                this.props.history && this.props.history.push(url);
              } else {
                this.props.history && this.props.history.goBack();
              }
            }
          }}
          onClickSaveEdit={(appSession: AppSession) => {
            if (this.props.readOnly) {
              const url = config.magasin.urls.client.person.editPerson(
                appSession,
                this.state.uuid ? this.state.uuid : ''
              );
              this.props.history && this.props.history.replace(url);
            } else {
              if (this.state.uuid) {
                this.props.editPerson &&
                  this.props.editPerson({
                    id: this.state.uuid,
                    data: this.state,
                    token: appSession.accessToken,
                    collectionId: appSession.collectionId,
                    callback: {
                      onComplete: (r: AjaxResponse) => {
                        const url = config.magasin.urls.client.person.viewPerson(
                          appSession,
                          this.state.uuid ? this.state.uuid : '' //  r.response.actorUuid  //
                        );
                        this.props.history && this.props.history.push(url);
                      } /* ,
                      onFailure: (r: AjaxResponse) => {
                        alert(r.responseText);
                      }  */
                    }
                  });
              } else {
                this.props.addPerson &&
                  this.props.addPerson({
                    data: this.state,
                    token: appSession.accessToken,
                    collectionId: appSession.collectionId,
                    callback: {
                      onComplete: (r: AjaxResponse) => {
                        const url = config.magasin.urls.client.person.viewPerson(
                          appSession,
                          r.response.actorUuid
                        );
                        this.props.history && this.props.history.replace(url);
                      } /* ,
                      onFailure: (error: { status: number }) => {
                        alert(error.status.toString);
                      }  */
                    }
                  });
              }
            }
          }}
          synonyms={this.state.synonyms}
          personToSynonymize={
            this.state.personToSynonymize
              ? this.state.personToSynonymize
              : { actorUuid: '', name: '', collections: [], personToMergeSyn: false }
          }
          collections={this.state.collections}
          bornDate={this.state.bornDate}
          deathDate={this.state.deathDate}
          url={this.state.url ? this.state.url : ''}
          verbatimDate={this.state.verbatimDate}
          editingIndex={this.state.editingIndex}
          editingIds={this.state.editingIds}
          legalEntityType={this.state.legalEntityType}
          externalIds={this.state.externalIds || []}
          fullName={this.state.fullName}
          enableSave={this.state.enableSave}
          disableOnChangeFullName={this.state.disableOnChangeFullName}
          disableOnChangeOtherName={this.state.disableOnChangeOtherName}
          onChangeCollections={(v: any) => {
            this.setState((ps: PersonState) => {
              console.log('V:  onChagne', v);

              const newCollection: any = v.map((v: any) => JSON.parse(v.value));
              console.log('Return string onChagne', newCollection);

              return {
                ...ps,
                collections: newCollection || []
              };
            });
          }}
          editSynonym={this.state.editSynonym}
          onChange={(fieldName: string) => (newValue: string) => {
            this.setState(p => ({ ...p, [fieldName]: newValue }));
            console.log(fieldName, newValue);
          }}
          editingIndexSynonyms={this.state.editingIndexSynonyms}
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
          onChangeBornDate={(newDate?: Date) => {
            this.setState((p: PersonState) => ({
              ...p,
              bornDate: newDate ? formatISOString(newDate) : undefined
            }));
          }}
          onChangeVerbatimDate={(newDate?: string) => {
            this.setState((p: PersonState) => ({ ...p, verbatimDate: newDate }));
          }}
          onChangeDeathDate={(newDate?: Date) => {
            this.setState((p: PersonState) => ({
              ...p,
              deathDate: newDate ? formatISOString(newDate) : undefined
            }));
          }}
          onClearBornDate={() => {
            this.setState((p: PersonState) => ({ ...p, bornDate: undefined }));
          }}
          onClearDeathDate={() => {
            this.setState((p: PersonState) => ({ ...p, deathDate: undefined }));
          }}
          onChangePersonName={(fieldName: string) => (value: string) => {
            this.setState((ps: PersonState) => {
              const lastName =
                fieldName === 'lastName'
                  ? value
                  : ps.editSynonym && ps.editSynonym.lastName;
              const title =
                fieldName === 'title' ? value : ps.editSynonym && ps.editSynonym.title;
              const firstName =
                fieldName === 'firstName'
                  ? value
                  : ps.editSynonym && ps.editSynonym.firstName;
              const nameString = `${lastName || ''}${
                title || firstName ? ', ' : ''
              }${title || ''}${title ? ' ' : ''}${firstName || ''}`;

              return {
                ...ps,
                editSynonym: ps.editSynonym
                  ? { ...ps.editSynonym, nameString, status: 'NEW', [fieldName]: value }
                  : { nameString, status: 'NEW', [fieldName]: value }
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
                fullName: {
                  ...ps.fullName,
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

export type PersonComponentProps = {
  addPerson?: Function;
  editPerson?: Function;
  mergePerson: Function;
  getPerson?: Function;
  clearSearch: Function;
  getEnrichedPersonsFromName: (
    a?: AjaxGet<any>
  ) => (s: GetPersonsFromPersonNameProps) => void;
  store: PersonStoreState;
  appSession: AppSession;
  history: History;
  readOnly: boolean;
  personSearchList: OutputPerson[];
};

export default (props: PersonComponentProps) => (
  <Person
    appSession={props.appSession}
    personSearchList={props.store.personList || []}
    getEnrichedPersonsFromName={props.getEnrichedPersonsFromName}
    store={props.store}
    clearSearch={props.clearSearch}
    addPerson={props.addPerson && props.addPerson(props.appSession)}
    editPerson={props.editPerson && props.editPerson(props.appSession)}
    mergePerson={props.mergePerson}
    getPerson={props.getPerson}
    history={props.history}
    readOnly={props.readOnly || false}
  />
);
