// @flow
import React  from 'react';
import Config from 'config';
import PersonRoleDate from 'components/samples/personRoleDate';
import Sample from 'models/sample';
import type { AppSession } from 'types/appSession';
import {hashHistory} from 'react-router';
import type { Person } from 'components/samples/personRoleDate';
import type { FormDetails } from './types/form';
import ValidatedFormGroup from 'forms/components/ValidatedFormGroup';
import FieldCheckBox from 'forms/components/FieldCheckBox';
import FieldDropDown from 'forms/components/FieldDropDown';
import FieldInput from 'forms/components/FieldInput';
import FieldTextArea from 'forms/components/FieldTextArea';

type Params = {
  objectId: string
}

type Props = {
  form: FormDetails,
  updateForm: Function,
  persons: Array<{ name: string, role: string, date: string }>,
  addSample: Function,
  addPersonToSample: Function,
  updatePersonForSample: Function,
  clearForm: Function,
  location: { pathname: string, state: Array<any>},
  appSession: AppSession,
  params: Params
};

const SampleAddComponent = ({form, updateForm, addSample, location, appSession, params, clearForm}: Props) => {

  const sampleValues = [
    'Frø',
    'Vev'
  ];

  const sampleSubValues = (v) => {
    switch (v) {
      case 'Frø':
        return ['Pollen', 'Korn', 'Erter'];
      case 'Vev':
        return ['Thallus', 'Bein', 'Blod', 'Ascus'];
      default:
        return [];
    }
  };

  const containerTypes = [
    'Kapsel',
    'Glassplate',
    'Kolbe'
  ];

  const containerSubTypes = (v) => {
    switch (v) {
      case 'Kapsel':
        return ['Etanol', 'Aceton', 'Vann'];
      case 'Glassplate':
        return [];
      case 'Kolbe':
        return ['Aceton', 'Etanol', 'H2O'];
      default:
        return [];
    }
  };

  const personRoles: Array<Person> = (form.persons.rawValue: any) || [];
  const objectData = location.state[0];
  const isValid = Object.keys(form).reduce((acc, k) => {
    const field = form[k];
    return acc && field.status.valid;
  }, true);
  return (
    <form style={{padding: 20}} className="form-horizontal">
      <div className="page-header">
        <h1>
          Registrer prøveuttak
        </h1>
      </div>
      <h4>
        Avledet fra objekt
      </h4>
      <div className='form-group'>
        <span className="col-md-2">
          <strong>MusNo:</strong> {objectData.museumNo}
        </span>
        <span className="col-md-2">
          <strong>Unr:</strong> {objectData.subNo}
        </span>
        <span className="col-md-2">
          <strong>Term/artsnavn:</strong> {objectData.term}
        </span>
      </div>
      <hr/>
      <h4>Personer knyttet til prøveuttaket</h4>
      <PersonRoleDate
        personData={personRoles}
        updateForm={updateForm}
        fieldName={form.persons.name}
      />
      <br/>
      <div className="well">
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
        <ValidatedFormGroup fields={[form.subTypeValue, form.subTypeValue]}>
          <FieldDropDown
            field={form.sampleType}
            title="Prøvetype:"
            defaultOption="Velg type"
            onChange={updateForm}
            selectItems={sampleValues}
          />
          <FieldDropDown
            field={form.subTypeValue}
            title="Prøveundertype:"
            defaultOption="Velg undertype"
            onChange={updateForm}
            selectItems={sampleSubValues(form.sampleType.rawValue)}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.description]}>
          <FieldInput
            field={form.description}
            title="Beskrivelse av prøve:"
            onChange={updateForm}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.status]}>
          <FieldDropDown
            field={form.status}
            title="Status:"
            defaultOption="Velg status"
            onChange={updateForm}
            selectItems={['Skilt', 'Ugift', 'Separert']}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.size, form.sizeUnit]}>
          <FieldInput
            field={form.size}
            title="Målevolum/-vekt"
            onChange={updateForm}
            inputProps={{ className: 'size' }}
          />
          <FieldDropDown
            field={form.sizeUnit}
            title=""
            defaultOption="Velg enhet"
            onChange={updateForm}
            selectItems={['gr', 'mm', 'µ']}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.container]}>
          <FieldDropDown
            field={form.container}
            title="Lagringskontainer"
            defaultOption="Velg kontainer"
            onChange={updateForm}
            selectItems={containerTypes}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.storageMedium]}>
          <FieldDropDown
            field={form.storageMedium}
            title="Lagringsmedium"
            defaultOption="Velg medium"
            onChange={updateForm}
            selectItems={containerSubTypes(form.container.rawValue)}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.treatment]}>
          <FieldDropDown
            field={form.treatment}
            title="Behandling:"
            defaultOption="Velg behandling"
            onChange={updateForm}
            selectItems={['Behandlet', 'Ubehandlet', 'Ufint behandlet']}
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.leftoverSample]}>
          <FieldCheckBox
            field={form.leftoverSample}
            title="Har restmateriale:"
            onChange={updateForm}
            defaultValue="1"
          />
        </ValidatedFormGroup>
        <ValidatedFormGroup fields={[form.note]}>
          <FieldTextArea
            field={form.note}
            title="Note"
            onChangeInput={updateForm}
            inputProps={{ rows: 5, className: 'note' }}
          />
        </ValidatedFormGroup>
      </div>
      <button
        className="btn btn-primary"
        disabled={!isValid}
        onClick={(e) => {
          e.preventDefault();
          submitSample(appSession, form, location.state[0], params, addSample)
            .then((value) => hashHistory.push({
              pathname: Config.magasin.urls.client.analysis.gotoSample(appSession, value),
              state: [objectData]}));
        }}
      >
        Lagre
      </button>
      &nbsp;&nbsp;
      <a
        href="#"
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
};

function submitSample(appSession: AppSession, form: FormDetails, objectData: any, params: Params, addSample: Function) {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const myReduce = (frm: FormDetails) => Object.keys(frm).reduce((akk: any, key: string) =>
    ({...akk, [key]: frm[key].value || frm[key].defaultValue}), {});
  const reducePersons = (p: any) => p && p.reduce((akk: any, v: Person) => {
    switch (v.role) {
      case 'creator':
        return {...akk,
          createdBy: v.name,
          doneDate: v.date
        };
      case 'responsible':
        return {...akk,
          responsible: {
            type: 'ActorByName',
            value: v.name
          }
        };
      default: return {};
    }
  }, {});

  const persons = form.persons.rawValue;
  const tmpData = {...myReduce(form), ...reducePersons(persons)};

  tmpData.status = 2;
  tmpData.responsible = {
    type: 'ActorById',
    value: appSession.actor.dataportenId
  };
  tmpData.isExtracted = false;
  tmpData.parentObjectType = objectData.objectType;
  tmpData.museumId = appSession.museumId;
  tmpData.parentObjectId = params.objectId;
  const data = Sample.prepareForSubmit(tmpData);
  return addSample({museumId, token, data});
}

export default SampleAddComponent;