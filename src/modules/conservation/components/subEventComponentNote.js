import React from 'react';
import type { SubEventComponentNoteProps } from '../../../types/conservation';
import ObjectSelection from './objectSelection';
import FontAwesome from 'react-fontawesome';
import CollapsibleEvent from './CollapsibleEvent';
import PersonRoleDate from '../../../components/person/PersonRoleDate';
import ViewPersonRoleDate from '../../../components/person/ViewPersonRoleDate';
import find from 'lodash/find';

export default function SubEventComponentNote(props: SubEventComponentNoteProps) {
  const suffix = ':';
  const subEventComponentNote = (
    <div className="container">
      {!props.viewMode &&
      !props.subEvent.id && (
        <div className="row form-group">
          <div div className="col-md-10">
            <button
              className="btn btn-default"
              onClick={e => {
                e.preventDefault();
                props.onDelete && props.onDelete();
              }}
            >
              <FontAwesome name={'times'} />
            </button>
            <hr />
          </div>
        </div>
      )}{' '}
      <div className="row form-group">
        <div className="col-md-11">
          {props.viewMode ? (
            <ViewPersonRoleDate
              personData={props.subEvent.actorsAndRoles || []}
              getDisplayNameForRole={(r: string) => {
                const role = find(props.roleList, rl => rl.roleId === r);
                return role && role.noRole;
              }}
            />
          ) : (
            <PersonRoleDate
              appSession={props.appSession}
              personData={props.subEvent.actorsAndRoles}
              fieldName={'actorsAndRoles'}
              updateForm={props.onChangePersonActorRole}
              getDisplayNameForRole={(r: string | number) => {
                const role = find(props.roleList, rl => rl.roleId === r);
                return role.noRole;
              }}
              roles={props.roleList ? props.roleList.map(e => e.roleId) : []}
              showDateForRole={(roleName: string) => [1].some(e => e === roleName)}
            />
          )}
          <hr />
        </div>
      </div>
      {props.extraAttributes ? props.extraAttributes : ''}
      <div className="row form-group">
        <label className="control-label col-md-2" htmlFor={`note_${props.index}`}>
          {props.noteLabel + suffix}
        </label>
        <div className="col-md-9">
          {props.viewMode ? (
            <p className="form-control-static" id={`note_${props.index}`}>
              {props.subEvent.note}
            </p>
          ) : (
            <textarea
              className="form-control"
              id={`note_${props.index}`}
              value={props.subEvent.note}
              onChange={t => props.onChange('note')(t.target.value)}
              rows="5"
              disabled={props.viewMode}
            />
          )}
        </div>
      </div>
      <ObjectSelection
        affectedThingsWithDetailsMainEvent={props.affectedThingsWithDetailsMainEvent}
        affectedThingsSubEvent={props.subEvent.affectedThings}
        affectedThingsSubEventOnChange={t =>
          props.onChange('affectedThings')(t.map(s => s) || [])}
        viewMode={props.viewMode}
      />
    </div>
  );
  return (
    <CollapsibleEvent
      eventName={props.eventName}
      eventComponent={subEventComponentNote}
      expanded={props.expanded}
      toggleExpanded={props.toggleExpanded}
    />
  );
}
