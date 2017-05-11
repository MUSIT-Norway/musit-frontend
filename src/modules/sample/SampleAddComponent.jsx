// @flow
import React, {PropTypes} from 'react';
import {
  Well,
  PageHeader,
  Form,
  FormGroup,
  Col,
  Button,
  DropdownButton,
  Radio,
  FormControl,
  MenuItem,
  ControlLabel,
  Row
} from 'react-bootstrap';
import Config from '../../config';
import PersonRoleDate from '../../components/samples/personRoleDate';
import Sample from '../../models/sample';
import type { AppSession } from '../../types/appSession';
import {hashHistory} from 'react-router';
import type {Person} from './sampleForm';
import type { Field } from '../../forms/form';

type FieldInputProps = { field: Field<*>, onChangeInput: Function, inputProps?: { className?: string, style?: {} } };

type Params = {
  objectId: string
}

type FormData = {
  note: Field<string>, size: Field<string>, status: Field<string>, externalId: Field<string>,
  externalIdSource: Field<string>, container: Field<string>, storageMedium: Field<string>,
  sampleType: Field<*>, sampleId: Field<string>, treatment: Field<string>, subTypeValue: Field<string>,
  sizeUnit: Field<string>, museumId: Field<string>, subNo: Field<string>, leftoverSample: Field<string>,
  term_species: Field<string>, registeredBy: Field<string>, registeredDate: Field<string>, updateBy: Field<string>,
  hasRestMaterial: Field<string>, updateDate: Field<string>, sampleId: Field<string>, createdDate: Field<*>,
  description: Field<string>, persons: Field<Array<*>>
};

