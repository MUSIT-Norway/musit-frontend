import React from 'react';
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
import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleFormAdd';

const FieldInput = (props) => (
  <FormGroup
    controlId={props.field.name}
    validationState={props.field.status && !props.field.status.valid ? 'error' : null}
  >
    <FormControl value={props.field.value}
                 onChange={(e) => props.onChangeField({name: props.field.name, value: e.target.value })}/>
  </FormGroup>
);

const MemoInput = (props) => (
  <FormGroup
    controlId={props.field.name}
    validationState={props.field.status && !props.field.status.valid ? 'error' : null}
  >
    <FormControl componentClass='textarea' value={props.field.value}
                 placeholder={props.field.name}
                 onChange={(e) => props.onChangeField({name: props.field.name, value: e.target.value })}/>
  </FormGroup>
);


export const SampleComponentAdd = (props) => {
  return (<Form style={{padding: 20}}>
    <PageHeader>
      {props.form.header || 'Registrer prøveuttak'}
    </PageHeader>
    <Row>
      <Col md={12}><b>{'Avledet fra objekt'}</b></Col>
    </Row>
    <Row className='row-centered'>
    <Col md={1}>
      {'Musno: '}<b>{'1234'}</b>
    </Col>
    <Col md={1}>
      {'Unr: '}<b>{props.form.subNo.value || 123344}</b>
    </Col>
    <Col md={2}>
      {'Term/artsnavn: '}<b>{props.form.termSpeciesName.value || 'Carex saxatilis'}</b>
    </Col>
    <Col md={1}><Button>{props.form.showObjectText || 'Vis Objektet'} </Button>
    </Col>
    </Row>
    <br/>
    <br/>
    <hr/>
    <Row>
      <Col md={1}><b>{'PrøveID: '}</b>{props.form.sampleId.value || 66777}</Col>
    </Row>
    <br/>
    <Row>
      <Col md={1}>
        <ControlLabel>Registrert:</ControlLabel>
      </Col>
      <Col md={1}>
        <FontAwesome name='user'/>{' '}
        {props.form.registeredBy.value || 'Per Hansen'}
      </Col>
      <Col md={1}>
        <FontAwesome name='clock-o'/>{' '}
        {props.form.registeredDate.value || '11.03.2017'}
      </Col>
    </Row>
    <br/>
    <Row>
      <Col md={1}>
        <ControlLabel>Sist endret:</ControlLabel>
      </Col>
      <Col md={1}>
        <FontAwesome name='user'/>{' '}
        {props.form.lastModifiedBy.value || 'Line Hansen'}

      </Col>
      <Col md={1}>
        <FontAwesome name='clock-o'/>{' '}
        {props.form.lastModifiedDate.value || '11.03.2017'}
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
        <DropdownButton bsStyle={'default'} title='Velg type' id="bg-nested-dropdown"
                        value={props.form.sampleType.value}>
          <MenuItem eventKey="1">Vev</MenuItem>
          <MenuItem eventKey="2">Blad</MenuItem>
        </DropdownButton>
      </Col>
      <Col md={1}>
        <b>Prøveundertype</b>
      </Col>
      <Col md={1}>
        <DropdownButton bsStyle={'default'} title='Velg type' id="bg-nested-dropdown"
                        value={props.form.sampleSubType.value}>
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
        <DropdownButton bsStyle={'default'} title='Velg type' id="bg-nested-dropdown" value={props.form.status.value}>
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
        <FieldInput field={props.form.sampleVolumeWeight} onChangeField={props.updateForm}/>
      </Col>
      <Col md={1}>
        <DropdownButton bsStyle={'default'} title='Velg måleenhet' id="bg-nested-dropdown"
                        value={props.form.sampleVolumeWeightUnit.value}>
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
        <DropdownButton bsStyle={'default'} title='Velg kontainer' id="bg-nested-dropdown"
                        value={props.form.storingContainer.value}>
          <MenuItem eventKey="1">Kapsel</MenuItem>
          <MenuItem eventKey="2">Reagensrør</MenuItem>
          <MenuItem eventKey="2">Glassplate</MenuItem>
        </DropdownButton>
      </Col>
      <Col md={1}>
        <DropdownButton bsStyle={'default'} title='Velg lagringsmedium' id="bg-nested-dropdown"
                        value={props.form.storingMedium.value}>
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
      <Col md={3
      }>
        <MemoInput field={props.form.sampleNote} onChangeField={props.updateForm}/>
      </Col>
    </Row>
  </Form>);
};

const {form$, updateForm$} = sampleForm;
const data = {form$};
const commands = {updateForm$};
export default inject(data, commands)(SampleComponentAdd);

