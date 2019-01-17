import * as React from 'react';
import { InputPersonName } from '../../../models/object/person';
import { AppSession } from 'src/types/appSession';
import { History } from 'history';


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
};

export const PersonNameComponent = (props: PersonNameProps) => {
  return (
    <form className="form-horizontal">
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
        <div className="col-sm-4">
         
         {/* Autosuggest for Person */}
         

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
              props.onChangeFullName('name')(e.target.value);
            }}
            disabled={props.disableOnChangeFullName}
          />
        </div>
        <div className="col-med-1">
          <button id="btnCreatePerson" data-toggle="tooltip" title="" className="btn">
            Create Person
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