type Props = {
  form: FormData,
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

type FieldDropDownProps = {
  field: Field<string>,
  title: any,
  onSelectInput: Function,
  selectItems: Array<string>,
  inputProps?: { className?: string, style?: {} }
};


const FieldInput = ({field, onChangeInput, inputProps}: FieldInputProps) => (
  <FormGroup
    controlId={field.name}
    validationState={field.status && !field.status.valid ? 'error' : null}
  >
    <FormControl
      {...inputProps}
      value={field.rawValue || ''}
      onChange={(e) => onChangeInput({name: field.name, rawValue: e.target.value})}
    />
  </FormGroup>
);

const CheckBoxInput = ({field, onChangeInput}: FieldInputProps) => (
  <FormGroup>
    <Radio
      inline
      value={field.rawValue || '1'}
      checked={field.rawValue === '3'}
      onChange={() =>
        onChangeInput({name: field.name, rawValue: '3'})}
    >Ja</Radio>
    <Radio
      inline value={field.rawValue || '1'}
      checked={field.rawValue === '2'}
      onChange={() =>
        onChangeInput({name: field.name, rawValue: '2'})}
    >Nei</Radio>
  </FormGroup>
);


const FieldDropDown = ({field, onSelectInput, selectItems, inputProps, title}: FieldDropDownProps) => (
  <FormGroup
    controlId={field.name}
    validationState={field.status && !field.status.valid ? 'error' : null}
  >
    <DropdownButton
      {...inputProps}
      bsStyle="default"
      title={field.value ? field.value : title}
      id={field.name}
    >
      { selectItems.map((v, i) =>
        <MenuItem
          key={i}
          onClick={ (e) => {
            onSelectInput({name: field.name, rawValue: e.target.text});
          }}>{v}
        </MenuItem>) }
    </DropdownButton>
  </FormGroup>
);

type FieldReadOnlyProps = { field: Field<string>, label: string, defaultValue: string, inputProps?: { className?: string, style?: {} } };

const FieldReadOnly = ({field, label, defaultValue, inputProps}: FieldReadOnlyProps) => {
  const value = field.rawValue;
  return (
    <span { ...inputProps}>
      {label} <b> {value || defaultValue}</b>
    </span>
  );
};

const submitSample = (appSession: AppSession, form: FormData, objectData: any, params: Params, addSample: Function) => {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const myReduce = (frm: FormData) => Object.keys(frm).reduce((akk: any, key: string) =>
    ({...akk, [key]: frm[key].value || frm[key].defaultValue}), {});
  const reducePersons = (p: any) => p && p.reduce((akk: any, v: Person) => {
    switch (v.role) {
      case 'creator':
        return {...akk,
          createdBy:v.name,
          createdDate: v.date
        };
      case
      'responsible':
        return {...akk,
          responsible: v.name
        };
      default: return {};
    }
  }, {});

  const persons = form.persons.rawValue;
  const tmpData = {...myReduce(form), ...reducePersons(persons)};

  tmpData.status = 2;
  tmpData.responsible = appSession.actor.dataportenId;
  tmpData.isExtracted = false;
  tmpData.parentObjectType = objectData.objectType;
  tmpData.museumId = appSession.museumId;
  tmpData.parentObjectId = params.objectId;
  const data = Sample.prepareForSubmit(tmpData);
  return addSample({museumId, token, data});
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
    <Form style={{padding: 20}}>
      <PageHeader>
        Registrer prøveuttak
      </PageHeader>
      <Row className='row-centered'>
        <Col md={12}>
          <b>Avledet fra objekt</b>
        </Col>
      </Row>
      <Row className='row-centered'>
        <Col md={2}>
          <FieldReadOnly
            field={form.museumId}
            inputProps={{className: 'museumId'}}
            label='MusNo:'
            defaultValue={objectData.museumNo}
          />
        </Col>
        <Col md={2}>
          <FieldReadOnly
            field={form.subNo}
            inputProps={{className: 'subNo'}}
            label='Unr:'
            defaultValue={objectData.subNo}
          />
        </Col>
        <Col md={3}>
          <FieldReadOnly
            field={form.term_species}
            inputProps={{className: 'term_species'}}
            label='Term/artsnavn:'
            defaultValue={objectData.term}
          />
        </Col>
        <Col md={1}>
          <Button>Vis Objektet</Button>
        </Col>
      </Row>
      <hr/>
      <PersonRoleDate
        heading={'Personer knyttet til prøveuttaket'}
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

      <Well>
        <Row className='row-centered'>
          <Col md={3}>
            <b>Prøvenr</b>
          </Col>
          <Col md={2}>
            <b>UUID</b>
          </Col>
        </Row>
        <br />
        <br />
        <Row className='row-centered'>
          <Col md={1}>
            <b>PrøveID</b>
          </Col>
          <Col md={2}>
            <FieldInput
              field={form.sampleId}
              onChangeInput={updateForm}
              inputProps={{
                className: 'sampleId'
              }}
            />
          </Col>
        </Row>
        <Row className='row-centered'>
          <Col md={1}>
            <b>EksternID</b>
          </Col>
          <Col md={2}>
            <FieldInput
              field={form.externalId}
              onChangeInput={updateForm}
              inputProps={{
                className: 'externalID'
              }}
            />
          </Col>
          <Col md={2}>
            <b>Kilde for ekstern ID</b>
          </Col>
          <Col md={3}>
            <FieldInput
              field={form.externalIdSource}
              onChangeInput={updateForm}
              inputProps={{
                className: 'externalIdSource'
              }}
            />
          </Col>
        </Row>
        <br />
        <Row className='row-centered'>
          <Col md={2}>
            <b>Prøvetype</b>
          </Col>
          <Col md={2}>
            <FieldDropDown
              field={form.sampleType}
              title={'Velg type'}
              onSelectInput={updateForm}
              selectItems={sampleValues}
              inputProps={{className: 'sampleType'}}
            />
          </Col>
          <Col md={2}>
            <b>Prøveundertype</b>
          </Col>
          <Col md={2}>
            <FieldDropDown
              field={form.subTypeValue}
              title={'Velg type'}
              onSelectInput={updateForm}
              selectItems={sampleSubValues(form.sampleType.rawValue)}
              inputProps={{className: 'subTypeValue'}}
            />
          </Col>
        </Row>
        <Row className='row-centered'>
          <Col md={2}>
            <b>Beskrivelse av prøve</b>
          </Col>
          <Col md={3}>
            <FieldInput
              field={form.description}
              onChangeInput={updateForm}
              inputProps={{
                className: 'description'
              }}
            />
          </Col>
        </Row>
        <br/>
        <Row className='row-centered'>
          <Col md={2}>
            <b>Status</b>
          </Col>
          <Col md={2}>
            <FieldDropDown
              field={form.status}
              title={'Velg type'}
              onSelectInput={updateForm}
              selectItems={['Skilt', 'Ugift', 'Separert']}
              inputProps={{className: 'status'}}
            />
          </Col>
        </Row>
        <br/>
        <Row className='row-centered'>
          <Col md={2}>
            <ControlLabel>Målevolum/-vekt</ControlLabel>
          </Col>
          <Col md={2}>
            <FieldInput
              field={form.size}
              onChangeInput={updateForm}
              inputProps={{
                className: 'size'
              }}
            />
          </Col>
          <Col md={2}>
            <FieldDropDown
              field={form.sizeUnit}
              title={'Velg måleenhet'}
              onSelectInput={updateForm}
              selectItems={['gr', 'mm', 'µ']}
              inputProps={{className: 'sizeUnit'}}
            />
          </Col>
        </Row>
        <br/>
        <Row className='row-centered'>
          <Col md={2}>
            <ControlLabel>Lagringskontainer</ControlLabel>
          </Col>
          <Col md={2}>
            <FieldDropDown
              field={form.container}
              title={form.container.value || 'Velg kontainer'}
              onSelectInput={updateForm}
              selectItems={containerTypes}
              inputProps={{className: 'container'}}
            />
          </Col>
        </Row>
        <Row className='row-centered'>
          <Col md={2}>
            <ControlLabel>Lagringsmedium</ControlLabel>
          </Col>
          <Col md={2}>
            <FieldDropDown
              field={form.storageMedium}
              title={'Velg langringsmedium'}
              onSelectInput={updateForm}
              selectItems={containerSubTypes(form.container.rawValue)}
              inputProps={{className: 'storageMedium'}}
            />
          </Col>
        </Row>
        <br/>
        <Row className='row-centered'>
          <Col md={2}>
            <b>Behandling</b>
          </Col>
          <Col md={2}>
            <FieldDropDown
              field={form.treatment}
              title={'Velg behandling'}
              onSelectInput={updateForm}
              selectItems={['Behandlet', 'Ubehandlet', 'Ufint behandlet']}
              inputProps={{className: 'treatment'}}
            />
          </Col>
        </Row>
        <br/>
        <Row>
          <Col md={2}>
            <b>Har restmateriale</b>
          </Col>
          <Col md={3}>
            <CheckBoxInput
              field={form.leftoverSample}
              onChangeInput={updateForm}
              defaultValue={'1'}
            />
          </Col>
        </Row>
        <Row className='row-centered'>
          <Col md={2}>
            <ControlLabel>{'Note'}</ControlLabel>
          </Col>
          <Col md={5}>
            <FieldInput
              field={form.note}
              onChangeInput={updateForm}
              inputProps={{
                className: 'note',
                componentClass: 'textarea',
                placeholder: form.note.name
              }}
            />
          </Col>
        </Row>
      </Well>
      <Row className='row-centered'>
        <Col md={4}>
          <Button
            onClick={() =>
              submitSample(appSession, form, location.state[0], params, addSample)
                .then((value) => hashHistory.push({
                  pathname: Config.magasin.urls.client.analysis.gotoSample(appSession, value),
                  state: [objectData]}))
            }
          >
            Lagre
          </Button>
        </Col>
        <Col md={4}>
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
        </Col>
      </Row>
    </Form>
  );
};

