import * as React from 'react';
import { PersonNameSuggest } from '../../../components/suggest/PersonNameSuggest';
import { ActorsAndRelation } from '../../../models/object/collectingEvent';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { personDet } from '../../../models/object/classHist';
import { PersonNameComponent } from '../person/PersonNameComponent';
import { inputPersonName } from '../../../models/object/person';

import { EditState, NonEditState } from '../types';

const personNameAsString = (n: ActorsAndRelation) => {
  return (
    <span className="suggestion-content">{n.name ? 'Full Name: ' + n.name : ''}</span>
  );
};

export type PersonNameForCollectingEvent = inputPersonName & {
  personUuid?: string;
  roleId?: number;
};
export interface PersonState {
  personName?: PersonNameForCollectingEvent;
  personsNames?: PersonNameForCollectingEvent[];
  editingPersonName?: PersonNameForCollectingEvent;
  editState?: EditState | NonEditState;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  showNewPersonName?: boolean;
}

export class PersonState implements PersonState {
  public personName?: PersonNameForCollectingEvent;
  public personNames?: PersonNameForCollectingEvent[];
  public editingPersonName?: PersonNameForCollectingEvent;
  public editState?: EditState | NonEditState;
  public disableOnChangeFullName?: boolean;
  public disableOnChangeOtherName?: boolean;
  public showNewPersonName?: boolean;
}

export type PersonProps = {
  personNames?: inputPersonName[];
  disabled: boolean;
  value?: string;
  appSession: AppSession;
  history: History;
  onChangePerson: (suggestion: personDet) => void;
  onAddPerson: () => void;
  onDeletePerson: (i: number) => void;
  editingPersonName?: inputPersonName;
  disableOnChangeFullName?: boolean;
  disableOnChangeOtherName?: boolean;
  showNewPersonName?: boolean;
  onChangeFullName: (fieldName: string) => (newValue: string) => void;
  onCreatePersonName: Function;
  onClickNewPersonName: () => void;
};

const PersonComponent = (props: PersonProps) => {
  return (
    <div className="container-fluid">
      <form className="form-horizontal">
        {' '}
        <div className="form-group">
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
              className="btn btn-default btn-xs"
              onClick={e => {
                e.preventDefault();
                props.onAddPerson();
              }}
            >
              {' '}
              Legg til person
            </button>
          </div>
          <div className="col-md-1">
            <button
              className="btn btn-default btn-xs"
              onClick={e => {
                e.preventDefault();
                props.onClickNewPersonName();
              }}
            >
              {' '}
              Opprett ny person
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
        <div className="form-group">
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
                  props.personNames.map((d: inputPersonName, i: number) => (
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
                          <a
                            href=""
                            onClick={e => {
                              e.preventDefault();
                              props.onDeletePerson(i);
                            }}
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    </div>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonComponent;
