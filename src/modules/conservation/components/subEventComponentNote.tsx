import * as React from 'react';
import { SubEventComponentNoteProps } from '../../../types/conservation';
import ObjectSelection from './objectSelection';
import CollapsibleEvent from './CollapsibleEvent';
import PersonRoleDate from '../../../components/person/PersonRoleDate';
import ViewPersonRoleDate from '../../../components/person/ViewPersonRoleDate';
import { find } from 'lodash';
import { FormFileSelect } from '../../../forms/components';
import { saveBlob } from '../../../shared/download';
import { getFileAsBlob } from '../../../models/conservation/documents';
import { I18n } from 'react-i18nify';
import Toolbar from './Toolbar';
import { showModal } from '../../../shared/modal';
import SelectAdditionalObjectsComponent from './selectAdditionalObjectsComponent/SelectAdditionalObjectsComponent';
import { TODO } from '../../../types/common';

export default function SubEventComponentNote(props: SubEventComponentNoteProps) {
  const suffix = ':';
  const toolbarBooleanParameter = {
    saveDisabled: props.viewMode || !props.isFormValid,
    cancelDisabled: props.viewMode,
    editDisabled:
      !!props.editable || !props.appSession.rolesForModules.collectionManagementWrite,
    deleteDisabled:
      !!props.editable || !props.appSession.rolesForModules.collectionManagementWrite
  };

  function addObjects() {
    showModal(
      I18n.t('musit.texts.selectObjects'),
      <SelectAdditionalObjectsComponent
        addObjects={(objects: string[]) => {
          props.onAddAffectedThings(objects);
          props.onAddObjectsToSubEvent('affectedThings')(objects);
        }}
      />
    );
  }

  const subEventComponentNote = (
    <div className="container">
      <button
        key="btn-edit"
        className="btn btn-primary"
        disabled={toolbarBooleanParameter.editDisabled}
        onClick={props.onEdit}
        style={{ float: 'right', marginRight: 110 }}
      >
        {I18n.t('musit.texts.edit')}
      </button>
      <br />
      <div className="form-group">
        <div className="row">
          <div className="col-md-11">
            <h4>Personer tilknyttet rollen</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-11">
            {props.viewMode ? (
              <ViewPersonRoleDate
                personData={props.subEvent.actorsAndRoles || []}
                getDisplayNameForRole={(r: string) => {
                  const role = find(props.roleList, rl => rl.roleId === r);
                  return props.appSession.language.isEn ? role.enRole : role.noRole;
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
                  return props.appSession.language.isEn ? role.enRole : role.noRole;
                }}
                roles={props.roleList ? props.roleList.map(e => e.roleId) : []}
                showDateForRole={(roleName: number) => [1].some(e => e === roleName)} //TODO: Check whether some roles should have dates displayed
              />
            )}
          </div>
        </div>
      </div>
      {props.extraAttributes ? props.extraAttributes : ''}
      <div className="row form-group">
        <div className="col-md-9">
          <label className="control-label h4" htmlFor={`note_${props.index}`}>
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
              rows={5}
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
            labelSize="h4"
            labelAbove
            elementWidth={5}
            value={props.subEvent.documents as TODO}
            multiple={true}
            onChange={files =>
              files &&
              props.onDocumentUpload &&
              props.onDocumentUpload((props.subEvent as TODO).id, files)
            }
          />
        </div>
      )}
      {props.subEvent.files && (
        <div className="form-group">
          <div className="row">
            <div className="col-md-5">
              <label className="control-label h4" htmlFor={`document_${props.index}`}>
                {props.viewMode ? I18n.t('musit.conservation.documents') + suffix : ''}
              </label>
              {Array.isArray(props.subEvent.files) &&
                props.subEvent.files.map(file => {
                  if (file.error) {
                    return null;
                  }
                  const fid = file.fid;
                  const title = file.title;
                  return (
                    <div key={fid}>
                      <a
                        href="#"
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
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      <br />
      <br />
      {props.eventName !==
        I18n.t(
          'musit.conservation.events.measurementDetermination.measurementDetermination'
        ) &&
        props.eventName !==
          I18n.t(
            'musit.conservation.events.materialDetermination.materialDetermination'
          ) && (
          <button
            key="btn-addObject"
            className="btn btn-primary"
            disabled={props.viewMode}
            onClick={objects => addObjects()}
            style={{ float: 'left', marginRight: 110 }}
          >
            {I18n.t('musit.texts.addObjects')}
          </button>
        )}
      <ObjectSelection
        affectedThingsWithDetailsMainEvent={props.affectedThingsWithDetailsMainEvent}
        affectedThingsSubEvent={props.subEvent.affectedThings}
        affectedThingsSubEventOnChange={(t: TODO[]) =>
          props.onChange('affectedThings')(t.map(s => s) || [])
        }
        viewMode={props.viewMode || props.objectsReadOnly}
      />

      <br />
      <br />
      <div
        //? rel="tooltip"
        title={
          props.isFormValid
            ? undefined
            : `${I18n.t('musit.errorMainMessages.saveDisabled')}: ${
                (props as TODO).getStatusTextFromErrors
              }`
        }
        className="wrap poptooltip"
      >
        <Toolbar
          saveOnClick={(e: TODO) => (props as TODO).onSave(e)}
          cancelOnClick={(e: TODO) => (props as TODO).onCancel(e)}
          deleteOnClick={(e: TODO) => (props as TODO).onDelete(e)}
          {...toolbarBooleanParameter}
          md={11}
        />
      </div>
    </div>
  );
  return (
    <CollapsibleEvent
      eventName={props.eventName}
      //TODO: ? noteLabel
      eventComponent={subEventComponentNote}
      expanded={props.expanded}
      toggleExpanded={props.toggleExpanded}
      editMode={!props.viewMode}
    />
  );
}
