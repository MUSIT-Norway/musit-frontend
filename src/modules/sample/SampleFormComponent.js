// @flow
import React from 'react';
import { I18n } from 'react-i18nify';
import type { AppSession } from '../../types/appSession';
import type { History } from '../../types/Routes';
import type { DomEvent } from '../../types/dom';
import type { Predefined } from '../../types/predefined';
import type { ObjectData } from '../../types/object';
import type { SampleDataExtended } from '../../types/samples';
import type { FormDetails } from './types/form';
import type { ObjectOrSample } from './types';
import type { ValueExtractor } from '../../forms/components/FieldDropDown';
import ValidatedFormGroup from '../../forms/components/ValidatedFormGroup';
import FieldCheckBox from '../../forms/components/FieldCheckBox';
import FieldDropDown from '../../forms/components/FieldDropDown';
import FieldInput from '../../forms/components/FieldInput';
import FieldTextArea from '../../forms/components/FieldTextArea';
import { FieldComboDropDownStr } from '../../forms/components/FieldComboDropDown';
import MetaInformation from '../../components/metainfo';
import ReadOnlySampleType from './components/ReadOnlySampleType';
import ObjectAndSampleDetails from './components/ObjectAndSampleDetails';
import PersonRoleDate from '../../components/person/PersonRoleDate';
import Sample from '../../models/sample';
import Config from '../../config';

export type SampleResponses = {
  success: Array<{
    response: string,
    objectData: ObjectData & { sampleNum?: string, objectId?: string }
  }>,
  failure: Array<{
    error: Error,
    objectData: ObjectData & { sampleNum?: string, objectId?: string }
  }>
};

export type Props = {
  form: FormDetails,
  updateForm: Function,
  clickSave: () => void,
  appSession: AppSession,
  clickBack: (e: DomEvent) => void,
  updateSampleType: Function,
  sampleTypeDisplayName: ValueExtractor,
  isFormValid: (f: FormDetails) => boolean,
  predefined: Predefined,
  history: History,
  objectData: Array<ObjectOrSample & { derivedFrom: ?SampleDataExtended }>,
  showSampleSubType: boolean,
  canEditSampleType: boolean,
  store: { sampleResponses?: ?SampleResponses },
  putSamplesInPicklist: () => void,
  clearForm: () => void,
  clearSampleResponses: () => void
};

