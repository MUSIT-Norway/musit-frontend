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
export type SynState = 'SEARCH' | 'SYNONYMIZE' | 'CONFIRM';
export type SynProps = { state: SynState; synPersons: SynPersons } & {
  onClickNext: () => void;
};

export type SynPersons = {
  fullName: string;
  bornDate?: string;
  synonymes?: string;
}[];

export type PersonState = {
  uuid?: string;
  fullName?: PersonName;
  synState: SynState;
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
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onAddExternalId: () => void;
  onClickNext: () => void;
  onChangeCollections: (newString: string) => void;
  onDeleteExternalId: (i: number) => (e: React.SyntheticEvent<HTMLAnchorElement>) => void;
  onChangeExternalIds: (i: number) => (field: string) => (value: string) => void;
  onClearBornDate: Function;
  onChangeBornDate: Function;
  onClearDeathDate: Function;
  onChangeDeathDate: Function;
  heading?: string;
  standAlone?: boolean;
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
                    <select className="form-control" id="legalEntityType">
                      <option>Person</option>
                      <option>Group</option>
                      <option>Organisasion</option>
                      <option>Institution</option>
                      <option>Business</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-8">
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
                    onClickAdd={props.onClickAdd}
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
                onClick={() => props.onClickAdd(props.newPerson)}
              >
                Add person name
              </button>
            </div>
            <div className="well well-sm">
              <ExternalIDStrings
                externalIds={props.externalIds}
                onAdd={props.onAddExternalId}
                onChange={props.onChangeExternalIds}
                onDelete={props.onDeleteExternalId}
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
              <button type="button" className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export class Person extends React.Component<PersonProps, PersonState> {
  constructor(props: PersonProps) {
    super(props);
    this.state = { synState: 'SEARCH' };
  }
  render() {
    return (
      <div className="container" style={{ paddingTop: '25px' }}>
        <PersonPage
          standAlone
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
          externalIds={this.state.externalIds || []}
          fullName={this.state.fullName}
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
                : []
              ).concat(p.externalIds ? p.externalIds.slice(index + 1) : []);
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
