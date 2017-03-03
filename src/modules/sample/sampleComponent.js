import React from 'react';
import {PageHeader, Form, FormGroup, Col, Button, DropdownButton, FormControl, MenuItem, ControlLabel, InputGroup} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

export const SampleComponentAdd = (props) => {
  return (<Form style={{padding: 20}}>
    <PageHeader>
      {props.header || 'Registrer prøveuttak'}
    </PageHeader>
    <FormGroup>
      <Col md={12}><b>{'Avledet fra objekt'}</b></Col>
    </FormGroup>
    <FormGroup>
       <Col md={1}>
         {'Musnr: '}<b>{props.musnr || 12345}</b>
       </Col>
      <Col md={1}>
        {'Unr: '}<b>{props.musnr || 56789}</b>
       </Col>
      <Col md={2}>
        {'Term/artsnavn: '}<b>{props.term_species || 'Carex saxatilis'}</b>
      </Col>
      <Col md={1}><Button>{props.showObjectText||'Vis Objektet'} </Button>
      </Col>
    </FormGroup>
    <br/>
    <br/>
    <hr/>
    <FormGroup>
      <Col md={1}><b>{'PrøveID: '}</b>{props.sampleID||66777}</Col>
    </FormGroup>
    <br/>
    <FormGroup>
      <Col md={1}>
        <ControlLabel>Registrert:</ControlLabel>
      </Col>
      <Col md={1}>
        <FontAwesome name='user'/>{' '}
        {'Per Hansen'}
      </Col>
      <Col md={1}>
        <FontAwesome name='clock-o'/>{' '}
        {'15.12.2017'}
      </Col>
    </FormGroup>
    <br/>
    <FormGroup>
      <Col md={1}>
        <ControlLabel>Sist endret:</ControlLabel>
      </Col>
      <Col md={1}>
        <FontAwesome name='user'/>{' '}
        {'Per Hansen'}
      </Col>
      <Col md={1}>
        <FontAwesome name='clock-o'/>{' '}
        {'15.12.2017'}
      </Col>
      <Col md={2}>
        <a href=''>Se endringshistorikk</a>
      </Col>
    </FormGroup>
    <br/>
    <hr/>
    <InputGroup>
      <Col md={3}>
        <b>Prøvetype</b>
      </Col>
      <Col md={3}>
        <DropdownButton bsStyle={'Default'} title='Velg type' id="bg-nested-dropdown">
          <MenuItem eventKey="1">Vev</MenuItem>
          <MenuItem eventKey="2">Blad</MenuItem>
        </DropdownButton>
      </Col>
      <Col md={3}>
        <b>Prøveundertype</b>
      </Col>
      <Col md={3}>
        <DropdownButton bsStyle={'Default'} title='Velg type' id="bg-nested-dropdown">
          <MenuItem eventKey="1">Tallus</MenuItem>
          <MenuItem eventKey="2">Klorofyll</MenuItem>
        </DropdownButton>
      </Col>
    </InputGroup>
    <br/>
    <InputGroup>
      <Col md={3}>
        <b>Status</b>
      </Col>
      <Col md={3}>
        <DropdownButton bsStyle={'Default'} title='Velg type' id="bg-nested-dropdown">
          <MenuItem eventKey="1">Skilt</MenuItem>
          <MenuItem eventKey="2">Gift</MenuItem>
        </DropdownButton>
      </Col>
    </InputGroup>
    <br/>
    <InputGroup>
      <Col md={4}>
        <ControlLabel>Prøvevolum/-vekt</ControlLabel>
      </Col>
      <Col md={4}>
        <FormControl type="text" placeholder="Vekt/Volum" />
      </Col>
      <Col md={4}>
        <DropdownButton bsStyle={'Default'} title='Velg måleenhet' id="bg-nested-dropdown">
          <MenuItem eventKey="1">Gr</MenuItem>
          <MenuItem eventKey="2">Liter</MenuItem>
        </DropdownButton>
      </Col>
    </InputGroup>
    <br/>
    <InputGroup>
      <Col md={4}>
        <ControlLabel>Lagringskontainer</ControlLabel>
      </Col>
      <Col md={4}>
        <DropdownButton bsStyle={'Default'} title='Velg kontainer' id="bg-nested-dropdown">
          <MenuItem eventKey="1">Kapsel</MenuItem>
          <MenuItem eventKey="2">Reagensrør</MenuItem>
          <MenuItem eventKey="2">Glassplate</MenuItem>
        </DropdownButton>
      </Col>
      <Col md={4}>
        <DropdownButton bsStyle={'Default'} title='Velg lagringsmedium' id="bg-nested-dropdown">
          <MenuItem eventKey="1">Etanol</MenuItem>
          <MenuItem eventKey="2">Aceton</MenuItem>
        </DropdownButton>
      </Col>
    </InputGroup>
<br/>
    <InputGroup>
      <Col md={3}>
        <ControlLabel>Kommentar</ControlLabel>
      </Col>
      <Col md={9}>
        <FormControl componentClass='textarea' placeholder='Kommentar'/>
      </Col>
    </InputGroup>
  </Form>);
};


export default SampleComponentAdd;

