import React from 'react';
import {
  Radio,
  PageHeader,
  Form,
  FormGroup,
  Col,
  FormControl,
  Button,
  Well,
  Table,
  Panel

} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import {SaveCancel} from '../../components/formfields/index';

function LabelFormat(label, md = 1) {
  return (<Col md={md} style={{ textAlign: 'right', padding: '10px' }}><b>{label}</b></Col>);
}
function FieldGroup({id, label, md = 1, ...props}) {
  return (
    <div controlId={id}>
      {LabelFormat(label, md)}
      <Col md={2}>
        <FormControl {... props} />
      </Col>
    </div>
  );
}

function AddButton({id, label, md, ...props}) {
  return (
    <div controlId={id}>
      <Col md={md}>
        <Button {... props}>
          <FontAwesome name='plus-circle'/>{' '}
          {label}
        </Button>
      </Col>
    </div>
  );
}
function newLine() {
  return <Form horizontal><FormGroup />
    <hr/>
  </Form>;
}

const expanded = true;

const AddAnalysis = () => {
  return (
    <div>
      <br/>
      <PageHeader style={{ paddingLeft: 20 }}>{'Registrere analyse'}</PageHeader>
      <Form>
        <FormGroup>
          <Col sm={12} md={12}><b> HID: </b>123</Col>
          <Col sm={1} md={1}><b>Registrert:</b></Col>
          <Col sm={1} md={1}><FontAwesome name='user'/>{' '}
            Per Hansen
          </Col>
          <Col sm={10} md={10}>
            <FontAwesome name='clock-o'/>{' '}
            15.12.2017
          </Col>
          <Col sm={1} md={1}><b>Sist endret:</b></Col>
          <Col sm={1} md={1}><FontAwesome name='user'/>{' '}Per Hansen</Col>
          <Col sm={1} md={1}><FontAwesome name='clock-o'/>{' '}15.12.2017</Col>
          <Col sm={9} md={9}><a href=''>Se endringshistorikk</a></Col>
        </FormGroup>
      </Form>
      {newLine()}
      <Form inline>
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
      </Form>
      {newLine()}

      <Form inline>
        <Col md={12}><b>Objekt</b></Col>
        <Col md={6}>
          <Table bordered>
            <thead>
            <th>Museumsnr</th>
            <th>Unt</th>
            <th>Term/artsnavn</th>
            </thead>
            <tbody>
            <tr>
              <td>1234</td>
              <td>12345678911</td>
              <td>Spyd</td>
            </tr>
            <tr>
              <td>2345</td>
              <td>12345678912</td>
              <td>Beltering</td>
            </tr>
            <tr>
              <td>3455</td>
              <td>12345678911</td>
              <td>Øsekar</td>
            </tr>
            </tbody>
          </Table>
        </Col>
        <AddButton
          id="2"
          label="Legg til objekt"
          md={12}
        />
      </Form>
      {newLine()}
      <Form horizontal style={{ paddingLeft: 20 }}>

        <FormGroup>
          <Col md={12}>
            <b>Personer tilknyttet analysen</b>
          </Col>
        </FormGroup>
        <FormGroup>
          <FieldGroup
            id="navn"
            type="text"
            label="Navn"
            placeholder="Fornavn Etternavn"
          />
          {LabelFormat('Rolle', 1)}
          <Col md={1}>
            <FormControl componentClass="select" placeholder="Velg rolle">
              <option value="Velgsted">Velg rolle</option>
              <option value="other">...</option>
            </FormControl>
          </Col>
          <AddButton
            id="3"
            label="Legg til person"
            md={2}
          />
        </FormGroup>
      </Form>
      {newLine()}

      <FormGroup>
        {LabelFormat('Analysested', 1)}
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
            {LabelFormat('Type analyse', 1)}
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
            {LabelFormat('Kommentar / resultat', 1)}
            <Col md={5}>
              <FormControl componentClass="textarea" placeholder=""/>
            </Col>
          </FormGroup>
          <FormGroup>
            {LabelFormat('Klausulering', 1)}
            <Col md={5}>
              <Radio readOnly inline>
                Ja
              </Radio>
              <Radio inline checked readOnly>
                Nei
              </Radio>
            </Col>
          </FormGroup>
          <FormGroup>
            <Panel collapsible expanded={expanded} style={{border:'none', backgroundColor: '#f5f5f5'}}>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={2}
                  type="text"
                  label="Klausulert for"
                  placeholder="Fornavn Etternavn"
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={2}
                  type="text"
                  label="Årsak til klausulering"
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={2}
                  type="text"
                  label="Sluttdato"
                  value="15.02.2017"
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={2}
                  type="text"
                  label="Opphevet av"
                  placeholder="Fornavn Etternavn"
                />
              </FormGroup>
            </Panel>
          </FormGroup>

        </Form>
      </Well>
      <Form horizontal style={{ paddingLeft: 20 }}>
        <FormGroup>
          {LabelFormat('Kommentar til analysen', 1)}
          <Col md={5}>
            <FormControl componentClass="textarea" placeholder=""/>
          </Col>
        </FormGroup>
        <FormGroup>
          {LabelFormat('Avslutt analyse', 1)}
          <Col md={5}>
            <Radio checked inline>
              Ja
            </Radio>
            <Radio inline checked readOnly>
              Nei
            </Radio>
          </Col>
        </FormGroup>
      </Form>


      {newLine()}
      <SaveCancel/>


    </div>);
};

export default AddAnalysis;