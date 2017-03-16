import React from 'react';
import {Form, PageHeader, FormControl, FormGroup, Col, Row, Button} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';



const FieldReadOnly = ({field}) => (
  <FormGroup>
    <FormControl.Static>
      {field}
    </FormControl.Static>
  </FormGroup>
  
);


const SampleViewComponent = () => {
  const form = this.props;
  return (
    <Form style={{ padding: 20 }}>
      <PageHeader>
        Prøveuttak
      </PageHeader>
      <Row className='row-centered'>
        <Col md={12}>
          <b>Avledet fra objekt</b>
        </Col>
      </Row>
      <Row className='row-centered'>
        <Col md={1}>
          Musno: <b>{ form.museumId || '1234' }</b>
        </Col>
        <Col md={1}>
          Unr: <b>{ form.subNo || '4566b' }</b>
        </Col>
        <Col md={2}>
          Term/artsnavn: <b>{ form.term_species || 'Carex saxatilis'}</b>
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
          <FontAwesome name='user'/> {form.registeredBy || 'Line A. Sjo' }
        </Col>
        <Col md={1}>
          <FontAwesome name='clock-o'/> {form.registeredDate || '11.03.2017' }
        </Col>
      </Row>
      <Row>
        <Col md={1}>
          <ControlLabel>Sist endret:</ControlLabel>
        </Col>
        <Col md={1}>
          <FontAwesome name='user'/> {form.updateBy || 'Stein Olsen' }
        </Col>
        <Col md={1}>
          <FontAwesome name='clock-o'/> {form.updateDate || '11.03.2017' }
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
          <FieldReadOnly
            field={form.sampleType}
          />
        </Col>
        <Col md={1}>
          <b>Prøveundertype</b>
        </Col>
        <Col md={1}>
          <FieldReadOnly
            field={form.sampleSubType}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <b>Status</b>
        </Col>
        <Col md={1}>
          <FieldReadOnly
            field={form.status}
          />

        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <ControlLabel>Målevolum/-vekt</ControlLabel>
        </Col>
        <Col md={1}>
          <FieldReadOnly
            field={form.sampleSize}
          />
        </Col>
        <Col md={1}>
          <FieldReadOnly
            field={form.sizeUnit}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <ControlLabel>Lagringskontainer</ControlLabel>
        </Col>
        <Col md={1}>
          <FieldReadOnly
            field={form.container}
          />
        </Col>
        <Col md={1}>
          <FieldReadOnly
            field={form.storageMedium}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={1}>
          <ControlLabel>{'Note'}</ControlLabel>
        </Col>
        <Col md={3}>
          <FieldReadOnly
            field={form.note}
          />
        </Col>
      </Row>
      <Row className='row-centered'>
        <Col md={4}>
          <Button>
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


export default SampleViewComponent;