const FieldShape = {
  name: PropTypes.string.isRequired,
  rawValue: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  status: PropTypes.shape({
    valid: PropTypes.bool.isRequired,
    error: PropTypes.any
  })
};

SampleAddComponent.propTypes = {
  form: PropTypes.shape({
    note: PropTypes.shape(FieldShape).isRequired,
    museumId: PropTypes.shape(FieldShape).isRequired,
    subNo: PropTypes.shape(FieldShape).isRequired,
    term_species: PropTypes.shape(FieldShape).isRequired,
    registeredBy: PropTypes.shape(FieldShape).isRequired,
    registeredDate: PropTypes.shape(FieldShape).isRequired,
    updateBy: PropTypes.shape(FieldShape).isRequired,
    updateDate: PropTypes.shape(FieldShape).isRequired,
    sampleType: PropTypes.shape(FieldShape).isRequired,
    subTypeValue: PropTypes.shape(FieldShape).isRequired,
    size: PropTypes.shape(FieldShape).isRequired,
    sizeUnit: PropTypes.shape(FieldShape).isRequired,
    status: PropTypes.shape(FieldShape).isRequired,
    container: PropTypes.shape(FieldShape).isRequired,
    storageMedium: PropTypes.shape(FieldShape).isRequired,
    leftoverSample: PropTypes.shape(FieldShape).isRequired,
    externalId: PropTypes.shape(FieldShape).isRequired,
    externalIdSource: PropTypes.shape(FieldShape).isRequired,
    description: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  appSession: PropTypes.object.isRequired
};

export default SampleAddComponent;