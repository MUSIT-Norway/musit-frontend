import * as React from 'react';
import { PersonNameSuggest } from '../../../components/suggest/PersonNameSuggest';
import { ActorsAndRelation } from '../../../models/object/collectingEvent';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { personDet } from '../../../models/object/classHist';
import { PersonNameComponent } from '../person/PersonNameComponent';
import { OutputPersonName, InputPersonName } from '../../../models/object/person';

import { EditState, NonEditState } from '../types';
import EditAndSaveButtons from '../components/EditAndSaveButtons';

const personNameAsString = (n: ActorsAndRelation) => {
  return (
    <span className="suggestion-content">{n.name ? 'Full Name: ' + n.name : ''}</span>
  );
};

export type PersonNameForCollectingEvent = OutputPersonName & {
  personUuid?: string;
  roleId: number;
};
export interface PersonState {
  personName?: PersonNameForCollectingEvent;
  personNames?: PersonNameForCollectingEvent[];
  editingPersonName?: InputPersonName;
  editState?: EditState | NonEditState;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  showNewPersonName?: boolean;
}

export type PersonProps = {
  personNames?: OutputPersonName[];
  formInvalid: boolean;
  disabled: boolean;
  value?: string;
  appSession: AppSession;
  history: History;
  onClickSave: () => void;
  onClickEdit: () => void;
  onChangePerson: (suggestion: personDet) => void;
  onAddPerson: () => void;
  onDeletePerson: (i: number) => void;
  editingPersonName?: InputPersonName;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  showNewPersonName?: boolean;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onCreatePersonName: Function;
  onClickNewPersonName: () => void;
};

export const ViewPersonComponent = (props: {
  personNames: PersonNameForCollectingEvent[] | undefined;
}) => {
  return (
    <div className="container-fluid">
      <table className="table table-condensed">
        <thead>
          <th>Uuid</th>
          <th>Name</th>
        </thead>
        <tbody>
          {props.personNames &&
            props.personNames.map((p: OutputPersonName, i: number) => (
              <tr key={`pn-${i}`}>
                <td>{p.personNameUuid}</td>
                <td>{p.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const PersonComponent = (props: PersonProps) => {
  return (
    <div className="container-fluid">
      {' '}
      <div className="row">
        <label
          className="control-label col-md-2"
          htmlFor="PersonNameSuggestCollectingEvent"
        >
          Person name
        </label>
        <div className="col-md-6">
          <PersonNameSuggest
            id="PersonNameSuggestCollectingEvent"
            disabled={props.disabled}
            value={props.value}
            renderFunc={personNameAsString}
            placeHolder="Person Name"
            appSession={props.appSession}
            onChange={props.onChangePerson}
            history={props.history}
            hideCreateNewPerson={true}
          />
        </div>
        <div className="col-md-1">
          <button
            className="btn btn-default"
            disabled={props.disabled}
            onClick={e => {
              e.preventDefault();
              props.onAddPerson();
            }}
          >
            {' '}
            Legg til person
          </button>
        </div>
      </div>
      <div className="row">
        <label className="control-label col-md-2" htmlFor="btnNewPersonname">
          Fant du ikke personnavnet?
        </label>
        <div className="col-md-2">
          <button
            id="btnNewPersonname"
            disabled={props.disabled}
            className="btn btn-default btn-sm"
            onClick={e => {
              e.preventDefault();
              props.onClickNewPersonName();
            }}
          >
            {props.showNewPersonName ? 'Klikk for å skjule' : 'Lag nytt personnavn'}
          </button>
        </div>
      </div>
      {props.showNewPersonName && (
        <PersonNameComponent
          editingPersonName={props.editingPersonName}
          disableOnChangeFullName={props.disableOnChangeFullName}
          disableOnChangeOtherName={props.disableOnChangeOtherName}
          appSession={props.appSession}
          history={props.history}
          onCreatePersonName={props.onCreatePersonName}
          onChangeFullName={props.onChangeFullName}
        />
      )}
      <div className="row">
        <div className="col-md-10 col-md-offset-2">
          <table className="table table-condensed table-hover">
            <thead>
              <tr>
                <th>Personer i denne hendelsen</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {props.personNames &&
                props.personNames.map((d: InputPersonName, i: number) => (
                  <div key={`det-row-${i}`}>
                    <tr>
                      <td className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          disabled={true}
                          value={d.name}
                        />
                      </td>
                      <td className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          disabled={true}
                          value={d.personNameUuid}
                        />
                      </td>
                      <td className="col-md-1">
                        {props.disabled ? (
                          'Delete'
                        ) : (
                          <a
                            href=""
                            onClick={e => {
                              e.preventDefault();
                              props.onDeletePerson(i);
                            }}
                          >
                            Delete
                          </a>
                        )}
                      </td>
                    </tr>
                  </div>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditAndSaveButtons
        onClickCancel={() => {}}
        onClickEdit={props.onClickEdit}
        onClickSave={props.onClickSave}
        onClickDraft={() => {}}
        editButtonState={{ visible: true, disabled: false }}
        saveButtonState={{ visible: true, disabled: props.formInvalid }}
        cancelButtonState={{ visible: true, disabled: false }}
        draftButtonState={{ visible: false, disabled: false }}
        saveButtonText={'Save'}
        draftButtonText={'Utkast'}
        editButtonText={'Endre'}
        cancelButtonText={'Avbryt'}
      />
    </div>
  );
};

export default PersonComponent;
