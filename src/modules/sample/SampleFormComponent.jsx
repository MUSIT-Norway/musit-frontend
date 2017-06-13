// @flow
import React  from 'react';
import Config from '../../config';
import PersonRoleDate from '../../components/person/PersonRoleDate';
import Sample from '../../models/sample';
import type { ObjectData } from '../../types/object';
import type { AppSession } from '../../types/appSession';
import type { Person } from '../../components/person/PersonRoleDate';
import type { FormDetails } from './types/form';
import type { History} from 'types/Routes'
import ValidatedFormGroup from '../../forms/components/ValidatedFormGroup';
import FieldCheckBox from '../../forms/components/FieldCheckBox';
import FieldDropDown from '../../forms/components/FieldDropDown';
import FieldInput from '../../forms/components/FieldInput';
import FieldTextArea from '../../forms/components/FieldTextArea';
import flatten from 'lodash/flatten';
import MetaInformation from '../../components/metainfo';
import moment from 'moment';
import ReadOnlySampleType from './components/ReadOnlySampleType';
import { I18n } from 'react-i18nify';

type Params = {
  objectId: string,
  sampleId?: string
}

type Match = {
  params: Params
}
type Store = {
  sampleTypes?: any,
  storageContainers?: any,
  storageMediums?: any,
  treatments?: any
}

type Props = {
  form: FormDetails,
  store: Store,
  persons: Array<Person>,
  updateForm: Function,
  addSample: Function,
  addPersonToSample: Function,
  updatePersonForSample: Function,
  location: { pathname: string, state: Array<ObjectData> },
  appSession: AppSession,
  match: Match,
  history: History
};

function isFormValid(form) {
  return Object.keys(form).reduce((acc, k) => {
    const field = form[k];
    return acc && field.status.valid;
  }, true);
}

