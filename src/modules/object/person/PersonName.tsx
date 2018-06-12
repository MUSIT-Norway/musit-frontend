// @flow

import * as React from "react";
//import FieldMultiSelect from "../../../forms/components/FieldMultiSelect";
import { PersonPage } from "./Person";
import { PersonState, PersonProps, PersonName, ExternalId } from "./Person";

type PersonNameState = {
  title?: string;
  firstName?: string;
  lastName?: string;
};

type AddPersonNameState = {
  visPersonForm: boolean;
  collections?: string;
  personName: PersonNameState;
  person: PersonState;
};

type PersonNameProps = PersonNameState & {
  onClick?: () => void;
};

/*
const Person = (props: PersonProps) => (
  <div>
    <form style={{ padding: "25px" }}>
      <h3>Add new person</h3>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="displayName">Display name</label>
          <input type="text" className="form-control" id="displayName" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="legal-entity">Legal entity type</label>
          <select className="form-control" id="legal-entity">
            <option>Person</option>
            <option>Gruppe</option>
            <option>Organisasjon</option>
            <option>Institusjon</option>
            <option>Firma</option>
          </select>
        </div>
      </div>
      <FieldMultiSelect
        stringValue={props.collectionsString}
        labelAbove
        options={[
          { label: "Lav", value: "L" },
          { label: "Karplanter", value: "V" },
          { label: "Mose", value: "M" },
          { label: "Alger", value: "A" },
          { label: "Sopp", value: "F" },
          { label: "Terristiske evertebrater", value: "TI" },
          { label: "Terristiske evertebrater", value: "MI" }
        ]}
        onChange={(v: React.ChangeEvent<JSX.Element>) =>
          props.onChangeCollections(v)}
        title="Samlinger for person"
      />
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="bornDate">Født</label>
          <input type="text" className="form-control" id="bornDate" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-3">
          <label htmlFor="deadDate">Død</label>
          <input type="text" className="form-control" id="deadDate" />
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-6">
          <table className="table table-bordered form-group">
            <thead>
              <tr>
                <th>Database</th>
                <th>Ekstern identifikator (UUID)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select>
                    <option>HUH</option>
                    <option>ISNI</option>{" "}
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control" id="row1" />
                </td>
              </tr>
              <tr>
                <td>
                  <select>
                    <option>HUH</option>
                    <option>ISNI</option>{" "}
                  </select>
                </td>
                <td>
                  <input type="text" className="form-control" id="row1" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="form-group row">
        <div className="col-sm-6">
          <label htmlFor="url">URL</label>
          <input type="text" className="form-control" id="url" />
        </div>
      </div>
    </form>
  </div>
);
*/

const PersonName = (props: PersonNameProps) => (
  <div>
    {" "}
    <form style={{ padding: "25px" }}>
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
          <select className="form-control" id="person">
            <option>And, Arne</option>
            <option>Duck, Dolly</option>
            <option>Duck, Donald</option>
            <option>Mus, Mikke</option>
            <option>Kent, Clark</option>
            <option>Wayne, Bruce</option>
            <option>Parker, Peter</option>
            <option>Lane, Louise</option>
          </select>
          <button
            type="button"
            className="btn btn-default"
            onClick={props.onClick}
          >
            Ny person
          </button>
        </div>
      </div>
    </form>
  </div>
);

export class AddPersonName extends React.Component<
  PersonNameProps & PersonProps,
  AddPersonNameState
> {
  constructor(props: PersonNameProps & PersonProps) {
    super(props);
    this.state = { visPersonForm: false, personName: {}, person: {} };
  }
  render() {
    return (
      <div style={{ padding: "25px" }}>
        <PersonName
          firstName={this.props.firstName}
          title={this.props.title}
          lastName={this.props.lastName}
          onClick={() =>
            this.setState((prev: any, props: PersonNameProps) => ({
              ...prev,
              visPersonForm: true
            }))}
        />
        {this.state.visPersonForm && (
          <PersonPage
            {...this.state.person}
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
                  : []).concat(
                  personState.externalIds
                    ? personState.externalIds.slice(index + 1)
                    : []
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
            onChangePersonName={(fieldName: string) => (value: string) => {
              this.setState((ps: AddPersonNameState) => {
                const newPersonState = ps.person;

                const lastName =
                  fieldName === "lastName"
                    ? value
                    : newPersonState.newPerson &&
                      newPersonState.newPerson.lastName;
                const title =
                  fieldName === "title"
                    ? value
                    : newPersonState.newPerson &&
                      newPersonState.newPerson.title;
                const firstName =
                  fieldName === "firstName"
                    ? value
                    : newPersonState.newPerson &&
                      newPersonState.newPerson.firstName;
                const nameString = `${lastName || ""}${title || firstName
                  ? ", "
                  : ""}${title || ""}${title ? " " : ""}${firstName || ""}`;

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
                    externalIds: (newPersonState.externalIds || [])
                      .concat([{ database: "", uuid: "" }])
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
                        newPersonName &&
                        (pn.synonymes || []).concat([newPersonName]),
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
                  collections: ps.collections ? ps.collections + "," + v : v
                };
                return {
                  ...ps,
                  person
                };
              });
            }}
            onChangeExternalIds={(index: number) => (fn: string) => (
              value: string
            ) => {
              this.setState((ps: AddPersonNameState) => {
                const newPersonState = ps.person;
                const newExternalIDItem: ExternalId =
                  newPersonState.externalIds &&
                  newPersonState.externalIds[index]
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
        )}
      </div>
    );
  }
}

export default AddPersonName;
