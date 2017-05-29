// @flow
import React  from 'react';
import Config from '../../config';
import PersonRoleDate from '../../components/samples/personRoleDate';
import Sample from '../../models/sample';
import type { ObjectData } from '../../types/object';
import type { AppSession } from '../../types/appSession';
import {hashHistory} from 'react-router';
import type {Person} from '../../components/samples/personRoleDate';
import type {FormDetails} from './types/form';
import ValidatedFormGroup from '../../forms/components/ValidatedFormGroup';
import FieldCheckBox from '../../forms/components/FieldCheckBox';
import FieldDropDown from '../../forms/components/FieldDropDown';
import FieldInput from '../../forms/components/FieldInput';
import FieldTextArea from '../../forms/components/FieldTextArea';
import flatten from 'lodash/flatten';
import MetaInformation from '../../components/metainfo';
import moment from 'moment';

type Params = {
  objectId: string,
  sampleId?: string
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
  updateForm: Function,
  persons: Array<{ name: string, role: string, date: string }>,
  addSample: Function,
  addPersonToSample: Function,
  updatePersonForSample: Function,
  clearForm: Function,
  location: { pathname: string, state: Array<any> },
  appSession: AppSession,
  params: Params
};

function isFormValid(form) {
  return Object.keys(form).reduce((acc, k) => {
    const field = form[k];
    return acc && field.status.valid;
  }, true);
}

