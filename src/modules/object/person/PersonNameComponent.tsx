import * as React from 'react';
import { InputPersonName } from '../../../models/object/person';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { PersonOrPersonNameSuggest } from '../../../components/suggest/PersonOrPersonNameSuggest';
import { PersonNameSuggestion } from '../../../components/suggest/PersonNameSuggest';
import { PersonSelectedMode } from '../types';

type PersonNameProps = {
  //personName?: InputPersonName;
  editingPersonName?: InputPersonName;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  appSession: AppSession;
  history: History;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onCreatePersonName: Function;
  addPersonName?: Function;
  value?: string;
  onChangeSecondPerson: (suggestion: PersonNameSuggestion) => void;
  personSelectedMode?: PersonSelectedMode;
};

const personNameAsString = (n: PersonNameSuggestion) => {
  return (
    <span className="suggestion-content">
      {n
        ? 'Person: ' +
          n.name +
          ' Uuid:' +
          n.actorUuid.split('-')[0] +
          '  ' +
          ' Person Name: ' +
          ' ' +
          n.name
        : ''}
    </span>
  );
};

export const PersonNameComponent = (props: PersonNameProps) => {
  return (
    <form className="form-horizontal">
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor="SearchPersonOrPersonName">
          Search Person{' '}
        </label>
        <div className="col-sm-5">
          <PersonOrPersonNameSuggest
            id="PersonNameSuggestCollectingEvent"
            disabled={false}
            value={props.value ? props.value : ''}
            renderFunc={personNameAsString}
            placeHolder="Person"
            appSession={props.appSession}
            onChange={props.onChangeSecondPerson}
            history={props.history}
          />
        </div>
      </div>
      <div>{''} </div>
      <div>{''} </div>
      <div className="row">
        <label className="control-label col-md-2" htmlFor="btnNewPersonname">
          {props.personSelectedMode === 'NewPerson'
            ? 'Create a New Person'
            : props.personSelectedMode === 'NewPersonName'
              ? 'Create Person Name'
              : 'Create'}
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
        <div className="col-med-1">
          <button
            id="btnCreatePersonName"
            data-toggle="tooltip"
            title=""
            className="btn btn-default"
            onClick={e => {
              e.preventDefault();
              props.onCreatePersonName(props.appSession);
            }}
          >
            Create Person Name
          </button>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-md-11" style={{ textAlign: 'right' }}>
          <button
            type="button"
            className="btn btn-link"
            onClick={e => {
              e.preventDefault();
              props.history && props.history.goBack();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={e => {
              e.preventDefault();
              props.onCreatePersonName(props.appSession);
            }}
          >
            Save
          </button>
        </div>
      </div> */}
    </form>
  );
};

export default PersonNameComponent;
