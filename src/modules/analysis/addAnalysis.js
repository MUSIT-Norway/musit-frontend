import React from 'react';
import {
  Radio,
  PageHeader,
  Form,
  FormGroup,
  Col,
  FormControl,
  Button,
  Well

} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';


function FieldGroup({id, label, ...props}) {
  return (
    <div controlId={id}>
      <Col md={1}><b>{label}</b></Col>
      <Col md={2}>
        <FormControl {... props} />
      </Col>
    </div>
  );
}

function AddButton({id, label, md, ...props}) {
  return (
    <FormGroup controlId={id}>
      <Col md={md}>
        <Button {... props}>
          <FontAwesome name='plus-circle'/>{' '}
          {label}
        </Button>
      </Col>
    </FormGroup>
  );
}
function newLine() {
  return <Form horizontal><FormGroup />
    <hr/>
  </Form>;
}

const AddAnalysis = () => {
  return (
    <div>
      <br/>
      <PageHeader>{'Registrere analyse'}</PageHeader>
      <Form>
        <FormGroup>
          <Col md={12}><b> HID:: </b>123</Col>
          <Col md={1}><b>Registrert:</b></Col>
          <Col md={1}><FontAwesome name='user'/>{' '}
            Per Hansen
          </Col>
          <Col md={10}>
            <FontAwesome name='clock-o'/>{' '}
            15.12.2017
          </Col>
          <Col md={1}><b>Sist endret:</b></Col>
          <Col md={1}><FontAwesome name='user'/>{' '}Per Hansen</Col>
          <Col md={1}><FontAwesome name='clock-o'/>{' '}15.12.2017</Col>
          <Col md={9}><a href=''>Se endringshistorikk</a></Col>
        </FormGroup>
      </Form>
      {newLine()}
      <from inline>
        <FieldGroup
          id="formControlsText"
          type="text"
          label="saksnummber"
        />
        <AddButton
          id="1"
          label="Legg til saksnummer"
          md={5}
        />
      </from>
      {newLine()}

      <from>
        <Col md={12}><b>Objekt</b></Col>
        <Col md={1}>Nuseumsnr: <b>1234 </b></Col>
        <Col md={1}>Unt: <b>12345678911</b></Col>
        <Col md={10}>Term/artsnavn: <b>Kniv</b></Col>
        <AddButton
          id="2"
          label="Legg til objekt"
          md={12}
        />
      </from>
      {newLine()}
      <Form>

        <FormGroup>
          <Col md={12}>
            <b>Personer tilknyttet analysen</b>
          </Col>
        </FormGroup>
        <FieldGroup
          id="navn"
          type="text"
          label="Navn"
          placeholder="Fornavn Etternavn"
        />
        <FormGroup>
          <Col md={7}>
            <b>Rolle</b>{' '}
            <Radio inline>
              Ansvarlig
            </Radio>
            {' '}
            <Radio inline>
              Administrert av
            </Radio>
          </Col>
        </FormGroup>
        <AddButton
          id="3"
          label="Legg til person"
          md={12}
        />
      </Form>
      {newLine()}

      <FormGroup>
        <Col md={1}>
          <b>Analysested</b>
        </Col>
        <Col md={2}>
          <FormControl componentClass="select" placeholder="Velg sted">
            <option value="Velgsted">Velg sted</option>
            <option value="other">...</option>
          </FormControl>
        </Col>
      </FormGroup>
      {newLine()}
      <Well>
        <Form horizontal>
          <FormGroup>
            <Col md={1}>
              <b>Type analyse</b>
            </Col>
            <Col md={2}>
              <FormControl componentClass="select" placeholder="Velg kategori">
                <option value="select">Velg kategori</option>
                <option value="other">...</option>
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="Ekstern kilde"
              placeholder="http://www.lenke.no"
            />
            <Col md={2}>
              <Button>Lagre</Button>
            </Col>
          </FormGroup>
          <FormGroup>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="Ladt opp fil"
            />
            <Col md={2}>
              <Button>Bla gjennom</Button>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col md={1}>
              <b>Kommentar / resultat</b>
            </Col>
            <Col md={4}>
              <FormControl componentClass="textarea" placeholder="" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col md={1}>
              <b>Klausulering</b>
            </Col>
            <Col md={5}>
              <Radio  readOnly inline>
                Ja
              </Radio>
              <Radio inline checked readOnly>
                Nei
              </Radio>
            </Col>
          </FormGroup>

        </Form>
      </Well>
      <FormGroup>
        <Col md={1}>
          <b>Avslutt analyse</b>
        </Col>
        <Col md={5}>
          <Radio checked inline>
            Ja
          </Radio>
          <Radio inline  checked readOnly>
            Nei
          </Radio>
        </Col>
      </FormGroup>


    </div>);
};

export default AddAnalysis;