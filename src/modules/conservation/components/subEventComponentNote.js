import React from 'react';
import type { SubEventComponentNoteProps } from '../../../types/conservation';
import ObjectSelection from './objectSelection';
import FontAwesome from 'react-fontawesome';
import CollapsibleEvent from './CollapsibleEvent';
import PersonRoleDate from '../../../components/person/PersonRoleDate';
import ViewPersonRoleDate from '../../../components/person/ViewPersonRoleDate';
import find from 'lodash/find';
import { FormFileSelect, FormElement } from '../../../forms/components';
import { saveBlob } from '../../../shared/download';
import { getFileAsBlob } from '../../../models/conservation/documents';
import { I18n } from 'react-i18nify';
import Toolbar from './Toolbar';

export default function SubEventComponentNote(props: SubEventComponentNoteProps) {
  const suffix = ':';
  console.log('in SubEventComponentNote props', props);
  const toolbarBooleanParameter = {
    saveDisabled: props.viewMode,
    cancelDisabled: props.viewMode,
    editDisabled: !!props.editable,
    deleteDisabled: !!props.editable
  };
  const subEventComponentNote = (
    <div className="container">
      {!props.viewMode &&
      !props.subEvent.id && (
        <div className="row form-group">
          <div className="col-md-10">
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
        <div className="col-md-9">
          <label className="control-label" htmlFor={`note_${props.index}`}>
            {props.noteLabel + suffix}
          </label>
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
      {!props.viewMode && (
        <div className="row">
          <FormFileSelect
            id="resultFiles"
            label={I18n.t('musit.conservation.documents') + suffix}
            labelWidth={2}
            elementWidth={5}
            value={props.subEvent.documents}
            multiple={true}
            onChange={files => files && props.onDocumentUpload(props.subEvent.id, files)}
          />
        </div>
      )}
      {props.subEvent.files && (
        <FormElement id="Files" label={''} labelWidth={2} elementWidth={5}>
          <div className="row form-control-static">
            {Array.isArray(props.subEvent.files) &&
              props.subEvent.files.map(file => {
                if (file.error) {
                  return null;
                }
                const fid = file.fid;
                const title = file.title;
                return (
                  <p key={fid}>
                    <button
                      className="btn-link"
                      onClick={e => {
                        e.preventDefault();
                        getFileAsBlob(
                          fid,
                          props.appSession.museumId,
                          props.appSession.accessToken
                        )
                          .do(res => {
                            if (res instanceof Blob) {
                              saveBlob(res, title);
                            }
                          })
                          .toPromise();
                      }}
                    >
                      {file.title}
                    </button>
                  </p>
                );
              })}
          </div>
        </FormElement>
      )}
      <ObjectSelection
        affectedThingsWithDetailsMainEvent={props.affectedThingsWithDetailsMainEvent}
        affectedThingsSubEvent={props.subEvent.affectedThings}
        affectedThingsSubEventOnChange={t =>
          props.onChange('affectedThings')(t.map(s => s) || [])}
        viewMode={props.viewMode}
      />
      <Toolbar
        saveOnClick={e => props.onSave(e)}
        cancelOnClick={e => props.onCancel(e)}
        deleteOnClick={e => props.onDelete(e)}
        editOnClick={e => props.onEdit(e)}
        {...toolbarBooleanParameter}
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
