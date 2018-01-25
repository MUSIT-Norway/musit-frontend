// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import MetaInformation from '../../components/metainfo';
import type { FormData } from './shared/formType';
import ObjectTable from './components/expandableObjects';
import { FormInput, FormTextArea } from '../../forms/components';
import type { History } from '../../types/Routes';
import type { AppSession } from '../../types/appSession';
import FieldMultiSelect from '../../forms/components/FieldMultiSelect';
import type { PredefinedConservation } from '../../types/predefinedConservation';
import type { ConservationSubTypes } from '../../types/conservation';
import Treatment from './events/treatment';
import TechnicalDescription from './events/technicalDescription';
import StorageAndHandling from './events/storageAndHandling';
import PersonRoleDate from '../../components/person/PersonRoleDate';
import HseRisk from './events/hseRisk';
import find from 'lodash/find';
import ConditionAssessment from './events/conditionAssessment';
import Report from './events/report';
import type { Location } from './shared/submit';
import type { ObjectData } from '../../types/object';
import Toolbar from './components/Toolbar';
import MaterialDetermination from './events/materialDetermination';
import ViewPersonRoleDate from '../../components/person/ViewPersonRoleDate';
import Note from './events/note';
import { emitError } from '../../shared/errors';
import { formatISOString } from '../../shared/util';
import FontAwesome from 'react-fontawesome';

type ConservationProcessProps = {
  id?: number,
  caseNumber?: string,
  objects?: Array<any>,
  updateForm: Function,
  updateArrayField: Function,
  updateStringField: Function,
  updateBooleanField: Function,
  updateMultiSelectField: Function,
  updatePersonsForSubEvent: Function,
  updateConservationSubEvent: Function,
  toggleExpanded: Function,
  toggleSingleExpanded: Function,
  toggleObjectsExpanded: Function,
  doneBy?: string,
  doneDate?: string,
  note?: string,
  form: FormData,
  loadingConservation?: boolean,
  history: History,
  clickSaveAndContinue?: ?Function,
  onClickBack?: Function,
  clearForm?: Function,
  clearStore?: Function,
  isFormValid?: boolean,
  store: *,
  predefinedConservation: PredefinedConservation,
  onDocumentUpload?: Function,
  location: Location<Array<ObjectData>>,
  onDelete: Function,
  onEdit: Function,
  onSave: Function,
  onCancel: Function,
  match?: any
};

export type Props = ConservationProcessProps & {
  appSession: AppSession
};

type ProcessFormProps = {
  form: FormData,
  updateStringField: Function
};

function getStatusTextFromErrors(form: FormData) {
  return Object.keys(form).reduce(
    (t: string, e: string) => form[e].status.error || t,
    ''
  );
}