export default function SampleFormComponent({form, store, updateForm, addSample, location: { state }, appSession, match: {params}, history }: Props) {
  const objectData = state[0];
  const canEditSampleType = !form.sampleNum;
  return (
    <div className="container">
    <form className="form-horizontal">
      <div className="page-header">
        <h1>
          {I18n.t('musit.sample.registerSample')}
        </h1>
      </div>
      {form.registeredByName && form.registeredByName.value &&
      <div>
        <MetaInformation
          updatedBy={form.updatedByName.value}
          updatedDate={form.updatedDate.value}
          registeredBy={form.registeredByName.value}
          registeredDate={form.registeredDate.value}
        />
        <hr />
      </div>}
      <h4>
        {I18n.t('musit.sample.derivedFromObject')}
      </h4>
      <div>
        <span style={{ marginRight: 20 }}>
          <strong>{I18n.t('musit.analysis.museumNumber')}</strong> {objectData.museumNo}
        </span>
        <span style={{ marginRight: 20 }}>
          <strong>{I18n.t('musit.analysis.underNumber')}</strong> {objectData.subNo}
        </span>
        <span>
          <strong>{I18n.t('musit.analysis.term')}</strong> {objectData.term}
        </span>
      </div>
      <hr/>
      <h4>{I18n.t('musit.sample.personsAssociatedWithSampleTaking')}</h4>
      <PersonRoleDate
        appSession={appSession}
        personData={form.persons.rawValue}
        updateForm={updateForm}
        fieldName={form.persons.name}
        roles={['responsible', 'creator']}
        showDateForRole= {(roleName: string) => roleName !== 'responsible'}
      />
      <br/>
      <div className="well">
        {form.sampleNum &&
        <ValidatedFormGroup fields={[form.sampleNum]}>
          <FieldInput
            field={form.sampleNum}
            title={I18n.t('musit.sample.sampleNumber')}
            onChange={updateForm}
            readOnly={true}
          />
        </ValidatedFormGroup>}
        <ValidatedFormGroup fields={[form.sampleId]}>
          <FieldInput
            field={form.sampleId}
            title={I18n.t('musit.sample.sampleId')}
            onChange={updateForm}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.externalId, form.externalIdSource]}>
          <FieldInput
            field={form.externalId}
            title={I18n.t('musit.sample.externalId')}
            onChange={updateForm}
          />
          <FieldInput
            field={form.externalIdSource}
            title={I18n.t('musit.sample.externalIdSource')}
            onChange={updateForm}
          />
        </ValidatedFormGroup>
        {canEditSampleType ?
          <ValidatedFormGroup fields={[form.sampleType, form.sampleSubType]}>
            <FieldDropDown
              field={form.sampleType}
              title={I18n.t('musit.sample.sampleType')}
              defaultOption={I18n.t('musit.sample.chooseType')}
              onChange={(obj) => {
                if (store.sampleTypes && store.sampleTypes[obj.rawValue] && store.sampleTypes[obj.rawValue].length === 1) {
                  updateForm({
                    name: form.sampleSubType.name,
                    rawValue: sampleTypeDisplayName(store.sampleTypes[obj.rawValue][0])
                  });
                } else {
                  updateForm({name: form.sampleSubType.name, rawValue: ''});
                }
                updateForm(obj);
              }}
              selectItems={store.sampleTypes ? Object.keys(store.sampleTypes) : []}
            />
            {form.sampleType.rawValue && form.sampleType.rawValue.trim().length > 0 && store.sampleTypes && store.sampleTypes[form.sampleType.rawValue].length > 1 &&
            <FieldDropDown
              field={form.sampleSubType}
              title={I18n.t('musit.sample.sampleSubType')}
              defaultOption={I18n.t('musit.sample.chooseSubType')}
              valueFn={sampleTypeDisplayName}
              displayFn={sampleTypeDisplayName}
              onChange={updateForm}
              selectItems={store.sampleTypes ? store.sampleTypes[form.sampleType.rawValue] : []}
            />
            }
          </ValidatedFormGroup>
          :
          <ReadOnlySampleType sampleType={form.sampleType} subTypeValue={form.sampleSubType} />
        }
        <ValidatedFormGroup fields={[form.description]}>
          <FieldTextArea
            field={form.description}
            title={I18n.t('musit.sample.description')}
            onChangeInput={updateForm}
            inputProps={{rows: 5}}
            controlWidth={8}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.status]}>
          <FieldDropDown
            field={form.status}
            title={I18n.t('musit.sample.status')}
            defaultOption={I18n.t('musit.sample.chooseStatus')}
            valueFn={(v) => v.id}
            displayFn={(v) => v.noStatus}
            onChange={updateForm}
            selectItems={Sample.sampleStatuses}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.size, form.sizeUnit]}>
          <FieldInput
            field={form.size}
            title={I18n.t('musit.sample.volumeOrWeight')}
            onChange={updateForm}
            inputProps={{className: 'size'}}
          />
          <FieldDropDown
            field={form.sizeUnit}
            title=""
            defaultOption={I18n.t('musit.sample.chooseUnit')}
            onChange={updateForm}
            selectItems={Sample.sampleSizeUnits}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.container]}>
          <FieldDropDown
            field={form.container}
            title={I18n.t('musit.sample.storageContainer')}
            defaultOption={I18n.t('musit.sample.chooseStorageContainer')}
            onChange={updateForm}
            selectItems={store.storageContainers ? store.storageContainers.map(c => c.noStorageContainer) : []}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.storageMedium]}>
          <FieldDropDown
            field={form.storageMedium}
            title={I18n.t('musit.sample.storageMedium')}
            defaultOption={I18n.t('musit.sample.chooseStorageMedium')}
            onChange={updateForm}
            selectItems={store.storageMediums ? store.storageMediums.map(m => m.noStorageMedium) : []}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.treatment]}>
          <FieldDropDown
            field={form.treatment}
            title={I18n.t('musit.sample.treatment')}
            defaultOption={I18n.t('musit.sample.chooseTreatment')}
            onChange={updateForm}
            selectItems={store.treatments ? store.treatments.map(t => t.noTreatment) : []}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.leftoverSample]}>
          <FieldCheckBox
            field={form.leftoverSample}
            title={I18n.t('musit.sample.hasResidualMaterial')}
            yesValue={3}
            noValue={2}
            onChange={updateForm}
            defaultValue="1"
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.note]}>
          <FieldTextArea
            field={form.note}
            title={I18n.t('musit.sample.comments')}
            onChangeInput={updateForm}
            inputProps={{rows: 5, className: 'note'}}
            controlWidth={8}
          />
        </ValidatedFormGroup>
      </div>
      <button
        className="btn btn-primary"
        disabled={!isFormValid(form)}
        onClick={(e) => {
          e.preventDefault();
          submitSample(appSession, store, form, objectData, params, addSample)
            .then((value) =>
              history.push({
                pathname: Config.magasin.urls.client.analysis.gotoSample(appSession, value.objectId || value),
                state: [objectData]
              })
            );
        }}
      >
        {I18n.t('musit.texts.save')}
      </button>
      <a
        href="/"
        style={{ marginLeft: 20 }}
        onClick={(e) => {
          e.preventDefault();
          history.goBack();
        }}
      >
        {I18n.t('musit.texts.cancel')}
      </a>
    </form>
  </div>
  );
}

function submitSample(appSession: AppSession, store: Store, form: FormDetails, objectData: ObjectData, params: Params, addSample: Function) {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const myReduce = (frm: FormDetails) => Object.keys(frm).reduce((akk: any, key: string) =>
    ({...akk, [key]: frm[key].value || frm[key].defaultValue}), {});
  const reducePersons = (p: any) => p && p.reduce((akk: any, v: Person) => {
    switch (v.role) {
      case 'creator':
        return {
          ...akk,
          doneByStamp: {
            user: v.uuid,
            date: moment(v.date).format('YYYY-MM-DD')
          }
        };
      case 'responsible':
        return {
          ...akk,
          responsible: v.uuid
        };
      default:
        return {};
    }
  }, {});

  const persons = form.persons.rawValue;
  const tmpData = {...myReduce(form), ...reducePersons(persons)};
  tmpData.sampleTypeId = store.sampleTypes
    ? getSampleTypeId(store.sampleTypes, form.sampleSubType.value)
    : null;
  tmpData.isExtracted = true;
  tmpData.parentObject = { 
    objectType: objectData.objectType,
    objectId: params.objectId || tmpData.originatedObjectUuid
  };
  tmpData.museumId = appSession.museumId;
  const data = Sample.prepareForSubmit(tmpData);
  return addSample({id: params.sampleId, museumId, token, data});
}

function getSampleTypeId(sampleTypes, selectSubType) {
  return flatten(Object.values(sampleTypes)).find(subType => {
    const subTypeName = sampleTypeDisplayName(subType);
    return subTypeName === selectSubType;
  }).sampleTypeId;
}

function sampleTypeDisplayName(v) {
  return v.enSampleSubType || v.enSampleType;
}