export default function SampleFormComponent(props: Props) {
  const form = props.form;
  const predefined = props.predefined;
  const objectData = props.objectData;
  if (objectData.length === 0) {
    return (
      <div className="container">
        <h1>{I18n.t('musit.sample.noObjects')}</h1>
      </div>
    );
  }
  const sampleResponses = props.store.sampleResponses;
  if (sampleResponses) {
    return (
      <DisplayCreatedSamples
        sampleResponses={sampleResponses}
        putSamplesInPicklist={props.putSamplesInPicklist}
        appSession={props.appSession}
      />
    );
  }
  return (
    <div className="container">
      <form className="form-horizontal">
        <div className="page-header">
          <h1>{I18n.t('musit.sample.registerSample')}</h1>
        </div>
        {!!(form.registeredByName && form.registeredByName.value) && (
          <div>
            <MetaInformation
              updatedBy={form.updatedByName.value}
              updatedDate={form.updatedDate.value}
              registeredBy={form.registeredByName.value}
              registeredDate={form.registeredDate.value}
            />
            <hr />
          </div>
        )}
        <h4>
          {objectData &&
          objectData.length === 1 &&
          objectData[0].derivedFrom &&
          objectData[0].derivedFrom.sampleNum ? (
            I18n.t('musit.sample.derivedFromObjectAndSample')
          ) : (
            I18n.t('musit.sample.derivedFromObject')
          )}
        </h4>
        {objectData.map((od, i) => (
          <ObjectAndSampleDetails
            key={i}
            appSession={props.appSession}
            history={props.history}
            objectData={od}
          />
        ))}
        <hr />
        <h4>{I18n.t('musit.sample.personsAssociatedWithSampleTaking')}</h4>
        <PersonRoleDate
          appSession={props.appSession}
          personData={form.persons.rawValue || []}
          updateForm={props.updateForm}
          fieldName={form.persons.name}
          roles={['responsible', 'creator']}
          showDateForRole={(roleName: string) => roleName !== 'responsible'}
          getDisplayNameForRole={(roleName: string) =>
            I18n.t(`musit.sample.roles.${roleName}`)}
        />
        <br />
        <div className="well">
          {!!form.sampleNum && (
            <ValidatedFormGroup fields={[form.sampleNum]}>
              <FieldInput
                field={form.sampleNum}
                title={I18n.t('musit.sample.sampleNumber')}
                onChange={props.updateForm}
                readOnly={true}
              />
            </ValidatedFormGroup>
          )}
          <ValidatedFormGroup fields={[form.sampleId]}>
            <FieldInput
              field={form.sampleId}
              title={I18n.t('musit.sample.sampleId')}
              onChange={props.updateForm}
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.externalId, form.externalIdSource]}>
            <FieldInput
              field={form.externalId}
              title={I18n.t('musit.sample.externalId')}
              onChange={props.updateForm}
            />
            <FieldInput
              field={form.externalIdSource}
              title={I18n.t('musit.sample.externalIdSource')}
              onChange={props.updateForm}
            />
          </ValidatedFormGroup>
          {props.canEditSampleType ? (
            <ValidatedFormGroup fields={[form.sampleType, form.sampleSubType]}>
              <FieldDropDown
                field={form.sampleType}
                title={I18n.t('musit.sample.sampleType')}
                defaultOption={I18n.t('musit.sample.chooseType')}
                onChange={props.updateSampleType}
                selectItems={
                  predefined.sampleTypes ? Object.keys(predefined.sampleTypes) : []
                }
              />
              {props.showSampleSubType && (
                <FieldDropDown
                  field={form.sampleSubType}
                  title={I18n.t('musit.sample.sampleSubType')}
                  defaultOption={I18n.t('musit.sample.chooseSubType')}
                  valueFn={props.sampleTypeDisplayName}
                  displayFn={props.sampleTypeDisplayName}
                  appSession={props.appSession}
                  onChange={props.updateForm}
                  selectItems={
                    predefined.sampleTypes ? (
                      predefined.sampleTypes[form.sampleType.rawValue]
                    ) : (
                      []
                    )
                  }
                />
              )}
            </ValidatedFormGroup>
          ) : (
            <ReadOnlySampleType
              sampleType={form.sampleType.value}
              subTypeValue={form.sampleSubType.value}
            />
          )}
          <ValidatedFormGroup fields={[form.description]}>
            <FieldTextArea
              field={form.description}
              title={I18n.t('musit.sample.description')}
              onChangeInput={props.updateForm}
              inputProps={{ rows: 5 }}
              controlWidth={8}
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.status]}>
            <FieldDropDown
              field={form.status}
              title={I18n.t('musit.sample.status')}
              defaultOption={I18n.t('musit.sample.chooseStatus')}
              valueFn={v => (v.id ? v.id.toString() : '')}
              displayFn={v => (props.appSession.language.isEn ? v.enStatus : v.noStatus)}
              onChange={props.updateForm}
              selectItems={Sample.sampleStatuses}
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.size, form.sizeUnit]}>
            <FieldInput
              field={form.size}
              title={I18n.t('musit.sample.volumeOrWeight')}
              onChange={props.updateForm}
              inputProps={{ className: 'size' }}
            />
            <FieldDropDown
              field={form.sizeUnit}
              title=""
              defaultOption={I18n.t('musit.sample.chooseUnit')}
              onChange={props.updateForm}
              selectItems={Sample.sampleSizeUnits}
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.container]}>
            <FieldComboDropDownStr
              field={form.container}
              title={I18n.t('musit.sample.storageContainer')}
              defaultOption={I18n.t('musit.sample.chooseStorageContainer')}
              onChange={props.updateForm}
              selectItems={
                predefined.storageContainers ? (
                  predefined.storageContainers.map(
                    c =>
                      props.appSession.language.isEn
                        ? c.enStorageContainer
                        : c.noStorageContainer
                  )
                ) : (
                  []
                )
              }
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.storageMedium]}>
            <FieldComboDropDownStr
              field={form.storageMedium}
              title={I18n.t('musit.sample.storageMedium')}
              defaultOption={I18n.t('musit.sample.chooseStorageMedium')}
              onChange={props.updateForm}
              selectItems={
                predefined.storageMediums ? (
                  predefined.storageMediums.map(
                    m =>
                      props.appSession.language.isEn
                        ? m.enStorageMedium
                        : m.noStorageMedium
                  )
                ) : (
                  []
                )
              }
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.treatment]}>
            <FieldComboDropDownStr
              field={form.treatment}
              title={I18n.t('musit.sample.treatment')}
              defaultOption={I18n.t('musit.sample.chooseTreatment')}
              onChange={props.updateForm}
              selectItems={
                predefined.treatments ? (
                  predefined.treatments.map(
                    t => (props.appSession.language.isEn ? t.enTreatment : t.noTreatment)
                  )
                ) : (
                  []
                )
              }
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.leftoverSample]}>
            <FieldCheckBox
              field={form.leftoverSample}
              title={I18n.t('musit.sample.hasResidualMaterial')}
              yesValue={3}
              noValue={2}
              onChange={props.updateForm}
              defaultValue="1"
            />
          </ValidatedFormGroup>
          <ValidatedFormGroup fields={[form.note]}>
            <FieldTextArea
              field={form.note}
              title={I18n.t('musit.sample.comments')}
              onChangeInput={props.updateForm}
              inputProps={{ rows: 5, className: 'note' }}
              controlWidth={8}
            />
          </ValidatedFormGroup>
        </div>
        <button
          className="btn btn-primary"
          disabled={!props.isFormValid}
          onClick={props.clickSave}
        >
          {I18n.t('musit.texts.save')}
        </button>
        <button
          className="btn btn-link"
          style={{ marginLeft: 20 }}
          onClick={props.clickBack}
        >
          {I18n.t('musit.texts.cancel')}
        </button>
      </form>
    </div>
  );
}

