import React from 'react';
import {
  PageHeader,
  Form,
  FormGroup,
  Col,
  DropdownButton,
  FormControl,
  MenuItem,
  ControlLabel,
  InputGroup
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';


function FieldGroup({id, label, ...props}) {
  return (
    <FormGroup controlId={id}>
      <Col componentClass={ControlLabel} md={1}>{label}</Col>
      <Col md={2}>
        <FormControl {... props} />
      </Col>
    </FormGroup>
  );
}
const AddAnalysis = () => {
  return (
    <Form>
      <br/>
      <PageHeader>{'Registrere analyse'}</PageHeader>
      <FormGroup>
        <Col md={12}><b> HID:: </b>123</Col>
      </FormGroup>
      <FormGroup>
        <Col md={2}>
          <b>Registrert:</b>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col md={2}>
          <FontAwesome name='user'/>{' '}
          Per Hansen
        </Col>
      </FormGroup>
      <FormGroup>
        <Col md={8}>
          <FontAwesome name='clock-o'/>{' '}
          15.12.2017
        </Col>
      </FormGroup>
      <FormGroup>
        <Col md={2}>
          <b>Sist endret:</b>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col md={2}>
          <FontAwesome name='user'/>{' '}
          Per Hansen
        </Col>
      </FormGroup>
      <FormGroup>
        <Col md={2}>
          <FontAwesome name='clock-o'/>{' '}
          15.12.2017
        </Col>
      </FormGroup>
      <FormGroup>
        <Col md={6}>
          <a href=''>Se endringshistorikk</a>
        </Col>
      </FormGroup>
      <hr/>
      <br/>
      <FieldGroup
        id="formControlsText"
        type="text"
        label="Text"
        placeholder="Enter text"
      />
      <hr/>
      <InputGroup style={{minWidth:'796px'}}>
        <Col md={4}>
          <b>Analysetype</b>{' '}
          <DropdownButton bsStyle={'Default'} title='Velg type' id="bg-nested-dropdown">
            <MenuItem eventKey="1">Vev</MenuItem>
            <MenuItem eventKey="2">Blad</MenuItem>
          </DropdownButton>
        </Col>
        <Col md={4}>
          <b>Analyseundertype</b>{' '}
          <DropdownButton bsStyle={'Default'} title='Velg type' id="bg-nested-dropdown">
            <MenuItem eventKey="1">Tallus</MenuItem>
            <MenuItem eventKey="2">Klorofyll</MenuItem>
          </DropdownButton>
        </Col>
      </InputGroup>
      <br/>
      <Form inline>
        <FormGroup style={{minWidth:'796px'}}>
          <Col md={4}>
            <b>Status</b>{' '}
            <DropdownButton bsStyle={'Default'} title='Velg status' id="bg-nested-dropdown">
              <MenuItem eventKey="1">Nyskilt</MenuItem>
              <MenuItem eventKey="2">Separert</MenuItem>
            </DropdownButton>
          </Col>

        </FormGroup>
      </Form>
      <br/>

      <Form inline>
        <InputGroup style={{minWidth:'796px'}}>
          <Col md={3}>
            <ControlLabel>Analysevolum/-vekt</ControlLabel>
          </Col>
          <Col md={3}>
            <FormControl type="text" placeholder="Vekt/Volum"/>
          </Col>
          <Col md={3}>
            <DropdownButton bsStyle={'Default'} title='Velg måleenhet' id="bg-nested-dropdown">
              <MenuItem eventKey="1">Gr</MenuItem>
              <MenuItem eventKey="2">Liter</MenuItem>
            </DropdownButton>
          </Col>
        </InputGroup>
      </Form>
      <br/>
      <Form inline>
        <InputGroup style={{minWidth:'796px'}}>
          <Col md={3}>
            <ControlLabel>Lagringskontainer</ControlLabel>
          </Col>
          <Col md={3}>
            <DropdownButton bsStyle={'Default'} title='Velg kontainer' id="bg-nested-dropdown">
              <MenuItem eventKey="1">Kapsel</MenuItem>
              <MenuItem eventKey="2">Reagensrør</MenuItem>
              <MenuItem eventKey="2">Glassplate</MenuItem>
            </DropdownButton>
          </Col>
          <Col md={3}>
            <DropdownButton bsStyle={'Default'} title='Velg lagringsmedium' id="bg-nested-dropdown">
              <MenuItem eventKey="1">Etanol</MenuItem>
              <MenuItem eventKey="2">Aceton</MenuItem>
            </DropdownButton>
          </Col>
        </InputGroup>
      </Form>
      <br/>
      <Form inline>
        <InputGroup style={{minWidth:'796px'}}>
          <Col md={3}>
            <ControlLabel>Kommentar</ControlLabel>
          </Col>
          <Col md={9}>
            <FormControl componentClass='textarea' placeholder='Kommentar'/>
          </Col>
        </InputGroup>
      </Form>
    </Form>);
};

export default AddAnalysis;