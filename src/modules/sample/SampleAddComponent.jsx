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

type FieldDropDownProps = {field: Field, title: string,  onSelectInput: Update, selectItems: Array<string>, inputProps?: any};

const FieldDropDown =  ({field, onSelectInput, selectItems, inputProps, title} : FieldDropDownProps) => (
  <FormGroup
    controlId={field.name}
    validationState={field.status && !field.status.valid ? 'error' : null}
  >
    <DropdownButton
      {...inputProps}
      bsStyle="default"
      title={title}
      id="type"
      onChange={ (e) => onSelectInput({name: field.name, rawValue: e.target.value }) }
    >
      { selectItems.map((v,i) => <MenuItem key={i}>{v}</MenuItem>) }
    </DropdownButton>
  </FormGroup>
);

type FormData = {
  note: Field, sampleSize: Field, status: Field,
  container: Field, storageMedium: Field, sampleType: Field,
  sampleSubType: Field, sizeUnit: Field
}
type Props = {form: FormData, updateForm: Update};

const SampleAddComponent = ({form, updateForm} : Props) => {
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
          Musno: <b>1234</b>
        </Col>
        <Col md={1}>
          Unr: <b>123344</b>
        </Col>
        <Col md={2}>
          Term/artsnavn: <b>Carex saxatilis</b>
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
          <FontAwesome name='user'/> Per Hansen
        </Col>
        <Col md={1}>
          <FontAwesome name='clock-o'/> 11.03.2017
        </Col>
      </Row>
      <Row>
        <Col md={1}>
          <ControlLabel>Sist endret:</ControlLabel>
        </Col>
        <Col md={1}>
          <FontAwesome name='user'/> Line Hansen
        </Col>
        <Col md={1}>
          <FontAwesome name='clock-o'/> 11.03.2017
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
             title={'Velg kontainer'}
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
    </Form>
  );
};

const FieldShape = {
  name: PropTypes.string.isRequired,
  rawValue: PropTypes.string,
  status: PropTypes.shape({
    valid: PropTypes.bool.isRequired,
    error: PropTypes.any
  })
};

SampleAddComponent.propTypes = {
  form: PropTypes.shape({
    note: PropTypes.shape(FieldShape).isRequired,
    sampleType: PropTypes.shape(FieldShape).isRequired,
    sampleSubType: PropTypes.shape(FieldShape).isRequired,
    sampleSize: PropTypes.shape(FieldShape).isRequired,
    sizeUnit: PropTypes.shape(FieldShape).isRequired,
    status: PropTypes.shape(FieldShape).isRequired,
    container: PropTypes.shape(FieldShape).isRequired,
    storageMedium: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired
};

export default SampleAddComponent;