//@flow
import React from 'react';
import { I18n } from 'react-i18nify';
import MetaInformation from '../../components/metainfo';
import type { FormData } from './shared/formType';
import ObjectTable from './components/expandableObjects';
import { FormInput, FormTextArea } from '../../forms/components';
import type { History } from '../../types/Routes';
import type { AppSession } from '../../types/appSession';

type ConservationProcessProps = {
  id?: number,
  caseNumber?: string,
  objects?: Array<any>,
  updateForm?: Function,
  updateArrayField: Function,
  updateStringField: Function,
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
  isFormValid?: boolean
};

export type Props = ConservationProcessProps & {
  affectedThings?: Array<string>,
  appSession: AppSession
};

type ProcessFormProps = {
  form: FormData,
  updateStringField: Function
};

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

export default function ConservationAddComponent(props: Props) {
  return (
    <div className="container">
      <div className="page-header">
        <h1>{I18n.t('musit.conservation.conservation')}</h1>
      </div>
      <form className="form-horizontal">
        <MetaInformation
          registeredBy={props.form.doneBy.value}
          registeredDate={props.form.doneDate.value}
          updatedBy={props.form.updatedBy.value}
          updatedDate={props.form.updatedDate.value}
        />
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
