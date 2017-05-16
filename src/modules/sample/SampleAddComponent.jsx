// @flow
import React from 'react';
import Config from 'config';
import PersonRoleDate from 'components/samples/personRoleDate';
import Sample from 'models/sample';
import type { AppSession } from 'types/appSession';
import {hashHistory} from 'react-router';
import type {Person} from './sampleForm';
import type { Field } from 'forms/form';
import type { FormDetails } from './types/form';

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
        <div className="col-md-2">
          <FieldReadOnly
            field={form.museumId}
            inputProps={{className: 'museumId'}}
            label='MusNo:'
            defaultValue={objectData.museumNo}
          />
        </div>
        <div className="col-md-2">
          <FieldReadOnly
            field={form.subNo}
            inputProps={{className: 'subNo'}}
            label='Unr:'
            defaultValue={objectData.subNo}
          />
        </div>
        <div className="col-md-2">
          <FieldReadOnly
            field={form.term_species}
            inputProps={{className: 'term_species'}}
            label='Term/artsnavn:'
            defaultValue={objectData.term}
          />
        </div>
      </div>
      <hr/>
      <h4>Personer knyttet til prøveuttaket</h4>
      <PersonRoleDate
        personData={personRoles}
        addPerson={() => updateForm({
          name: form.persons.name,
          rawValue: [...personRoles, {name: '', role: '', date: ''}]
        })}
        updatePerson={(ind, person) => updateForm({
          name: form.persons.name,
          rawValue: person ? [
            ...personRoles.slice(0, ind),
            person,
            ...personRoles.slice(ind + 1)
          ] : [
            ...personRoles.slice(0, ind),
            ...personRoles.slice(ind + 1)
          ]
        })}
      />
      <br/>
      <div className="well">
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.sampleId.name}>
            PrøveID
          </label>
          <div className="col-md-3">
            <FieldInput field={form.sampleId} onChangeInput={updateForm} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor={form.externalId.name}>
            EksternID
          </label>
          <div className="col-md-3">
            <FieldInput field={form.externalId} onChangeInput={updateForm} />
          </div>
          <label className="control-label col-md-2" htmlFor={form.externalIdSource.name}>
            Kilde for ekstern ID
          </label>
          <div className="col-md-3">
            <FieldInput field={form.externalIdSource} onChangeInput={updateForm} s/>
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.sampleType.name}>
            Prøvetype
          </label>
          <div className="col-md-3">
            <FieldDropDown
              field={form.sampleType}
              title={'Velg type'}
              onSelectInput={updateForm}
              selectItems={sampleValues}
            />
          </div>
          <label className="control-label col-md-2" htmlFor={form.subTypeValue.name}>
            Prøveundertype
          </label>
          <div className="col-md-2">
            <FieldDropDown
              field={form.subTypeValue}
              title={'Velg type'}
              onSelectInput={updateForm}
              selectItems={sampleSubValues(form.sampleType.rawValue)}
            />
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.description.name}>
            Beskrivelse av prøve
          </label>
          <div className="col-md-3">
            <FieldInput field={form.description} onChangeInput={updateForm} />
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.status.name}>
            Status
          </label>
          <div className="col-md-3">
            <FieldDropDown
              field={form.status}
              title={'Velg type'}
              onSelectInput={updateForm}
              selectItems={['Skilt', 'Ugift', 'Separert']}
            />
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.size.name}>
            Målevolum/-vekt
          </label>
          <div className="col-md-3">
            <FieldInput field={form.size} onChangeInput={updateForm} inputProps={{ className: 'size' }} />
          </div>
          <div className="col-md-2">
            <FieldDropDown
              field={form.sizeUnit}
              title={'Velg måleenhet'}
              onSelectInput={updateForm}
              selectItems={['gr', 'mm', 'µ']}
            />
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.container.name}>
            Lagringskontainer
          </label>
          <div className="col-md-3">
            <FieldDropDown
              field={form.container}
              title={'Velg kontainer'}
              onSelectInput={updateForm}
              selectItems={containerTypes}
            />
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.storageMedium.name}>
            Lagringsmedium
          </label>
          <div className="col-md-3">
            <FieldDropDown
              field={form.storageMedium}
              title={'Velg langringsmedium'}
              onSelectInput={updateForm}
              selectItems={containerSubTypes(form.container.rawValue)}
            />
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.treatment.name}>
            Behandling
          </label>
          <div className="col-md-3">
            <FieldDropDown
              field={form.treatment}
              title={'Velg behandling'}
              onSelectInput={updateForm}
              selectItems={['Behandlet', 'Ubehandlet', 'Ufint behandlet']}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-2" htmlFor={form.leftoverSample.name}>
            Har restmateriale
          </label>
          <div className="col-md-3">
            <CheckBoxInput
              field={form.leftoverSample}
              onChangeInput={updateForm}
              defaultValue={'1'}
            />
          </div>
        </div>
        <div className='form-group'>
          <label className="control-label col-md-2" htmlFor={form.note.name}>
            Note
          </label>
          <div className="col-md-5">
            <FieldTextArea
              field={form.note}
              onChangeInput={updateForm}
              inputProps={{ rows: 5, className: 'note' }}
            />
          </div>
        </div>
      </div>
      <button
        className="btn btn-default"
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

