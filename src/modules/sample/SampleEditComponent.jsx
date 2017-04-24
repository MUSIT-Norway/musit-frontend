import React, {PropTypes} from 'react';
import {
  PageHeader,
  Form,
  FormGroup,
  Well,
  Radio,
  Col,
  Button,
  DropdownButton,
  FormControl,
  MenuItem,
  ControlLabel,
  Row
} from 'react-bootstrap';
import Config from '../../config';
import {hashHistory} from 'react-router';
import PersonRoleDate from '../../components/samples/personRoleDate';
import AppSession from '../app/appSession';
import type {Person} from './sampleForm';

type Field = { name: string, rawValue: ?string };
type Update = (update: Field) => void;

type FieldInputProps = { field: Field, onChangeInput: Update, inputProps?: { className?: string, style?: {} } };

type FormData = {
  note: Field, size: Field, status: Field, externalId: Field,
  externalIdSource: Field, container: Field, storageMedium: Field,
  sampleType: Field, sampleId: Field, sampleSubType: Field,
  persons: Field,
  isExtracted: Field, sizeUnit: Field, museumId: Field, subNo: Field, term_species: Field,
  registeredBy: Field, registeredDate: Field, updateBy: Field, leftoverSample: Field,
  updateDate: Field, sampleId: Field, createdDate: Field, sampleDescription: Field
};

type Props = {
  form: FormData,
  updateForm: Update,
  editSample: Function,
  appSession: {
    museumId: number,
    accessToken: string,
    actor: {
      dataportenId: string
    }
  },
  params: {
    sampleId: string
  }
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

type FieldDropDownProps = {
  field: Field,
  title: any,
  onSelectInput: Update,
  selectItems: Array<string>,
  inputProps?: { className?: string, style?: {} }
};

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
          }
          }>{v}
        </MenuItem>) }
    </DropdownButton>
  </FormGroup>
);

type FieldReadOnlyProps = { field: Field, label: string, defaultValue: string, inputProps?: { className?: string, style?: {} } };

const FieldReadOnly = ({field, label, defaultValue, inputProps}: FieldReadOnlyProps) => {
  const value = field.rawValue;
  return (
    <span { ...inputProps}>
      {label} <b> {value || defaultValue}</b>
    </span>
  );
};

const submitSample = (id:string, appSession: AppSession, form: FormData, editSample: Function, persons: any) => {
  const token = appSession.accessToken;
  const museumId = appSession.museumId;
  const myReduce = (frm: FormData) => Object.keys(frm).reduce((akk: any, key: string) => ({...akk, [key]: frm[key].value}), {});
  const reducePersons = (p) => p && p.reduce((akk: any, v: Person) => {
    switch (v.role) {
      case 'Registrator':
        return {
          registeredStamp: {
            user: v.name,
            date: v.date
          }
        };
      case
      'Responsible':
        return {
          responsible: v.name
        };
      case
      'Updater':
        return {
          updatedStamp: {
            user: v.name, date: v.date
          }
        };
      default:
        return null;
    }
  }, {});

  const tmpData = {...myReduce(form), ...reducePersons(persons)};
  const data = {
    ...tmpData,
    externalId: {value: tmpData.externalId, source: tmpData.externalIdSource},
    size: {value: tmpData.size, unit: tmpData.sizeUnit},
    sampleType: {value: tmpData.sampleType, subTypeValue: tmpData.sampleSubType}
  };


  console.log('Form', form);

  data['createdDate'] = '2017-03-19';
  data['status'] = 2;
  data['responsible'] = appSession.actor.dataportenId;
  data['isCollectionObject'] = false;
  data['museumId'] = 99;

  return editSample({id, museumId, token, data});
};


const SampleEditComponent = ({params, form, updateForm, editSample, appSession}: Props) => {
  const id = params.sampleId;

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
      case 'Koble':
        return ['Aceton', 'Etanol', 'H2O'];
      default:
        return [];
    }
  };
  const personRoles: Array<Person> = form.persons.rawValue || [];

  return (
    <Form style={{padding: 20}}>
      <PageHeader>
        Endre prøveuttak
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
            defaultValue='1234'
          />
        </Col>
        <Col md={2}>
          <FieldReadOnly
            field={form.subNo}
            inputProps={{className: 'subNo'}}
            label='Unr:'
            defaultValue='6789'
          />
        </Col>
        <Col md={3}>
          <FieldReadOnly
            field={form.term_species}
            inputProps={{className: 'term_species'}}
            label='Term/artsnavn:'
            defaultValue='Carex saxatilis'
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
              field={form.sampleSubType}
              title={'Velg type'}
              onSelectInput={updateForm}
              selectItems={sampleSubValues(form.sampleType.rawValue)}
              inputProps={{className: 'sampleSubType'}}
            />
          </Col>
        </Row>
        <Row className='row-centered'>
          <Col md={2}>
            <b>Beskrivelse av prøve</b>
          </Col>
          <Col md={3}>
            <FieldInput
              field={form.sampleDescription}
              onChangeInput={updateForm}
              inputProps={{
                className: 'sampleDescription'
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
              inputProps={{className: 'storageContainer'}}
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
        <Row>
          <Col md={2}>
            <b>Har restmateriale</b>
          </Col>
          <Col md={3}>
            <CheckBoxInput
              field={form.leftoverSample}
              onChangeInput={updateForm}
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
              submitSample(id, appSession, form, editSample, form.persons.rawValue)
                .then(() => hashHistory.push(Config.magasin.urls.client.analysis.gotoSample(id)))
            }
          >
            Lagre
          </Button>
        </Col>
        <Col md={4}>
          <a onClick={(e) => e.preventDefault()}>
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
    PropTypes.number
  ]),
  status: PropTypes.shape({
    valid: PropTypes.bool.isRequired,
    error: PropTypes.any
  })
};

SampleEditComponent.propTypes = {
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
    sampleSubType: PropTypes.shape(FieldShape).isRequired,
    size: PropTypes.shape(FieldShape).isRequired,
    sizeUnit: PropTypes.shape(FieldShape).isRequired,
    status: PropTypes.shape(FieldShape).isRequired,
    container: PropTypes.shape(FieldShape).isRequired,
    storageMedium: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  appSession: PropTypes.object.isRequired
};

export default SampleEditComponent;