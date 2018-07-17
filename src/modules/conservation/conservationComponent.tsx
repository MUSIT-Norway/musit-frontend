// @flow
import * as React from 'react';
import { I18n } from 'react-i18nify';
import MetaInformation from '../../components/metainfo';
import ObjectTable from './components/expandableObjects';
import { FormInput } from '../../forms/components';
import { History } from 'history';
import { AppSession } from '../../types/appSession';
import FieldMultiSelect from '../../forms/components/FieldMultiSelect';
import { PredefinedConservation } from '../../types/predefinedConservation';
import { ConservationSubTypes, FormData } from '../../types/conservation';
import Treatment from './events/treatment';
import TechnicalDescription from './events/technicalDescription';
import MeasurementDetermination from './events/measurementDetermination';
import StorageAndHandling from './events/storageAndHandling';
import HseRisk from './events/hseRisk';
import ConditionAssessment from './events/conditionAssessment';
import Report from './events/report';
import { Location } from './shared/submit';
import { ObjectData } from '../../types/object';
import Toolbar from './components/Toolbar';
import SingleObjectSelection from './components/SingleObjectSelection';
import MaterialDetermination from './events/materialDetermination';
import Note from './events/note';
import {
  formatISOString,
  treatmentTypeId,
  technicalDescriptionTypeId,
  storageAndHandlingTypeId,
  hseRiskAssessmentTypeId,
  conditionAssessmentTypeId,
  reportTypeId,
  materialDeterminationTypeId,
  measurementDeterminationTypeId,
  noteTypeId
} from '../../shared/util';
import * as FontAwesome from 'react-fontawesome';
import { sortBy, toLower, capitalize } from 'lodash';
import * as Loader from 'react-loader';
import { Maybe, Star, TODO } from '../../types/common';
import { MouseEventHandler, FormEventHandler } from 'react';

type ConservationProcessProps = {
  id?: number;
  caseNumber?: string;
  objects?: Array<any>;
  updateForm: Function;
  updateArrayField: Function;
  updateStringField: Function;
  updateBooleanField: Function;
  updateMultiSelectField: Function;
  updatePersonsForSubEvent: Function;
  updateConservationSubEvent: Function;
  updateSingleObjectField: Function;
  addObjectsToSubEvent: Function;
  //addNewObjectToSubEventAndProcess: Function,
  getEventObjectDetails?: Function;
  addAffectedThings: Function;
  toggleExpanded: Function;
  toggleSingleExpanded: Function;
  toggleObjectsExpanded: Function;
  searchStore: any;
  doneBy?: string;
  doneDate?: string;
  note?: string;
  form: FormData;
  loadingConservation?: boolean;
  history: History;
  addNewSubEvent?: Maybe<Function>;
  onClickBack?: MouseEventHandler;
  clearForm?: Function;
  clearStore?: Function;
  setLoading?: Function;
  isFormValid?: boolean;
  store: Star;
  predefinedConservation: PredefinedConservation;
  onDocumentUpload?: Function;
  location: Location<Array<ObjectData>>;
  onDelete: Function;
  onEdit: Function;
  onSave: MouseEventHandler;
  onCancel: MouseEventHandler;
  onChangeQueryParam?: Function;
  onSearch?: Function;
  match?: any;
  downloadConservationReport?: Function;
  addMode?: boolean;
};

export type Props = ConservationProcessProps & {
  appSession: AppSession;
};

type ProcessFormProps = {
  form: FormData;
  updateStringField: Function;
  onSubmit?: FormEventHandler;
};

const commonAttributes = (v: TODO) => ({
  eventTypeId: v,
  note: '',
  affectedThings: [],
  documents: [],
  expanded: true,
  viewMode: false,
  isUpdated: true
});

export function borderStyle(editMode: boolean) {
  if (editMode) {
    return {
      border: '0.5px solid #0099ff',
      boxShadow: editMode ? '0px 0px 3px 0px #33adff' : ''
    };
  } else return undefined;
}

