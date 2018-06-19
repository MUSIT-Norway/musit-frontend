import * as React from 'react';
import DatePicker from '../../../components/DatePicker';
import FieldMultiSelect from '../../../forms/components/FieldMultiSelect';

export type PersonName = {
  title?: string;
  firstName?: string;
  lastName?: string;
  nameString: string | null;
};

export type ExternalId = {
  database?: string;
  uuid?: string;
};

export type PersonState = {
  uuid?: string;
  displayName?: string;
  url?: string;
  externalIds?: ExternalId[];
  synonymes?: PersonName[];
  newPerson?: PersonName;
  bornDate?: string;
  deadDate?: string;
  collections?: string;
  museumAffiliation?: string;
};

export type PersonProps = PersonState & {
  onChange: (fieldName: string) => (newValue: string) => void;
  onChangePersonName: (fieldName: string) => (newValue: string) => void;
  onClickAdd: (newPersonName?: PersonName) => void;
  onAddExternalId: () => void;
  onChangeCollections: (newString: string) => void;
  onDeleteExternalId: (i: number) => (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
  onChangeExternalIds: (i: number) => (field: string) => (value: string) => void;
  externalIds?: ExternalId[];
  synonymes?: Array<PersonName>;
  newPerson?: PersonName;
  onClearBornDate: Function;
  onChangeBornDate: Function;
  onClearDeathDate: Function;
  onChangeDeathDate: Function;
};

const ExternalIDStrings = (props: {
  externalIds?: ExternalId[];
  onAdd: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onChange: (i: number) => (field: string) => (value: string) => void;
  onDelete: (i: number) => (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
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
                value={(props.externalIds && props.externalIds[i].database) || ''}
                onChange={e => props.onChange(i)('database')(e.target.value)}
              />
            </div>
            <div className="col-sm-2 form-group">
              <input
                className="form-control"
                value={(props.externalIds && props.externalIds[i].uuid) || ''}
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

const AddPersonName = (props: {
  newPerson?: PersonName;
  onChange: (fieldName: string) => (value: string) => void;
}) => (
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
    <div>
      <form style={{ padding: '25px' }}>
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
        <FieldMultiSelect
          stringValue={props.collections}
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
          onChange={(event: string) => {
            props.onChangeCollections(event);
          }}
          title="Samlinger for person"
        />
        <div className="form-group">
          <label htmlFor="displayName">Default name</label>
          <input
            type="text"
            className="form-control"
            id="displayName"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onChange('displayName')(e.target.value)}
          />
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
            <label htmlFor="deathDate"> Født dato</label>
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
              props.onChange('url')(e.target.value)}
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
    </div>
  );
};

export class Person extends React.Component<PersonProps, PersonState> {
  constructor(props: PersonProps) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container" style={{ paddingTop: '25px' }}>
        <PersonPage
          synonymes={this.state.synonymes}
          collections={this.state.collections}
          externalIds={this.state.externalIds || []}
          onChangeCollections={(v: string) => {
            this.setState((ps: PersonState) => {
              return {
                ...ps,
                collections: v
              };
            });
          }}
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
              const newExternalIDItem: ExternalId =
                ps.externalIds && ps.externalIds[index]
                  ? { ...ps.externalIds[index], [fn]: value }
                  : { [fn]: value };

              return {
                ...ps,
                externalIds: ps.externalIds
                  ? [
                      ...ps.externalIds.slice(0, index),
                      newExternalIDItem,
                      ...ps.externalIds.slice(index + 1)
                    ]
                  : []
              };
            });
          }}
          onDeleteExternalId={(index: number) => (
            e: React.SyntheticEvent<HTMLAnchorElement>
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