export default function SampleFormComponent({form, store, updateForm, addSample, location, appSession, params, clearForm}: Props) {
  return (
    <form className="form-horizontal">
      <div className="page-header">
        <h1>
          Registrer prøve
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
        Avledet fra objekt
      </h4>
      <div>
        <span style={{ marginRight: 20 }}>
          <strong>Museumnr:</strong> {location.state[0].museumNo}
        </span>
        <span style={{ marginRight: 20 }}>
          <strong>Unr:</strong> {location.state[0].subNo}
        </span>
        <span>
          <strong>Term/artsnavn:</strong> {location.state[0].term}
        </span>
      </div>
      <hr/>
      <h4>Personer knyttet til prøveuttaket</h4>
      <PersonRoleDate
        appSession={appSession}
        personData={form.persons.rawValue}
        updateForm={updateForm}
        fieldName={form.persons.name}
      />
      <br/>
      <div className="well">
        {form.sampleNum ?
        <ValidatedFormGroup fields={[form.sampleNum]}>
          <FieldInput
            field={form.sampleNum}
            title="Prøvenr:"
            onChange={updateForm}
            readOnly={true}
          />
        </ValidatedFormGroup> : ''}
        <ValidatedFormGroup fields={[form.sampleId]}>
          <FieldInput
            field={form.sampleId}
            title="PrøveID:"
            onChange={updateForm}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.externalId, form.externalIdSource]}>
          <FieldInput
            field={form.externalId}
            title="EksternID:"
            onChange={updateForm}
          />
          <FieldInput
            field={form.externalIdSource}
            title="Kilde for ekstern ID:"
            onChange={updateForm}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.sampleType, form.subTypeValue]}>
          <FieldDropDown
            field={form.sampleType}
            title="Prøvetype:"
            defaultOption="Velg type"
            onChange={(obj) => {
              if (store.sampleTypes && store.sampleTypes[obj.rawValue] && store.sampleTypes[obj.rawValue].length === 1) {
                updateForm({ name: form.subTypeValue.name, rawValue: sampleTypeDisplayName(store.sampleTypes[obj.rawValue][0])});
              } else {
                updateForm({name: form.subTypeValue.name, rawValue: ''});
              }
              updateForm(obj);
            }}
            selectItems={store.sampleTypes ? Object.keys(store.sampleTypes) : []}
          />
          {form.sampleType.rawValue && form.sampleType.rawValue.trim().length > 0 && store.sampleTypes && store.sampleTypes[form.sampleType.rawValue].length > 1 &&
            <FieldDropDown
              field={form.subTypeValue}
              title="Prøveundertype:"
              defaultOption="Velg undertype"
              valueFn={sampleTypeDisplayName}
              displayFn={sampleTypeDisplayName}
              onChange={updateForm}
              selectItems={store.sampleTypes ? store.sampleTypes[form.sampleType.rawValue] : []}
            />
          }
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.description]}>
          <FieldTextArea
            field={form.description}
            title="Beskrivelse av prøve:"
            onChangeInput={updateForm}
            inputProps={{rows: 5}}
            controlWidth={10}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.status]}>
          <FieldDropDown
            field={form.status}
            title="Status:"
            defaultOption="Velg status"
            valueFn={(v) => v.id}
            displayFn={(v) => v.noStatus}
            onChange={updateForm}
            selectItems={Sample.sampleStatuses}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.size, form.sizeUnit]}>
          <FieldInput
            field={form.size}
            title="Prøvevolum/-vekt:"
            onChange={updateForm}
            inputProps={{className: 'size'}}
          />
          <FieldDropDown
            field={form.sizeUnit}
            title=""
            defaultOption="Velg enhet"
            onChange={updateForm}
            selectItems={Sample.sampleSizeUnits}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.container]}>
          <FieldDropDown
            field={form.container}
            title="Lagringskontainer:"
            defaultOption="Velg kontainer"
            onChange={updateForm}
            selectItems={store.storageContainers ? store.storageContainers.map(c => c.noStorageContainer) : []}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.storageMedium]}>
          <FieldDropDown
            field={form.storageMedium}
            title="Lagringsmedium:"
            defaultOption="Velg medium"
            onChange={updateForm}
            selectItems={store.storageMediums ? store.storageMediums.map(m => m.noStorageMedium) : []}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.treatment]}>
          <FieldDropDown
            field={form.treatment}
            title="Behandling:"
            defaultOption="Velg behandling"
            onChange={updateForm}
            selectItems={store.treatments ? store.treatments.map(t => t.noTreatment) : []}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.leftoverSample]}>
          <FieldCheckBox
            field={form.leftoverSample}
            title="Har restmateriale:"
            yesValue={3}
            noValue={2}
            onChange={updateForm}
            defaultValue="1"
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.note]}>
          <FieldTextArea
            field={form.note}
            title="Kommentar:"
            onChangeInput={updateForm}
            inputProps={{rows: 5, className: 'note'}}
            controlWidth={10}
          />
        </ValidatedFormGroup>
      </div>
      <button
        className="btn btn-primary"
        disabled={!isFormValid(form)}
        onClick={(e) => {
          e.preventDefault();
          submitSample(appSession, store, form, location.state[0], params, addSample)
            .then((value) =>
              hashHistory.push({
                pathname: Config.magasin.urls.client.analysis.gotoSample(appSession, value.objectId || value),
                state: [location.state[0]]
              })
            );
        }}
      >
        Lagre
      </button>
      <a
        href="/"
        style={{ marginLeft: 20 }}
        onClick={(e) => {
          e.preventDefault();
          clearForm();
          hashHistory.refresh();
        }}
      >
        Avbryt
      </a>
    </form>
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

  tmpData.sampleTypeId = store.sampleTypes ? getSampleTypeId(store.sampleTypes, form.subTypeValue.value) : null;
  tmpData.isExtracted = true;
  tmpData.parentObject = { objectType: objectData.objectType, objectId: params.objectId };
  tmpData.museumId = appSession.museumId;
  const data = Sample.prepareForSubmit(tmpData);
  return addSample({id: params.sampleId, museumId, token, data});
}

function getSampleTypeId(sampleTypes, selectSubType) {
  const sampleType = flatten(Object.values(sampleTypes)).find(subType => {
    const subTypeName = sampleTypeDisplayName(subType);
    return subTypeName === selectSubType;
  });
  return sampleType.sampleTypeId;
}

function sampleTypeDisplayName(v) {
  return v.enSampleSubType || v.enSampleType;
}