function getStatusTextFromErrors(form: FormData) {
  return Object.keys(form).reduce(
    (t: string, e: string) => form[e].status.error || t,
    ''
  );
}

function createSubEvents(
  props: Props & {
    form: FormData;
    predefinedConservation: PredefinedConservation;
  }
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

    const affectedThings = [props.form.singleObjectSelected.value];
    const eventTypes =
      props.form.subEventTypes && props.form.subEventTypes.rawValue
        ? (props.form.subEventTypes.rawValue as TODO)
            .split(',')
            .map((t: TODO) => Number.parseFloat(t))
        : ([] as TODO[]);
    const akk = eventTypes.reduce((acc: TODO[], v: TODO) => {
      switch (v) {
        case treatmentTypeId: {
          return acc.concat([
            {
              keywords: [],
              materials: [],
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case technicalDescriptionTypeId: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case storageAndHandlingTypeId: {
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
        case hseRiskAssessmentTypeId: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case conditionAssessmentTypeId: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              consitionCode: '',
              ...commonAttributes(v)
            }
          ]);
        }
        case reportTypeId: {
          return acc.concat([
            {
              archiveReference: '',
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v)
            }
          ]);
        }
        case materialDeterminationTypeId: {
          return acc.concat([
            {
              materials: [],
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v),
              affectedThings: [].concat(affectedThings as TODO)
            }
          ]);
        }
        case measurementDeterminationTypeId: {
          return acc.concat([
            {
              actorsAndRoles: defaultActorsAndRoles,
              ...commonAttributes(v),
              affectedThings: [].concat(affectedThings as TODO),
              measurementData: {}
            }
          ]);
        }
        case noteTypeId: {
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
    props.addNewSubEvent &&
      props.addNewSubEvent(
        props.form,
        props.appSession,
        props.location,
        akk,
        props.updateForm
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
  const expandOnView =
    props.form && props.form.expandOnView && props.form.expandOnView.rawValue;
  const expanded =
    urlSubEventId &&
    expandOnView &&
    props.form.events.value &&
    (props.form.events.value[ind] as TODO).id &&
    urlSubEventId === (props.form.events.value[ind] as TODO).id.toString()
      ? true
      : (props.form.events as TODO).value[ind].expanded;

  const extraAttributes = {
    viewMode: viewMode,
    onDelete: props.onDelete(
      (props.form.events as TODO).rawValue[ind].id,
      props.form.events.rawValue || [],
      ind
    ),
    onEdit: props.onEdit(props.form, ind),
    onSave: props.onSave,
    onCancel: (props.onCancel as TODO)(props.form, ind),
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
    /*
    addNewObjectToSubEventAndProcess: props.addNewObjectToSubEventAndProcess(
      props.form.events.name,
      props.form.events.rawValue,
      ind,
      props.form.affectedThings.value
    ),*/
    onAddObjectsToSubEvent: props.addObjectsToSubEvent(
      props.form.events.name,
      props.form.events.value,
      ind
    ),
    getEventObjectDetails: props.getEventObjectDetails,
    onAddAffectedThings: props.addAffectedThings(props.form.affectedThings.name)(
      props.form.affectedThings.value
    ),
    searchStore: props.searchStore,
    affectedThingsWithDetailsMainEvent: props.objects || [],
    toggleExpanded: props.toggleSingleExpanded(
      !expanded,
      props.form.events.value,
      ind,
      viewMode
    ),
    onDocumentUpload: props.onDocumentUpload,
    isFormValid: props.isFormValid,
    getStatusTextFromErrors: getStatusTextFromErrors(props.form)
  };

  /*Sorry about the REALLY ugly TODO casting below, but a deeper cleanup is needed in the conservation data-model in order to do it properly */
  if (eventType === treatmentTypeId) {
    return (
      <Treatment
        key={`treatment_${ind}`}
        keywords={props.predefinedConservation.keywordList as TODO}
        materials={props.predefinedConservation.materialList as TODO}
        treatment={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === technicalDescriptionTypeId) {
    return (
      <TechnicalDescription
        key={`techincalDescription_${ind}`}
        technicalDescription={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === storageAndHandlingTypeId) {
    return (
      <StorageAndHandling
        key={`storageAndHandling_${ind}`}
        storageAndHandling={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === hseRiskAssessmentTypeId) {
    return (
      <HseRisk
        key={`hseRisk_${ind}`}
        hseRisk={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === conditionAssessmentTypeId) {
    return (
      <ConditionAssessment
        key={`conditionAssessment_${ind}`}
        conditionAssessment={(props.form.events as TODO).rawValue[ind]}
        conditionCodes={props.predefinedConservation.conditionCodeList as TODO}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === reportTypeId) {
    return (
      <Report
        key={`report_${ind}`}
        report={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === materialDeterminationTypeId) {
    return (
      <MaterialDetermination
        key={`materialDetermination_${ind}`}
        materialDeterminationList={
          props.predefinedConservation.materialDeterminationList as TODO
        }
        materialDetermination={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === measurementDeterminationTypeId) {
    return (
      <MeasurementDetermination
        key={`measurementDetermination${ind}`}
        measurementDetermination={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else if (eventType === noteTypeId) {
    return (
      <Note
        key={`note_${ind}`}
        note={(props.form.events as TODO).rawValue[ind]}
        {...extraAttributes as TODO}
      />
    );
  } else {
    return <div key={`U_${ind}`}> {`Unknown event type: ${eventType}`}</div>;
  }
}

function ConservationProcessForm(props: ProcessFormProps) {
  return (
    <div className="container">
      <form
        onSubmit={props.onSubmit}
        className="form-horizontal"
        style={{ marginLeft: -20 }}
      >
        <FormInput
          //? field={props.form.caseNumber}
          label={I18n.t('musit.conservation.caseNumber') + suffix}
          labelWidth={1}
          labelSize="h3"
          labelAbove={true}
          elementWidth={5}
          value={props.form.caseNumber.value}
          onChange={props.updateStringField(props.form.caseNumber.name)}
          id={props.form.caseNumber.name}
          style={borderStyle(true)}
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
  props: Props & {
    form: FormData;
    predefinedConservation: PredefinedConservation;
  }
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

  const conservationTypes =
    props.predefinedConservation &&
    props.predefinedConservation.conservationTypes &&
    props.predefinedConservation.conservationTypes.filter(r => r.id > 1).map(v => ({
      value: v.id.toString(),
      label: props.appSession.language.isEn ? v.enName : v.noName
    }));
  const sortedConservationTypes = sortBy(conservationTypes || [], o => toLower(o.label)); //Remove filter when Målbestemmelse is implemented

  return (
    <div className="container">
      <Loader
        loaded={
          !props.addMode && props.store ? props.store.conservation !== undefined : true
        }
      />
      {props.store && <Loader loaded={!props.store.loadingConservation} />}
      <h1>{I18n.t('musit.conservation.conservation')}</h1>

      {props.form.id.value && (
        <button
          key="btn-report"
          className="btn btn-primary"
          disabled={!props.appSession.rolesForModules.collectionManagementRead}
          onClick={e =>
            props.downloadConservationReport &&
            props.downloadConservationReport(props.appSession, props.form.id.value)
          }
          title={
            !props.appSession.rolesForModules.collectionManagementRead
              ? I18n.t('musit.texts.doNotHaveSufficientRole')
              : I18n.t('musit.texts.conservationReport')
          }
          style={{ float: 'right', marginRight: 12 }}
        >
          {I18n.t('musit.texts.report')}
        </button>
      )}
      {props.form.id.value && (
        <form className="form-horizontal">
          <br />
          <div style={{ marginLeft: 20 }}>
            <MetaInformation
              aligned
              registeredBy={props.form.registeredByName.value}
              registeredDate={props.form.registeredDate.value}
              updatedBy={props.form.updatedByName.value}
              updatedDate={props.form.updatedDate.value}
            />
          </div>
          <hr />
        </form>
      )}

      <button
        key="btn-edit"
        className="btn btn-primary"
        disabled={
          !!(
            toolbarBooleanParameterMainEvent.editDisabled ||
            !props.appSession.rolesForModules.collectionManagementWrite
          )
        }
        onClick={props.onEdit(props.form, -1)}
        title={
          !props.appSession.rolesForModules.collectionManagementWrite
            ? I18n.t('musit.texts.doNotHaveSufficientRole')
            : I18n.t('musit.texts.edit')
        }
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
          onSubmit={props.onSave}
        />
      )}
      <Toolbar
        saveOnClick={props.onSave}
        cancelOnClick={(props.onCancel as TODO)(props.form, -1)}
        {...toolbarBooleanParameterMainEvent as TODO}
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
          {`${I18n.t('musit.conservation.numOfObjects')} ${
            props.objects ? props.objects.length : 0
          }`}
        </div>
        <div
          className={`panel-body ${
            props.form.objectsExpanded.value ? 'collapse in' : 'collapse'
          }`}
        >
          <ObjectTable
            data={props.objects || []}
            viewMode={true}
            history={props.history}
            appSession={props.appSession}
          />
        </div>
      </div>
      <div style={{ borderBottom: '#cdcdcd 3px solid' }} />
      <br />
      {props.form.events &&
        props.form.events.value &&
        props.form.events.value.length > 0 && (
          <div className="form-group">
            <div className="row">
              <div className="col-md-2">
                <button
                  key="btn-toggleExpanded"
                  type="button"
                  className="btn btn-default btn-md"
                  disabled={!editModeForLookup}
                  onClick={
                    editModeForLookup &&
                    props.toggleExpanded(!expanded(props.form), props.form.events.value)
                  }
                >
                  {expanded(props.form)
                    ? I18n.t('musit.conservation.doCollapse')
                    : I18n.t('musit.conservation.doExpand')}
                </button>
              </div>
            </div>
            <div>
              <h2>{I18n.t('musit.conservation.subEvents')}</h2>
            </div>
            <div className="row">
              <div className="col-md-12">
                {(props.form.events as TODO).rawValue.map((v: TODO, i: number) => {
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
        options={sortedConservationTypes.map(
          o => (o.label === toLower(o.label) ? { ...o, label: capitalize(o.label) } : o)
        )}
        onChange={props.updateMultiSelectField(props.form.subEventTypes.name)}
        singleSelect={true}
        viewMode={
          !editModeForLookup ||
          addMode ||
          !props.appSession.rolesForModules.collectionManagementWrite
        }
        style={borderStyle(true)}
      />
      <SingleObjectSelection
        affectedThingsWithDetailsMainEvent={props.objects}
        affectedThingSubEventOnChange={props.updateSingleObjectField(
          'singleObjectSelected'
        )}
        visible={
          props.form.subEventTypes &&
          ['8', '9'].includes((props.form.subEventTypes as TODO).rawValue)
        }
      />
      <button
        key="btn-createSubEvents"
        className="btn btn-default"
        onClick={createSubEvents(props)}
        disabled={
          !props.form.subEventTypes.value ||
          props.form.subEventTypes.value.split(',').length > 1 ||
          (['8', '9'].includes((props.form.subEventTypes as TODO).rawValue) &&
            !props.form.singleObjectSelected.value)
        }
      >
        {I18n.t('musit.conservation.createNewSubEvents')}
      </button>
      <hr />
      <div style={{ float: 'right' }}>
        <button
          className="btn-link"
          style={{ marginRight: 5 }}
          onClick={props.onClickBack}
        >
          {I18n.t('musit.texts.back')}
        </button>
      </div>
      <br />
      <div style={{ paddingBottom: '100px' }} />
    </div>
  );
}