function Link(props) {
  return (
    <button
      className="btn btn-link"
      onClick={e => {
        e.preventDefault();
        props.onClick();
      }}
    >
      {props.text}
    </button>
  );
}

export function DisplayCreatedSamples(props: {
  sampleResponses: SampleResponses,
  appSession: AppSession,
  putSamplesInPicklist: () => void
}) {
  return (
    <div className="container">
      <div className="page-header">
        <h1>
          {I18n.t('musit.sample.createdSamples', {
            count: props.sampleResponses.success.length
          })}
        </h1>
      </div>
      <Link
        text={I18n.t('musit.sample.addToPickList')}
        onClick={props.putSamplesInPicklist}
      />
      {props.sampleResponses.failure.length > 0 && (
        <div>
          <h3>{I18n.t('musit.sample.theseFailed')}</h3>
          <table className="table">
            <tr>
              <th>{I18n.t('musit.objects.objectsView.object')}</th>
              <th>{I18n.t('musit.texts.error')}</th>
            </tr>
            {props.sampleResponses.failure.map(f => {
              return (
                <tr>
                  <td>
                    {f.objectData.sampleNum ? (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={Config.magasin.urls.client.analysis.gotoSample(
                          props.appSession,
                          f.objectData.objectId || ''
                        )}
                      >
                        {I18n.t('musit.sample.sample')} {f.objectData.objectId}
                      </a>
                    ) : (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={Config.magasin.urls.client.object.gotoObject(
                          props.appSession,
                          f.objectData.uuid
                        )}
                      >
                        {I18n.t('musit.objects.objectsView.object')} {f.objectData.uuid}
                      </a>
                    )}
                  </td>
                  <td>{f.error.message}</td>
                </tr>
              );
            })}
          </table>
        </div>
      )}
    </div>
  );
}
