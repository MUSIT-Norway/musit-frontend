/* @flow */
import React, {PropTypes} from 'react';
import {
  PageHeader,
  Form,
  FormGroup,
  Col,
  Button,
  DropdownButton,
  FormControl,
  MenuItem,
  ControlLabel,
  Row
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

type Field = {name: string, rawValue: ?string};
type Update = (update: Field) => void;

type FieldInputProps = {field: Field, onChangeInput: Update, inputProps?: any};
const FieldInput = ({field, onChangeInput, inputProps} : FieldInputProps) => (
  <FormGroup
    controlId={field.name}
    validationState={field.status && !field.status.valid ? 'error' : null}
  >
    <FormControl
      {...inputProps}
      value={field.rawValue || ''}
      onChange={(e) => onChangeInput({name: field.name, rawValue: e.target.value })}
    />
  </FormGroup>
);

type FieldDropDownProps = {field: Field, title: any, onSelectInput: Update, selectItems: Array<string>, inputProps?: any};

const FieldDropDown = ({field, onSelectInput, selectItems, inputProps, title} : FieldDropDownProps) => (
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
            onSelectInput({name: field.name, rawValue: e.target.text });
          }
          }>{v}
        </MenuItem>) }
    </DropdownButton>
  </FormGroup>
);


type FieldReadOnlyProps = {field: Field, label: string, defaultValue: string, inputProps?: any};

const FieldReadOnly = ({field, label, defaultValue, inputProps}: FieldReadOnlyProps) => {
  const value=field.rawValue;
  return (<span { ...inputProps}>
    {label} <b> {value||defaultValue}</b>
    </span>
  );
};

type FormData = {
  note: Field, sampleSize: Field, status: Field,
  container: Field, storageMedium: Field, sampleType: Field,
  sampleSubType: Field, sizeUnit: Field, museumId: Field, subNo: Field,
  term_species: Field, registeredBy: Field, registeredDate: Field, updateBy: Field,
  updateDate: Field, sampleId: Field, createdDate: Field
}
type Props = {
  form: FormData, updateForm: Update, addSample: Function, appSession: {
    getMuseumId: Function,
    getAccessToken: Function,
    getActor: Function
  }
};

const SampleAddComponent = ({form, updateForm, addSample, appSession} : Props) => {
  const token = appSession.getAccessToken();
  const museumId = appSession.getMuseumId();

  const myReduce = (frm) => Object.keys(frm).reduce((akk: any, key: string) => ({...akk, [key]: frm[key].value}), {});

  const data = myReduce(form);
  data['createdDate'] = '2017-03-19';
  data['status'] = 2;
  data['responsible'] = appSession.getActor().dataportenId;
  data['isCollectionObject'] = false;
  data['museumId'] =  form.museumId;

  return (
    <Form style={{ padding: 20 }}>
      <PageHeader>
        Registrer prøveuttak
      </PageHeader>
      <Row className='row-centered'>
        <Col md={12}>
          <b>Avledet fra objekt</b>
        </Col>
      </Row>
      <Row className='row-centered'>
        <Col md={1}>
          <FieldReadOnly
            field={form.museumId}
            inputProps={{className: 'museumId'}}
            label='MusNo:'
            defaultValue='1234'
          />
        </Col>
        <Col md={1}>
          <FieldReadOnly
            field={form.subNo}
            inputProps={{className: 'subNo'}}
            label='Unr:'
            defaultValue='6789'
          />
        </Col>
        <Col md={2}>
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
      <Row>
        <Col md={1}>
          <b>PrøveID: </b>66777
        </Col>
      </Row>
      <br/>
      <Row>
        <Col md={1}>
          <ControlLabel>Registrert:</ControlLabel>
        </Col>
        <Col md={1}>
          <FontAwesome name='user'/> {form.registeredBy.value || 'Line A. Sjo' }
        </Col>
        <Col md={1}>
          <FontAwesome name='clock-o'/> {form.registeredDate.value || '11.03.2017' }
        </Col>
      </Row>
      <Row>
        <Col md={1}>
          <ControlLabel>Sist endret:</ControlLabel>
        </Col>
        <Col md={1}>
          <FontAwesome name='user'/> {form.updateBy.value || 'Stein Olsen' }
        </Col>
        <Col md={1}>
          <FontAwesome name='clock-o'/> {form.updateDate.value || '11.03.2017' }
        </Col>
        <Col md={2}>
          <a href=''>Se endringshistorikk</a>
        </Col>
      </Row>
      <br/>
      <hr/>
      <Row className='row-centered'>
        <Col md={1}>
          <b>Prøvetype</b>
        </Col>
        <Col md={1}>
          <FieldDropDown
            field={form.sampleType}
            title={'Velg type'}
            onSelectInput={updateForm}
            selectItems={['Vev', 'DNA-ekstrakt', 'Bein']}
            inputProps={{className: 'sampleType'}}
          />
        </Col>
        <Col md={1}>
          <b>Prøveundertype</b>
        </Col>
        <Col md={1}>
          <FieldDropDown
            field={form.sampleSubType}
            title={'Velg type'}
            onSelectInput={updateForm}
            selectItems={['Tallus', 'Klorofyll']}
            inputProps={{className: 'sampleSubType'}}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <b>Status</b>
        </Col>
        <Col md={1}>
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
        <Col md={1}>
          <ControlLabel>Målevolum/-vekt</ControlLabel>
        </Col>
        <Col md={1}>
          <FieldInput
            field={form.sampleSize}
            onChangeInput={updateForm}
            inputProps={{
              className: 'sampleSize'
            }}
          />
        </Col>
        <Col md={1}>
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
        <Col md={1}>
          <ControlLabel>Lagringskontainer</ControlLabel>
        </Col>
        <Col md={1}>
          <FieldDropDown
            field={form.container}
            title={form.container.value||'Velg kontainer'}
            onSelectInput={updateForm}
            selectItems={['Kapsel', 'Reagensrør', 'Glassplate']}
            inputProps={{className: 'storageContainer'}}
          />
        </Col>
        <Col md={1}>
          <FieldDropDown
            field={form.storageMedium}
            title={'Velg langringsmedium'}
            onSelectInput={updateForm}
            selectItems={['Etanol', 'Aceton', 'Vann']}
            inputProps={{className: 'storageMedium'}}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <ControlLabel>{'Note'}</ControlLabel>
        </Col>
        <Col md={3}>
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
      <Row className='row-centered'>
        <Col md={4}>
          <Button onClick={() => addSample({museumId, token, data})
          .toPromise()
          .then(
            null
          )}>
            Lagre
          </Button>
        </Col>
        <Col md={4}>
          <a onClick={
            (e) => {
              e.preventDefault();
            }}>
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
  value: PropTypes.string,
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
    sampleSubType: PropTypes.shape(FieldShape).isRequired,
    sampleSize: PropTypes.shape(FieldShape).isRequired,
    sizeUnit: PropTypes.shape(FieldShape).isRequired,
    status: PropTypes.shape(FieldShape).isRequired,
    container: PropTypes.shape(FieldShape).isRequired,
    storageMedium: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  appSession: PropTypes.object.isRequired
};

export default SampleAddComponent;