// @flow
import React from 'react';
import DatePicker from '../../components/DatePicker';

type PersonName = {
  title?: string,
  firstName?: string,
  lastName?: string,
  nameString: ?string
};

type PersonState = {
  uuid?: string,
  displayName?: string,
  url?: string,
  externalIds?: Array<{ database?: ?string, uuid?: ?string }>,
  synonymes?: Array<PersonName>,
  newPerson?: PersonName,
  bornDate?: string,
  deadDate?: string,
  collections?: Array<string>,
  museumAffiliation?: string
};

type PersonProps = {
  uuid?: string,
  onChange: (fieldName: string) => (newValue: string) => void,
  onChangePersonName: (fieldName: string) => (newValue: string) => void,
  onClickAdd: (newPersonName?: PersonName) => void,
  onAddExternalId: () => void,
  onDeleteExternalId: (i: number) => (e: SyntheticEvent<HTMLButtonElement>) => void,
  onChangeExternalIds: Function,
  externalIds?: Array<{ database: ?string, uuid: ?string }>,
  synonymes?: Array<PersonName>,
  newPerson?: PersonName,
  onClearBornDate: Function,
  onChangeBornDate: Function,
  onClearDeathDate: Function,
  onChangeDeathDate: Function
};

const ExternalIDStrings = (props: {
  externalIds?: {
    database: ?string,
    uuid: ?string
  }[],
  onAdd: Function,
  onChange: Function,
  onDelete: Function
}) => (
  <div>
    <h4>External ID's</h4>
    <div className="grid">
      <div className="row">
        <div className="col-md-2">
          <b>Database</b>
        </div>
        <div className="col-md-2">
          <b> UUID</b>
        </div>
      </div>
      {props.externalIds &&
        props.externalIds.map((e, i) => (
          <div className="row" key={`row-key${i}`}>
            <div className="col-sm-2 form-group">
              <input
                className="form-control"
                value={props.externalIds && props.externalIds[i].database}
                onChange={e => props.onChange(i)('database')(e.target.value)}
              />
            </div>
            <div className="col-sm-2 form-group">
              <input
                className="form-control"
                value={props.externalIds && props.externalIds[i].uuid}
                onChange={e => props.onChange(i)('uuid')(e.target.value)}
              />
            </div>
            <div className="col-sm-2">
              <a href="" onClick={props.onDelete(i)}>
                Delete
              </a>
            </div>
          </div>
        ))}
    </div>
    <button type="button" className="btn btn-default" onClick={props.onAdd}>
      Add new external ID
    </button>
  </div>
);

const AddPersonName = (props: { newPerson?: PersonName, onChange: Function }) => (
  <div>
    <h4> Add person name</h4>
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
  synonymes?: Array<PersonName>,
  newPerson?: PersonName,
  onChange: Function,
  onClickAdd: (newPersonName: PersonName) => void
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

const PersonPage = (props: PersonProps) => (
  <form>
    <div className="form-group">
      <label htmlFor="legalEntityType">Legal entity type</label>
      <select className="form-control" id="legalEntityType">
        <option>Person</option>
        <option>Group</option>
        <option>Organisasion</option>
        <option>Institution</option>
        <option>Business</option>
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="displayName">Default name</label>
      <input
        type="text"
        className="form-control"
        id="displayName"
        onChange={props.onChange('displayName')}
      />
    </div>
    <div className="row form-group">
      <div className="col-md-3">
        <label htmlFor="bornDate"> Født dato</label>
        <DatePicker
          className="form-control"
          id="bornDate"
          onClear={props.onClearBornDate}
          onChange={props.onChangeBornDate}
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="deathDate"> Født dato</label>
        <DatePicker
          className="form-control"
          id="deathDate"
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
        onChange={props.onChange('url')}
      />
    </div>

    <ExternalIDStrings
      externalIds={props.externalIds}
      onAdd={props.onAddExternalId}
      onChange={props.onChangeExternalIds}
      onDelete={props.onDeleteExternalId}
    />

    {props.synonymes &&
    props.synonymes.length > 0 && (
      <PersonNames
        synonymes={props.synonymes}
        newPerson={props.newPerson}
        onChange={props.onChange}
        onClickAdd={props.onClickAdd}
      />
    )}

    <AddPersonName newPerson={props.newPerson} onChange={props.onChangePersonName} />

    <button
      type="button"
      className="btn btn-default"
      onClick={() => props.onClickAdd(props.newPerson)}
    >
      Add person name
    </button>
  </form>
);

export class Person extends React.Component<PersonProps, PersonState> {
  constructor(props: PersonProps) {
    super(props);
    this.state = { database: '', uuid: '' };
  }
  render() {
    return (
      <div className="container" style={{ paddingTop: '25px' }}>
        <PersonPage
          synonymes={this.state.synonymes}
          externalIds={this.state.externalIds}
          newPerson={this.state.newPerson}
          onChange={(fieldName: string) => (newValue: string) =>
            this.setState(p => ({ ...p, [fieldName]: newValue }))}
          onClickAdd={(newPersonName?: PersonName) => {
            if (newPersonName) {
              this.setState(ps => ({
                ...ps,
                synonymes: newPersonName && (ps.synonymes || []).concat([newPersonName]),
                newPerson: undefined
              }));
            }
          }}
          onAddExternalId={() => {
            this.setState((ps: PersonState) => {
              return {
                ...ps,
                externalIds: (ps.externalIds || []).concat([{ database: '', uuid: '' }])
              };
            });
          }}
          onChangeExternalIds={(index: number) => (fn: string) => (value: string) => {
            this.setState((ps: PersonState) => {
              const newExternalIDItem = ps.externalIds
                ? { ...ps.externalIds[index], [fn]: value }
                : { [fn]: value };

              return {
                ...ps,
                externalIds:
                  ps.externalIds &&
                  [...ps.externalIds.slice(0, index)]
                    .concat([newExternalIDItem])
                    .concat(ps.externalIds ? [...ps.externalIds.slice(index + 1)] : [])
              };
            });
          }}
          onDeleteExternalId={(index: number) => (
            e: SyntheticEvent<HTMLButtonElement>
          ) => {
            e.preventDefault();
            this.setState((p: PersonState) => {
              const newExteralIDItem = (p.externalIds
                ? p.externalIds.slice(0, index)
                : []).concat(p.externalIds ? p.externalIds.slice(index + 1) : []);
              return {
                ...p,
                externalIds: newExteralIDItem
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
              const nameString = `${lastName || ''}${title || firstName
                ? ', '
                : ''}${title || ''}${title ? ' ' : ''}${firstName || ''}`;

              return {
                ...ps,
                newPerson: ps.newPerson
                  ? { ...ps.newPerson, nameString, [fieldName]: value }
                  : { nameString, [fieldName]: value }
              };
            });
          }}
        />
      </div>
    );
  }
}
