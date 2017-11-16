//@flow
import React from 'react';
import { I18n } from 'react-i18nify';
import MetaInformation from '../../components/metainfo';
import type { FormData } from './shared/formType';
import ObjectTable from './components/expandableObjects';
import { FormInput, FormTextArea } from '../../forms/components';
import type { History } from '../../types/Routes';
import type { AppSession } from '../../types/appSession';
import FieldMultiSelect from '../../forms/components/FieldMultiSelect';
import type { FieldMultiSelectProps } from '../../forms/components/FieldMultiSelect';
import type { PredefinedConservation } from '../../types/predefinedConservation';
import type { ConservationSubTypes } from '../../types/conservation';
import Treatment from './events/treatment';

type ConservationProcessProps = {
  id?: number,
  caseNumber?: string,
  objects?: Array<any>,
  updateForm: Function,
  updateArrayField: Function,
  updateStringField: Function,
  updateMultiSelectField: Function,
  updateConservationSubEvent: Function,
  doneBy?: string,
  doneDate?: string,
  note?: string,
  form: FormData,
  loadingConservation?: boolean,
  history: History,
  clickSave?: Function,
  clickCancel?: Function,
  clearForm?: Function,
  clearStore?: Function,
  isFormValid?: boolean,
  store: *,
  predefinedConservation: PredefinedConservation
};

export type Props = ConservationProcessProps & {
  appSession: AppSession
};

type ProcessFormProps = {
  form: FormData,
  updateStringField: Function
};

function createSubEvents(props: Props & { form: FormData }) {
  return () => {
    const eventTypes =
      props.form.subEventTypes && props.form.subEventTypes.rawValue
        ? props.form.subEventTypes.rawValue.split(',').map(t => Number.parseFloat(t))
        : [];
    eventTypes.map(v => {
      switch (v) {
        case 2: {
          props.updateForm({
            name: props.form.events.name,
            rawValue: props.form.events.rawValue.concat([
              {
                caseNumber: '',
                eventTypeId: v,
                keywords: [],
                materials: [],
                note: '',
                affectedThings: []
              }
            ])
          });
          break;
        }
        case 3: {
          props.updateForm({
            name: props.form.events.name,
            rawValue: props.form.events.rawValue.concat([
              {
                eventTypeId: v,
                caseNumber: '',
                note: '',
                affectedThings: []
              }
            ])
          });
          break;
        }
      }
    });
  };
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
        appSession={appSession}
        treatment={props.form.events.rawValue[ind]}
        onChange={props.updateConservationSubEvent(
          props.form.events.name,
          props.form.events.rawValue,
          ind
        )}
        viewMode={false}
        affectedThingsWithDetailsMainEvent={props.objects || []}
        name={`treatment_${ind}`}
      />
    );
  } else if (eventType === 3) {
    return <div key={`td_${ind}`}> Technical description</div>;
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
          label={I18n.t('musit.conservation.caseNumber')}
          labelWidth={1}
          elementWidth={5}
          value={props.form.caseNumber.value}
          onChange={props.updateStringField(props.form.caseNumber.name)}
          id={props.form.caseNumber.name}
        />
        <FormTextArea
          field={props.form.note}
          label={I18n.t('musit.conservation.note')}
          labelWidth={1}
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

export default function ConservationComponent(props: Props & { form: FormData }) {
  return (
    <div className="container">
      <div className="page-header">
        <h1>{I18n.t('musit.conservation.conservation')}</h1>
      </div>
      <form className="form-horizontal">
        {props.form.id.value && (
          <MetaInformation
            registeredBy={props.form.registeredBy.value}
            registeredDate={props.form.registeredDate.value}
            updatedBy={props.form.updatedBy.value}
            updatedDate={props.form.updatedDate.value}
          />
        )}
      </form>
      <hr />
      <ConservationProcessForm
        caseNumber={props.caseNumber}
        conservationNote={props.note}
        doneBy={props.doneBy}
        doneDate={props.doneDate}
        form={props.form}
        history={props.history}
        updateArrayField={props.updateArrayField}
        updateStringField={props.updateStringField}
      />
      <br />
      <ObjectTable
        data={props.objects || []}
        viewMode={true}
        history={props.history}
        appSession={props.appSession}
      />
      <hr />
      <FieldMultiSelect
        title={I18n.t('musit.conservation.choseNewSubEvents')}
        appSession={props.appSession}
        stringValue={props.form.subEventTypes.rawValue}
        options={
          props.predefinedConservation &&
          props.predefinedConservation.conservationTypes &&
          props.predefinedConservation.conservationTypes
            .slice(1) //Taking away the supertype assumed to be the first element
            .map(v => ({
              value: v.id.toString(),
              label: props.appSession.language.isEn ? v.enName : v.noName
            }))
        }
        onChange={props.updateMultiSelectField(props.form.subEventTypes.name)}
      />
      <button
        className="btn btn"
        disabled={!props.isFormValid}
        onClick={createSubEvents(props)}
      >
        {I18n.t('musit.conservation.choseNewSubEvents')}
      </button>
      <hr />
      {props.form.events &&
        props.form.events.rawValue.map((v, i) => {
          if (v.eventTypeId === 2) {
            return (
              <Treatment
                key={`treatment_${i}`}
                keywords={props.predefinedConservation.keywordList}
                materials={props.predefinedConservation.materialList}
                appSession={props.appSession}
                treatment={props.form.events.rawValue[i]}
                onChange={props.updateConservationSubEvent(
                  props.form.events.name,
                  props.form.events.rawValue,
                  i
                )}
                affectedThingsWithDetailsMainEvent={props.objects || []}
                name={`treatment_${i}`}
              />
            );
          } else if (v.eventTypeId === 3) {
            return <div key={`TD_${i}`}> TD </div>;
          } else {
            return <div key={`UK_${i}`}> Ukjent </div>;
          }
        })}
      <button
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
  );
}
