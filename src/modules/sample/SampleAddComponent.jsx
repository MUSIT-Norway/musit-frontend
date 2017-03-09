/* @flow */
import React, { PropTypes } from 'react';
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

type Field = { name: string, rawValue: ?string };
type Update = (update: Field) => void;

type FieldInputProps = { field: Field, onChangeInput: Update, inputProps?: any };
const FieldInput = ({ field, onChangeInput, inputProps } : FieldInputProps) => (
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

type FormData = { note: Field,  weight: Field, phone: Field }
type Props = { form: FormData, updateForm: Update };

const SampleAddComponent = ({ form, updateForm } : Props) => {
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
          <DropdownButton
            bsStyle="default"
            title="Velg type"
            id="type"
          >
            <MenuItem eventKey="1">Vev</MenuItem>
            <MenuItem eventKey="2">Blad</MenuItem>
          </DropdownButton>
        </Col>
        <Col md={1}>
          <b>Prøveundertype</b>
        </Col>
        <Col md={1}>
          <DropdownButton
            bsStyle="default"
            title="Velg type"
            id="subtype"
          >
            <MenuItem eventKey="1">Tallus</MenuItem>
            <MenuItem eventKey="2">Klorofyll</MenuItem>
          </DropdownButton>
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <b>Status</b>
        </Col>
        <Col md={1}>
          <DropdownButton
            bsStyle="default"
            title="Velg type"
            id="status"
          >
            <MenuItem eventKey="1">Skilt</MenuItem>
            <MenuItem eventKey="2">Gift</MenuItem>
          </DropdownButton>
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <ControlLabel>Målevolum/-vekt</ControlLabel>
        </Col>
        <Col md={1}>
          <FieldInput
            field={form.weight}
            onChangeInput={updateForm}
            inputProps={{
              className: 'weight'
            }}
          />
        </Col>
        <Col md={1}>
          <DropdownButton
            bsStyle="default"
            title="Velg måleenhet"
            id="måleenhet"
          >
            <MenuItem eventKey="1">Gr</MenuItem>
            <MenuItem eventKey="2">Liter</MenuItem>
          </DropdownButton>
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <ControlLabel>Lagringskontainer</ControlLabel>
        </Col>
        <Col md={1}>
          <DropdownButton
            bsStyle="default"
            title="Velg kontainer"
            id="kontainer"
          >
            <MenuItem eventKey="1">Kapsel</MenuItem>
            <MenuItem eventKey="2">Reagensrør</MenuItem>
            <MenuItem eventKey="2">Glassplate</MenuItem>
          </DropdownButton>
        </Col>
        <Col md={1}>
          <DropdownButton
            bsStyle="default"
            title="Velg lagringsmedium"
            id="lagringsmedium"
          >
            <MenuItem eventKey="1">Etanol</MenuItem>
            <MenuItem eventKey="2">Aceton</MenuItem>
          </DropdownButton>
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
      <br />
      <Row className='row-centered'>
        <Col md={1}>
          <ControlLabel>Test</ControlLabel>
        </Col>
        <Col md={1}>
          <FieldInput
            field={form.phone}
            onChangeInput={updateForm}
            inputProps={{
              className: 'phone'
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
    weight: PropTypes.shape(FieldShape).isRequired,
    phone: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired
};

export default SampleAddComponent;