type FieldInputProps = {
  field: Field<*>,
  onChangeInput: Function,
  inputProps?: {
    className?: string,
    style?: {}
  }
};

function FieldInput({field, onChangeInput, inputProps}: FieldInputProps) {
  return (
    <input
      {...inputProps}
      className={`form-control ${inputProps ? inputProps.className || '' : ''}`}
      id={field.name}
      value={field.rawValue || ''}
      onChange={(e) => onChangeInput({name: field.name, rawValue: e.target.value})}
    />
  );
}

type FieldTextAreaProps = {
  field: Field<*>,
  onChangeInput: Function,
  inputProps?: {
    className?: string,
    style?: {},
    rows?: number
  }
};

function FieldTextArea({field, onChangeInput, inputProps}: FieldTextAreaProps) {
  return (
    <textarea
      {...inputProps}
      className={`form-control ${inputProps ? inputProps.className || '' : ''}`}
      id={field.name}
      value={field.rawValue || ''}
      onChange={(e) => onChangeInput({name: field.name, rawValue: e.target.value})}
    />
  );
}

function CheckBoxInput({field, onChangeInput}: FieldInputProps) {
  return (
    <div className="btn-group" data-toggle="buttons">
      <label className={`btn btn-default${field.rawValue === '3' ? ' active' : ''}`}>
        <input
          type="radio"
          value={'3'}
          checked={field.rawValue === '3'}
          onChange={(e) => onChangeInput({name: field.name, rawValue: e.target.value})}
        />  Ja
      </label>
      <label className={`btn btn-default${field.rawValue === '2' ? ' active' : ''}`}>
        <input
          type="radio"
          value={'2'}
          checked={field.rawValue === '2'}
          onChange={(e) => onChangeInput({name: field.name, rawValue: e.target.value})}
        /> Nei
      </label>
    </div>
  );
}

type FieldDropDownProps = {
  field: Field<string>,
  title: any,
  onSelectInput: Function,
  selectItems: Array<string>,
  inputProps?: { className?: string, style?: {} }
};

function FieldDropDown({field, onSelectInput, selectItems, inputProps, title}: FieldDropDownProps) {
  return (
    <select
      {...inputProps}
      className="form-control"
      value={field.value || ''}
      id={field.name}
      onChange={(e) => onSelectInput({name: field.name, rawValue: e.target.text})}
    >
      <option>{title}</option>
      {selectItems.map((v, i) =>
        <option
          key={i}
          onClick={ (e) => {
            onSelectInput({name: field.name, rawValue: e.target.text});
          }}
        >
          {v}
        </option>
      )}
    </select>
  );
}

type FieldReadOnlyProps = {
  field: Field<string>,
  label: string,
  defaultValue: string,
  inputProps?: {
    className?: string,
    style?: {}
  }
};

function FieldReadOnly({field, label, defaultValue, inputProps}: FieldReadOnlyProps){
  const value = field.rawValue;
  return (
    <span { ...inputProps}>
      {label} <strong> {value || defaultValue}</strong>
    </span>
  );
}

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