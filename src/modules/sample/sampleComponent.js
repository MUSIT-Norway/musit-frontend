import React from 'react';
import {PageHeader, Form, FormGroup, Col, Button, DropdownButton, FormControl, MenuItem, ControlLabel, InputGroup} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const SampleComponentAdd = () => {
  return (
    <div style={{paddingTop: 50}}>
      <PageHeader>{'Registrere prøveuttak'}</PageHeader>
      <Form inline>
        <FormGroup style={{minWidth: '796px'}}>
          <Col md={4}>
            <b>Avledet fra objekt</b>
          </Col>
        </FormGroup>
      </Form>
      <Form inline>
        <FormGroup style={{minWidth: '796px'}}>
          <Col md={2}>
            Musnr: <b>1234</b>
          </Col>
          <Col md={2}>
            Unr: <b>2132</b>
          </Col>
          <Col md={4}>
            Term/artsnavn: <b>Carex saxatilis</b>
          </Col>
          <Col md={2}>
            <Button>Vis objektet</Button>
          </Col>
        </FormGroup>
      </Form>
        <hr/>
      <Form inline>
        <FormGroup style={{minWidth: '796px'}}>
          <Col md={2}><b>PrøveID: </b>1223</Col>
        </FormGroup>
      </Form>
      <Form inline>
        <FormGroup style={{minWidth: '796px'}}>
          <Col md={2}>
            <b>Registrert:</b>
          </Col>
          <Col md={2}>
            <FontAwesome name='user'/>{' '}
            {'Per Hansen'}
          </Col>
          <Col md={2}>
            <FontAwesome name='clock-o'/>{' '}
            {'15.12.2017'}
          </Col>
        </FormGroup>
      </Form>
      <Form inline>
        <FormGroup style={{minWidth: '796px'}}>
          <Col md={2}>
            <b>Sist endret:</b>
          </Col>
          <Col md={2}>
            <FontAwesome name='user'/>{' '}
            {'Per Hansen'}
          </Col>
          <Col md={2}>
            <FontAwesome name='clock-o'/>{' '}
            {'15.12.2017'}
          </Col>
          <Col md={3}>
            <a href=''>Se endringshistorikk</a>
          </Col>
        </FormGroup>
      </Form>
      <hr/>
      <Form inline>
        <InputGroup style={{minWidth:'796px'}}>
          <Col md={4}>
            <b>Prøvetype</b>{' '}
            <DropdownButton bsStyle={'Default'} title='Velg type' id="bg-nested-dropdown">
              <MenuItem eventKey="1">Vev</MenuItem>
              <MenuItem eventKey="2">Blad</MenuItem>
            </DropdownButton>
          </Col>
          <Col md={4}>
            <b>Prøveundertype</b>{' '}
            <DropdownButton bsStyle={'Default'} title='Velg type' id="bg-nested-dropdown">
              <MenuItem eventKey="1">Tallus</MenuItem>
              <MenuItem eventKey="2">Klorofyll</MenuItem>
            </DropdownButton>
          </Col>
        </InputGroup>
      </Form>
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
            <ControlLabel>Prøvevolum/-vekt</ControlLabel>
          </Col>
          <Col md={3}>
            <FormControl type="text" placeholder="Vekt/Volum" />
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

    </div>);
};

export default SampleComponentAdd;