const commonAttributes = v => ({
  eventTypeId: v,
  note: '',
  affectedThings: [],
  documents: [],
  expanded: true,
  viewMode: false
});
function createSubEvents(
  props: Props & { form: FormData, predefinedConservation: PredefinedConservation }
) {
  return () => {
    const defaultActorsAndRoles = [
      {
        actorId:
          props.appSession &&
          props.appSession.actor &&
          props.appSession.actor.dataportenId,
        roleId: 1,
        date: formatISOString(new Date())
      }
    ];
    const eventTypes =
      props.form.subEventTypes && props.form.subEventTypes.rawValue
        ? props.form.subEventTypes.rawValue.split(',').map(t => Number.parseFloat(t))
        : [];
    const akk = eventTypes.reduce((acc, v) => {
      switch (v) {
        case 2: {
          return acc.concat([
            {
              keywords: [],
              materials: [],
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case 3: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case 4: {
          return acc.concat([
            {
              lightLevel: '',
              uvLevel: '',
              relativeHumidity: '',
              temperature: '',
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case 5: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case 6: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              consitionCode: '',
              ...commonAttributes(v)
            }
          ]);
        }
        case 7: {
          return acc.concat([
            {
              archiveReference: '',
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case 8: {
          return acc.concat([
            {
              materials: [],
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case 9: {
          // #TODO MeasurmentAssessment
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case 10: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        default: {
          return [];
        }
      }
    }, []);
    props.clickSaveAndContinue &&
      props.clickSaveAndContinue(
        props.form,
        props.appSession,
        props.location,
        akk,
        props.updateForm,
        props.form.events.name
      );
  };
}

function expanded(form: FormData) {
  return (
    form.events.value &&
    form.events.value.reduce(
      (a: boolean, e: ConservationSubTypes) => a || e.expanded,
      false
    )
  );
}

const suffix = '';

function renderSubEvent(
  appSession: AppSession,
  ind: number,
  eventType: number,
  props: Props & { form: FormData }
) {
  const viewMode = !(
    props.form.editable &&
    props.form.editable.rawValue &&
    props.form.editable.rawValue === ind.toString()
  );

  const urlSubEventId =
    props.match && props.match.params && props.match.params.subEventId;
  const expanded =
    urlSubEventId &&
    props.form.events.value[ind].id &&
    urlSubEventId === props.form.events.value[ind].id.toString()
      ? true
      : props.form.events.value[ind].expanded;

  const extraAttributes = {
    viewMode: viewMode,
    onDelete: props.onDelete(
      props.form.events.rawValue[ind].id,
      props.form.events.rawValue || [],
      ind
    ),
    onEdit: props.onEdit(props.form, ind),
    onSave: props.onSave,
    onCancel: props.onCancel(props.form, ind),
    editable: props.form.editable && props.form.editable.rawValue,
    expanded: expanded,
    roleList: props.predefinedConservation.roleList,
    appSession: appSession,
    index: ind,
    onChange: props.updateConservationSubEvent(
      props.form.events.name,
      props.form.events.rawValue,
      ind
    ),
    onChangePersonActorRole: props.updatePersonsForSubEvent(
      props.form.events.name,
      props.form.events.rawValue,
      ind
    ),
    affectedThingsWithDetailsMainEvent: props.objects || [],
    toggleExpanded: props.toggleSingleExpanded(
      !props.form.events.value[ind].expanded,
      props.form.events.value,
      ind,
      viewMode
    ),
    onDocumentUpload: props.onDocumentUpload
  };

  if (eventType === 2) {
    return (
      <Treatment
        key={`treatment_${ind}`}
        keywords={props.predefinedConservation.keywordList}
        materials={props.predefinedConservation.materialList}
        treatment={props.form.events.rawValue[ind]}
        {...extraAttributes}
      />
    );
  } else if (eventType === 3) {
    return (
      <TechnicalDescription
        key={`techincalDescription_${ind}`}
        technicalDescription={props.form.events.rawValue[ind]}
        {...extraAttributes}
      />
    );
  } else if (eventType === 4) {
    return (
      <StorageAndHandling
        key={`storageAndHandling_${ind}`}
        storageAndHandling={props.form.events.rawValue[ind]}
        {...extraAttributes}
      />
    );
  } else if (eventType === 5) {
    return (
      <HseRisk
        key={`hseRisk_${ind}`}
        hseRisk={props.form.events.rawValue[ind]}
        {...extraAttributes}
      />
    );
  } else if (eventType === 6) {
    return (
      <ConditionAssessment
        key={`conditionAssessment_${ind}`}
        conditionAssessment={props.form.events.rawValue[ind]}
        conditionCodes={props.predefinedConservation.conditionCodeList}
        {...extraAttributes}
      />
    );
  } else if (eventType === 7) {
    return (
      <Report
        key={`report_${ind}`}
        report={props.form.events.rawValue[ind]}
        {...extraAttributes}
      />
    );
  } else if (eventType === 8) {
    return (
      <MaterialDetermination
        key={`materialDetermination_${ind}`}
        materialDeterminationList={props.predefinedConservation.materialDeterminationList}
        materialDetermination={props.form.events.rawValue[ind]}
        {...extraAttributes}
      />
    );
  } else if (eventType === 10) {
    return (
      <Note
        key={`note_${ind}`}
        note={props.form.events.rawValue[ind]}
        {...extraAttributes}
      />
    );
  } else {
    return <div key={`U_${ind}`}> {`Unknown event type: ${eventType}`}</div>;
  }
}

function ConservationProcessForm(props: ProcessFormProps) {
  return (
    <div className="container">
      <form className="form-horizontal" style={{ marginLeft: -20 }}>
        <FormInput
          field={props.form.caseNumber}
          label={I18n.t('musit.conservation.caseNumber') + suffix}
          labelWidth={1}
          labelSize="h3"
          labelAbove={true}
          elementWidth={5}
          value={props.form.caseNumber.value}
          onChange={props.updateStringField(props.form.caseNumber.name)}
          id={props.form.caseNumber.name}
        />
      </form>
    </div>
  );
}

function ViewConservationProcessForm(props: ProcessFormProps) {
  return (
    <div className="container">
      <form className="form-horizontal" style={{ marginLeft: -20 }}>
        <div className="form-group">
          <div className="col-md-10">
            <label className="control-label h3" htmlFor="caseNumber">
              {I18n.t('musit.conservation.caseNumber') + suffix}
            </label>
            <p className="form-control-static" id="caseNumber">
              {props.form.caseNumber.value}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
export default function ConservationComponent(
  props: Props & { form: FormData, predefinedConservation: PredefinedConservation }
) {
  const addMode = props.form.id.value ? false : true;
  const viewModeMainEvent = !(
    (props.form.editable &&
      props.form.editable.rawValue &&
      props.form.editable.rawValue === '-1') ||
    addMode
  );
  const editModeForLookup =
    !(props.form.editable && props.form.editable.rawValue) ||
    (props.form.editable &&
      props.form.editable.rawValue &&
      props.form.editable.rawValue === '-2');

  const editableMainEvent = !!props.form.editable && props.form.editable.rawValue;

  const toolbarBooleanParameterMainEvent = {
    saveDisabled: viewModeMainEvent,
    cancelDisabled: viewModeMainEvent,
    editDisabled: editableMainEvent || addMode,
    deleteDisabled: editableMainEvent || addMode,
    deleteHide: true
  };

  const defaultActorsAndRoles = [
    {
      name: props.appSession && props.appSession.actor && props.appSession.actor.fn,
      uuid:
        props.appSession && props.appSession.actor && props.appSession.actor.dataportenId,
      role: 1,
      date: formatISOString(new Date())
    }
  ];

  return (
    <div className="container">
      <h1>{I18n.t('musit.conservation.conservation')}</h1>
      <button
        key="btn-edit"
        className="btn btn-primary"
        disabled={toolbarBooleanParameterMainEvent.editDisabled}
        onClick={props.onEdit(props.form, -1)}
        style={{ float: 'right', marginRight: 12 }}
      >
        {I18n.t('musit.texts.edit')}
      </button>

      {viewModeMainEvent ? (
        <ViewConservationProcessForm
          form={props.form}
          updateStringField={props.updateStringField}
        />
      ) : (
        <ConservationProcessForm
          form={props.form}
          updateStringField={props.updateStringField}
        />
      )}
      {props.form.id.value && (
        <form className="form-horizontal">
          <div style={{ marginLeft: 20 }}>
            <hr />
            <MetaInformation
              aligned
              registeredBy={props.form.registeredByName.value}
              registeredDate={props.form.registeredDate.value}
              updatedBy={props.form.updatedByName.value}
              updatedDate={props.form.updatedDate.value}
            />
            <hr />
          </div>
        </form>
      )}
      <br />
      <Toolbar
        saveOnClick={props.onSave}
        cancelOnClick={props.onCancel(props.form, -1)}
        {...toolbarBooleanParameterMainEvent}
        md={12}
      />
      <br />
      <div style={{ marginTop: 40, borderBottom: '#cdcdcd 3px solid' }} />
      <br />
      <div className="panel panel-default">
        <div
          className="panel-heading"
          onClick={props.toggleObjectsExpanded(!props.form.objectsExpanded.value)}
        >
          <h2>
            {I18n.t('musit.conservation.objectsConnected')}
            <FontAwesome
              name={!props.form.objectsExpanded.value ? 'chevron-down' : 'chevron-up'}
              style={{ color: 'black', float: 'right' }}
            />
          </h2>
          {`${I18n.t('musit.conservation.numOfObjects')} ${props.objects
            ? props.objects.length
            : 0}`}
        </div>
        <div
          className={`panel-body ${props.form.objectsExpanded.value
            ? 'collapse in'
            : 'collapse'}`}
        >
          <ObjectTable
            data={props.objects || []}
            viewMode={true}
            history={props.history}
            appSession={props.appSession}
          />
        </div>
      </div>
      <br />
      <div style={{ marginTop: 40, borderBottom: '#cdcdcd 3px solid' }} />
      <br />
      {props.form.events &&
      props.form.events.value &&
      props.form.events.value.length > 0 && (
        <div className="form-group">
          <div className="row">
            <div className="col-md-2">
              <div
                key="btn-toggleExpanded"
                type="button"
                className="btn btn-default btn-md"
                onClick={props.toggleExpanded(
                  !expanded(props.form),
                  props.form.events.value
                )}
              >
                {expanded(props.form) ? (
                  I18n.t('musit.conservation.doCollapse')
                ) : (
                  I18n.t('musit.conservation.doExpand')
                )}
              </div>
            </div>
          </div>
          <div>
            <h2>{I18n.t('musit.conservation.subEvents')}</h2>
          </div>
          <div className="row">
            <div className="col-md-12">
              {props.form.events.rawValue.map((v, i) => {
                return renderSubEvent(props.appSession, i, v.eventTypeId, props);
              })}
            </div>
          </div>
        </div>
      )}
      <FieldMultiSelect
        title={I18n.t('musit.conservation.choseNewSubEvents') + suffix}
        titleSize="h4"
        appSession={props.appSession}
        labelAbove
        stringValue={props.form.subEventTypes.rawValue}
        options={
          props.predefinedConservation &&
          props.predefinedConservation.conservationTypes &&
          props.predefinedConservation.conservationTypes.filter(r => r.id > 1).map(v => ({
            value: v.id.toString(),
            label: props.appSession.language.isEn ? v.enName : v.noName
          }))
        }
        onChange={props.updateMultiSelectField(props.form.subEventTypes.name)}
        singleSelect={true}
        viewMode={!editModeForLookup || addMode}
      />
      <button
        key="btn-createSubEvents"
        className="btn btn-default"
        onClick={createSubEvents(props)}
        disabled={
          !props.form.subEventTypes.value ||
          props.form.subEventTypes.value.split(',').length > 1
        }
      >
        {I18n.t('musit.conservation.createNewSubEvents')}
      </button>
      <hr />
      <div
        rel="tooltip"
        title={
          props.isFormValid ? null : (
            `${I18n.t('musit.errorMainMessages.saveDisabled')}: ${getStatusTextFromErrors(
              props.form
            )}`
          )
        }
        className="wrap poptooltip"
      >
        <div style={{ float: 'right' }}>
          <button
            className="btn-link"
            style={{ marginRight: 5 }}
            onClick={props.onClickBack}
          >
            {I18n.t('musit.texts.back')}
          </button>
        </div>
      </div>
      <br />
      <div style={{ paddingBottom: '100px' }} />
    </div>
  );
}
