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
  doneBy?: string,
  doneDate?: string,
  note?: string,
  form: FormData,
  loadingConservation?: boolean,
  history: History,
  clickSave?: Function,
  clickSaveAndContinue?: ?Function,
  clickCancel?: Function,
  clearForm?: Function,
  clearStore?: Function,
  isFormValid?: boolean,
  store: *,
  predefinedConservation: PredefinedConservation,
  onDocumentUpload?: Function,
  location: Location<Array<ObjectData>>
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
  actorsAndRoles: [],
  documents: [],
  expanded: true
});
function createSubEvents(
  props: Props & { form: FormData, predefinedConservation: PredefinedConservation }
) {
  return () => {
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
              ...commonAttributes(v)
            }
          ]);
        }
        case 3: {
          return acc.concat([
            {
              ...commonAttributes(v)
            }
          ]);
        }
        case 4: {
          return acc.concat([
            {
              lightAndUvLevel: '',
              relativeHumidity: '',
              temperature: '',
              ...commonAttributes(v)
            }
          ]);
        }
        case 5: {
          return acc.concat([
            {
              ...commonAttributes(v)
            }
          ]);
        }
        case 6: {
          return acc.concat([
            {
              consitionCode: '',
              ...commonAttributes(v)
            }
          ]);
        }
        case 7: {
          return acc.concat([
            {
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

const suffix = ':';

function deleteSubEvents(props: Props & { form: FormData }, i: number) {
  props.updateForm({
    name: props.form.events.name,
    rawValue: [
      ...props.form.events.rawValue.slice(0, i),
      ...props.form.events.rawValue.slice(i + 1)
    ]
  });
}

function renderSubEvent(
  appSession: AppSession,
  ind: number,
  eventType: number,
  props: Props & { form: FormData }
) {
  if (eventType === 2) {
    return (
      <Treatment
        key={`treatment_${ind}`}
        keywords={props.predefinedConservation.keywordList}
        materials={props.predefinedConservation.materialList}
        roleList={props.predefinedConservation.roleList}
        appSession={appSession}
        treatment={props.form.events.rawValue[ind]}
        index={ind}
        onChange={props.updateConservationSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onChangePersonActorRole={props.updatePersonsForSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        viewMode={false}
        affectedThingsWithDetailsMainEvent={props.objects || []}
        onDelete={() => deleteSubEvents(props, ind)}
        expanded={props.form.events.value[ind].expanded}
        toggleExpanded={props.toggleSingleExpanded(
          !props.form.events.value[ind].expanded,
          props.form.events.value,
          ind
        )}
        onDocumentUpload={props.onDocumentUpload}
      />
    );
  } else if (eventType === 3) {
    return (
      <TechnicalDescription
        key={`techincalDescription_${ind}`}
        viewMode={false}
        appSession={appSession}
        roleList={props.predefinedConservation.roleList}
        affectedThingsWithDetailsMainEvent={props.objects || []}
        technicalDescription={props.form.events.rawValue[ind]}
        index={ind}
        onChange={props.updateConservationSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onChangePersonActorRole={props.updatePersonsForSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onDelete={() => deleteSubEvents(props, ind)}
        expanded={props.form.events.value[ind].expanded}
        toggleExpanded={props.toggleSingleExpanded(
          !props.form.events.value[ind].expanded,
          props.form.events.value,
          ind
        )}
        onDocumentUpload={props.onDocumentUpload}
      />
    );
  } else if (eventType === 4) {
    return (
      <StorageAndHandling
        key={`storageAndHandling_${ind}`}
        viewMode={false}
        appSession={appSession}
        roleList={props.predefinedConservation.roleList}
        affectedThingsWithDetailsMainEvent={props.objects || []}
        storageAndHandling={props.form.events.rawValue[ind]}
        index={ind}
        onChangePersonActorRole={props.updatePersonsForSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onChange={props.updateConservationSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onDelete={() => deleteSubEvents(props, ind)}
        expanded={props.form.events.value[ind].expanded}
        toggleExpanded={props.toggleSingleExpanded(
          !props.form.events.value[ind].expanded,
          props.form.events.value,
          ind
        )}
        onDocumentUpload={props.onDocumentUpload}
      />
    );
  } else if (eventType === 5) {
    return (
      <HseRisk
        key={`hseRisk_${ind}`}
        viewMode={false}
        appSession={appSession}
        roleList={props.predefinedConservation.roleList}
        affectedThingsWithDetailsMainEvent={props.objects || []}
        hseRisk={props.form.events.rawValue[ind]}
        index={ind}
        onChangePersonActorRole={props.updatePersonsForSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onChange={props.updateConservationSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onDelete={() => deleteSubEvents(props, ind)}
        expanded={props.form.events.value[ind].expanded}
        toggleExpanded={props.toggleSingleExpanded(
          !props.form.events.value[ind].expanded,
          props.form.events.value,
          ind
        )}
        onDocumentUpload={props.onDocumentUpload}
      />
    );
  } else if (eventType === 6) {
    return (
      <ConditionAssessment
        key={`conditionAssessment_${ind}`}
        viewMode={false}
        appSession={appSession}
        roleList={props.predefinedConservation.roleList}
        affectedThingsWithDetailsMainEvent={props.objects || []}
        conditionAssessment={props.form.events.rawValue[ind]}
        conditionCodes={props.predefinedConservation.conditionCodeList}
        index={ind}
        onChangePersonActorRole={props.updatePersonsForSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onChange={props.updateConservationSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onDelete={() => deleteSubEvents(props, ind)}
        expanded={props.form.events.value[ind].expanded}
        toggleExpanded={props.toggleSingleExpanded(
          !props.form.events.value[ind].expanded,
          props.form.events.value,
          ind
        )}
        onDocumentUpload={props.onDocumentUpload}
      />
    );
  } else if (eventType === 7) {
    return (
      <Report
        key={`report_${ind}`}
        viewMode={false}
        appSession={appSession}
        roleList={props.predefinedConservation.roleList}
        affectedThingsWithDetailsMainEvent={props.objects || []}
        report={props.form.events.rawValue[ind]}
        index={ind}
        onChangePersonActorRole={props.updatePersonsForSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onChange={props.updateConservationSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        onDelete={() => deleteSubEvents(props, ind)}
        expanded={props.form.events.value[ind].expanded}
        toggleExpanded={props.toggleSingleExpanded(
          !props.form.events.value[ind].expanded,
          props.form.events.value,
          ind
        )}
        onDocumentUpload={props.onDocumentUpload}
      />
    );
  } else {
    return <div key={`U_${ind}`}> {`Unknown event type: ${eventType}`}</div>;
  }
}

function ConservationProcessForm(props: ProcessFormProps) {
  return (
    <div className="container">
      <form className="form-horizontal">
        <FormInput
          field={props.form.caseNumber}
          label={I18n.t('musit.conservation.caseNumber') + suffix}
          labelWidth={1}
          labelAbove={true}
          elementWidth={5}
          value={props.form.caseNumber.value}
          onChange={props.updateStringField(props.form.caseNumber.name)}
          id={props.form.caseNumber.name}
        />
        <FormTextArea
          field={props.form.note}
          label={I18n.t('musit.conservation.note') + suffix}
          labelWidth={1}
          labelAbove={true}
          elementWidth={5}
          rows={5}
          value={props.form.note.value}
          onChange={props.updateStringField(props.form.note.name)}
          id={props.form.note.name}
        />
      </form>
    </div>
  );
}
export default function ConservationComponent(
  props: Props & { form: FormData, predefinedConservation: PredefinedConservation }
) {
  return (
    <div className="container">
      <div className="page-header">
        <h1>{I18n.t('musit.conservation.conservation')}</h1>
      </div>
      <form className="form-horizontal">
        {props.form.id.value && (
          <MetaInformation
            registeredBy={props.form.registeredByName.value}
            registeredDate={props.form.registeredDate.value}
            updatedBy={props.form.updatedByName.value}
            updatedDate={props.form.updatedDate.value}
          />
        )}
      </form>
      <hr />
      <ConservationProcessForm
        form={props.form}
        updateStringField={props.updateStringField}
      />
      <hr />
      <div className="form-group">
        <div className="col-md-12 col-md-offset-0">
          <label className="control-label">
            {I18n.t('musit.conservation.personsConnected')}
          </label>
        </div>
      </div>
      <form className="form-horizontal">
        <PersonRoleDate
          appSession={props.appSession}
          personData={props.form.actorsAndRoles.value || []}
          updateForm={props.updateForm}
          fieldName={props.form.actorsAndRoles.name}
          getDisplayNameForRole={(r: string) => {
            const role = find(
              props.predefinedConservation.roleList,
              rl => rl.roleId === r
            );
            return role.noRole;
          }}
          roles={
            props.predefinedConservation.roleList &&
            props.predefinedConservation.roleList.map(e => e.roleId)
          }
          showDateForRole={(roleName: string) => [1].some(e => e === roleName)}
        />
      </form>
      <br />
      <ObjectTable
        data={props.objects || []}
        viewMode={true}
        history={props.history}
        appSession={props.appSession}
      />
      <hr />
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
        appSession={props.appSession}
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
      />
      <button
        key="btn-createSubEvents"
        className="btn btn-default"
        onClick={createSubEvents(props)}
        disabled={!props.form.subEventTypes.value}
      >
        {I18n.t('musit.conservation.createNewSubEvents')}
      </button>
      <hr />
      <br />
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
        <button
          key="btn-saveConservationProcess"
          className="btn btn-primary"
          disabled={!props.isFormValid}
          onClick={props.clickSave}
        >
          {I18n.t('musit.texts.save')}
        </button>{' '}
        <button className="btn btn-default" onClick={props.clickCancel}>
          {I18n.t('musit.texts.cancel')}
        </button>
      </div>
      <div style={{ paddingBottom: '100px' }} />
    </div>
  );
}
