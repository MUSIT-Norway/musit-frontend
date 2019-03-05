import * as React from 'react';
import {
  InputPersonName,
  PersonNameForCollectingEvent
} from '../../../models/object/person';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { PersonOrPersonNameSuggest } from '../../../components/suggest/PersonOrPersonNameSuggest';
import { PersonNameSuggestion } from '../../../components/suggest/PersonNameSuggest';
import { PersonSelectedMode } from '../types';

type PersonNameProps = {
  //personName?: InputPersonName;
  editingPersonName?: InputPersonName;
  editingPerson?: PersonNameForCollectingEvent;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  appSession: AppSession;
  history: History;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onCreateAndAddPersonName: Function;
  onCreateAndAddNewPerson: Function;
  addPersonName?: Function;
  value?: string;
  onChangeSecondPerson: (suggestion: PersonNameSuggestion) => void;
  personSelectedMode?: PersonSelectedMode;
  selectedPerson?: PersonNameForCollectingEvent;
};

const personNameAsString = (n: PersonNameSuggestion) => {
  return (
    <span className="suggestion-content">
      {n
        ? ' Person Name: ' +
          ' ' +
          n.name +
          ' Person: ' +
          n.name +
          ' Uuid:' +
          n.actorUuid.split('-')[0] +
          '  '
        : ''}
    </span>
  );
};

export const PersonNameComponent = (props: PersonNameProps) => {
  return (
    <div
      className="container-fluid"
      style={{ marginTop: '10px', paddingTop: '10px', border: 'thin solid' }}
    >
      <form className="form-horizontal">
        <div className="h4 col-md-6">
          <p>
            <b>
              Hvis detaljene om personnavn og person stemmer, trykk på "Legg til person",
              ellers kan du endre personnavn eller person
            </b>
          </p>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div>
              {''}
              <div className="row">
                <label className="control-label col-md-2" htmlFor="btnNewPersonname">
                  Person Name
                </label>
              </div>
              <br />
              <div className="form-group row">
                <label className="control-label col-md-2" htmlFor="title">
                  Title
                </label>
                <div className="col-sm-4">
                  <input
                    value={props.editingPersonName && props.editingPersonName.title}
                    type="text"
                    className="form-control"
                    id="title"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('title')(e.target.value);
                    }}
                    disabled={props.disableOnChangeOtherName}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-2" htmlFor="first-name">
                  First name
                </label>
                <div className="col-sm-4">
                  <input
                    value={props.editingPersonName && props.editingPersonName.firstName}
                    type="text"
                    className="form-control"
                    id="first-name"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('firstName')(e.target.value);
                    }}
                    disabled={props.disableOnChangeOtherName}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-2" htmlFor="last-name">
                  Last name
                </label>
                <div className="col-sm-4">
                  <input
                    value={props.editingPersonName && props.editingPersonName.lastName}
                    type="text"
                    className="form-control"
                    id="last-name"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('lastName')(e.target.value);
                    }}
                    disabled={props.disableOnChangeOtherName}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="control-label col-md-2" htmlFor="name">
                  Navn
                </label>
                <div className="col-sm-4">
                  <input
                    value={props.editingPersonName && props.editingPersonName.name}
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('name')(e.target.value);
                    }}
                    disabled={props.disableOnChangeFullName}
                  />
                </div>
                {console.log(
                  'PersonNameComponent : ',
                  props.editingPersonName && props.editingPersonName.name
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-md-offset-2">
                <p>
                  <b>
                    Lag nytt navn eller ny person basert på endringer du gjør i feltene
                    over
                  </b>
                </p>{' '}
                <p>
                  <b>Navnet eller personen blir koblet til hendelsen</b>
                </p>
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-3 col-md-offset-2">
                <button
                  id="btnCreatePersonName"
                  data-toggle="Create a new Person Name for the selected Person"
                  title=""
                  type="button"
                  className="btn btn-default"
                  disabled={
                    props.editingPerson && props.editingPerson.actorUuid ? false : true
                  }
                  onClick={e => {
                    e.preventDefault();
                    props.onCreateAndAddPersonName(props.appSession);
                  }}
                >
                  Lag nytt personnavn{' '}
                </button>
              </div>{' '}
              <div className="col-md-3">
                <button
                  id="btnCreatePersonName"
                  data-toggle="Create New Person with Default Name"
                  title=""
                  type="button"
                  disabled={
                    props.editingPersonName && props.editingPersonName.name ? false : true
                  }
                  className="btn btn-default"
                  onClick={e => {
                    props.onCreateAndAddNewPerson(props.appSession);
                  }}
                >
                  Lag ny person
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <br />
            <div className="row">
              <label
                className="control-label "
                htmlFor="PersonNameSuggestCollectingEvent"
              >
                Search Person
              </label>
              <PersonOrPersonNameSuggest
                id="PersonNameSuggestCollectingEvent"
                disabled={false}
                value={props.selectedPerson ? props.selectedPerson.defaultName : ''}
                renderFunc={personNameAsString}
                placeHolder="Person"
                appSession={props.appSession}
                onChange={props.onChangeSecondPerson}
                history={props.history}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonNameComponent;

/*

<form className="form-horizontal">
            <div>
              {''}
              <div className="row">
                <label className="control-label col-md-2" htmlFor="btnNewPersonname">
                  Create
                </label>
              </div>
              <div className="form-group">
                <label className="control-label col-md-2" htmlFor="title">
                  Title
                </label>
                <div className="col-sm-3">
                  <input
                    value={props.editingPersonName && props.editingPersonName.title}
                    type="text"
                    className="form-control"
                    id="title"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('title')(e.target.value);
                    }}
                    disabled={props.disableOnChangeOtherName}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-2" htmlFor="first-name">
                  First name
                </label>
                <div className="col-sm-3">
                  <input
                    value={props.editingPersonName && props.editingPersonName.firstName}
                    type="text"
                    className="form-control"
                    id="first-name"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('firstName')(e.target.value);
                    }}
                    disabled={props.disableOnChangeOtherName}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-2" htmlFor="last-name">
                  Last name
                </label>
                <div className="col-sm-3">
                  <input
                    value={props.editingPersonName && props.editingPersonName.lastName}
                    type="text"
                    className="form-control"
                    id="last-name"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('lastName')(e.target.value);
                    }}
                    disabled={props.disableOnChangeOtherName}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-md-2" htmlFor="name">
                  Navn
                </label>
                <div className="col-sm-3">
                  <input
                    value={props.editingPersonName && props.editingPersonName.name}
                    type="text"
                    className="form-control"
                    id="name"
                    onChange={e => {
                      e.preventDefault();
                      props.onChangeFullName('nameString')(e.target.value);
                    }}
                    disabled={props.disableOnChangeFullName}
                  />
                </div>
                </div>
                <div className="row">
                  <button
                    id="btnCreatePersonName"
                    data-toggle="tooltip"
                    title=""
                    className="btn btn-default col-md-3  "
                    onClick={e => {
                      e.preventDefault();
                      props.onCreatePersonName(props.appSession);
                    }}
                  >
                    Create Person Name
                  </button>
                </div>
              
            </div>
          </form>*/
