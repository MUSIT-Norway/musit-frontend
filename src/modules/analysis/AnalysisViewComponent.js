/* @flow */
import React, { PropTypes } from 'react';
import { I18n } from 'react-i18nify';
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


type Props = { store: any };

function LabelFormat(label, md = 1) {
  return (<Col md={md} style={{ textAlign: 'right', padding: '7px' }}><b>{label}</b></Col>);
}
function FieldGroup({id, label, md = 1, ...props}) {
  return (
    <div id={id}>
      {LabelFormat(label, md)}
      <Col md={2}>
        <FormControl {... props} />
      </Col>
    </div>
  );
}

function AddButton({id, label, md, mdOffset = 0, ...props}) {
  return (
    <div id={id}>
      <Col md={md} mdOffset={mdOffset}>
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

const AnalysisView = ({ store } : Props) => {
  return (
    <div>
      <br/>
      <PageHeader style={{ paddingLeft: 20 }}>{ I18n.t('musit.analysis.registeringAnalysis') }</PageHeader>
      <Form>
        <FormGroup>
          {LabelFormat('HID:', 1)}
          <Col style={{ padding: '7px' }}>123</Col>
          {LabelFormat('Registrert:', 1)}
          <Col md={1} style={{ padding: '7px' }}><FontAwesome name='user'/>{' '}
            Per Hansen
          </Col>
          <Col md={10} style={{ padding: '7px' }}>
            <FontAwesome name='clock-o'/>{' '}
            15.12.2017
          </Col>
          {LabelFormat('Sist endret:', 1)}
          <Col md={1} style={{ padding: '7px' }}><FontAwesome name='user'/>{' '}Per Hansen</Col>
          <Col md={1} style={{ padding: '7px' }}><FontAwesome name='clock-o'/>{' '}15.12.2017</Col>
          <Col md={9} style={{ padding: '7px' }}><a href=''>Se endringshistorikk</a></Col>
        </FormGroup>
      </Form>
      {newLine()}
      <Form>
        <FormGroup>
          <FieldGroup
            id="formControlsText"
            type="text"
            label="saksnummber"
          />
        </FormGroup>
        <FormGroup>
          <AddButton
            id="1"
            label="Legg til saksnummer"
            md={5}
          />
        </FormGroup>
      </Form>
      {newLine()}

      <Form inline>
        <Col md={12}><h5><b>Objekt/prøve</b></h5></Col>
        <Col mdOffset={1} md={5}>
          <Table bordered>
            <thead>
            <tr>
              <th>Museumsnr</th>
              <th>Unt</th>
              <th>Term/artsnavn</th>
            </tr>
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
          md={11}
          mdOffset={1}
        />
      </Form>
      {newLine()}
      <Form horizontal style={{ paddingLeft: 20 }}>

        <FormGroup>
          <Col md={12}><h5><b>Personer tilknyttet analysen</b></h5></Col>
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
              <Radio checked readOnly inline>
                Ja
              </Radio>
              <Radio inline readOnly>
                Nei
              </Radio>
            </Col>
          </FormGroup>
          <FormGroup>
            <Panel collapsible expanded={expanded} style={{border:'none', backgroundColor: '#f5f5f5'}}>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Klausulert for"
                  placeholder="Fornavn Etternavn"
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Årsak til klausulering"
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Sluttdato"
                  value="15.02.2017"
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
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
        <FormGroup
        >
          {LabelFormat('Kommentar til analysen', 1)}
          <Col md={5}>
            <FormControl
              className="note"
              componentClass="textarea"
              value={store.data && store.data.analysis && store.data.analysis.note && store.data.analysis.note || ''}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          {LabelFormat('Avslutt analyse', 1)}
          <Col md={5}>
            <Radio inline readOnly>
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
      {newLine()}
      <Form horizontal>
        <FormGroup>
          <Col mdOffset={1}><h5><b>Endringshistorikk</b></h5></Col>
        </FormGroup>
        <FormGroup>
          <Col mdOffset={1}>PerHansen- 15.02.2017</Col>
        </FormGroup>
        <FormGroup>
          <Col mdOffset={1}>PerHansen- 15.02.2017</Col>
        </FormGroup>
        <FormGroup>
          <Col mdOffset={1}><a href=''>Se mer</a></Col>
        </FormGroup>
      </Form>
    </div>);
};


AnalysisView.propTypes = {
  store: PropTypes.object
};


export default AnalysisView;