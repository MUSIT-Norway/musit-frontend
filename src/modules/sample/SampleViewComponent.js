import React from 'react';
import {Form, PageHeader, FormControl, FormGroup, Col, Row, Button, ControlLabel} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Config from '../../config';
import { hashHistory } from 'react-router';


const FieldReadOnly = ({field, label}) => (
  <FormGroup>
    <FormControl.Static>
      <span><b>{label}</b>{`:  ${field}`}</span>
    </FormControl.Static>
  </FormGroup>
);


const SampleViewComponent = (props) => {
  const form = props.form;
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
        <Col md={2}>
          Musno: <b>{ form.museumId.defaultValue || '1234' }</b>
        </Col>
        <Col md={2}>
          Unr: <b>{ form.subNo.defaultValue || '4566b' }</b>
        </Col>
        <Col md={3}>
          Term/artsnavn: <b>{ form.term_species.defaultValue || 'Carex saxatilis'}</b>
        </Col>
        <Col md={2}>
          <Button>Vis Objektet</Button>
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col md={2}>
          <b>PrøveID: </b>66777
        </Col>
      </Row>
      <br/>
      <Row>
        <Col md={2}>
          <ControlLabel>Registrert:</ControlLabel>
        </Col>
        <Col md={4}>
          <FontAwesome name='user'/> {form.registeredBy.defaultValue || 'Line A. Sjo' }
        </Col>
        <Col md={2}>
          <FontAwesome name='clock-o'/> {form.registeredDate.defaultValue || '11.03.2017' }
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <ControlLabel>Sist endret:</ControlLabel>
        </Col>
        <Col md={4}>
          <FontAwesome name='user'/> {form.updateBy.defaultValue || 'Stein Olsen' }
        </Col>
        <Col md={2}>
          <FontAwesome name='clock-o'/> {form.updateDate.defaultValue || '11.03.2017'}
        </Col>
        <Col md={3}>
          <a href=''>Se endringshistorikk</a>
        </Col>
      </Row>
      <br/>
      <hr/>
      <Row className='row-centered'>
        <Col md={2}>
          <FieldReadOnly
            label={'Prøvetype'}
            field={form.sampleType.defaultValue}
          />
        </Col>
        <Col md={3}>
          <FieldReadOnly
            label={'Prøveundertype'}
            field={form.sampleSubType.defaultValue}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={2}>
          <FieldReadOnly
            label={'Status'}
            field={form.status.defaultValue}
          />

        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={3}>
          <FieldReadOnly
            label={'Målvolum/-vekt'}
            field={`${form.size.defaultValue} ${form.sizeUnit.defaultValue}`}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={3}>
          <FieldReadOnly
            label={'Lagringskontainer'}
            field={form.container.defaultValue}
          />
        </Col>
        <Col md={3}>
          <FieldReadOnly
            label={'Lagringsmedium'}
            field={form.storageMedium.defaultValue}
          />
        </Col>
      </Row>
      <br/>
      <Row className='row-centered'>
        <Col md={3}>
          <FieldReadOnly
            label={'Note'}
            field={form.note.defaultValue}
          />
        </Col>
      </Row>
      <Row className='row-centered'>
        <Col md={4}>
          <Button onClick ={()=> {
            hashHistory.push(Config.magasin.urls.client.analysis.editSample(props.params.sampleId));
          }}>
            Endre
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