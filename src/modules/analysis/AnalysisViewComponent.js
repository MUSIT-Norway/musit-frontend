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
  Panel
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

type Props = { store: any };

function LabelFormat(label, md = 1) {
  return (<Col md={md} style={{ textAlign: 'right', padding: '7px' }}><b>{label}</b></Col>);
}
function FieldGroup({id, label, md = 1, ...props}) {
  return (
    <div id={id}>
      {LabelFormat(label, md)}
      <Col md={2}>
        <FormControl {... props} readOnly/>
      </Col>
    </div>
  );
}

function AddButton({id, label, md, mdOffset = 0, ...props}) {
  return (
    <div id={id}>
      <Col md={md} mdOffset={mdOffset}>
        <Button {... props} disabled>
          <FontAwesome name='plus-circle'/>{' '}
          {label}
        </Button>
      </Col>
    </div>
  );
}
function NewLine() {
  return <Form horizontal><FormGroup />
    <hr/>
  </Form>;
}
const getAnalysisTypeTerm = (store) => {
  let val = '';
  if (store.analysis && store.analysisTypes) {
    const foundType = store.analysisTypes.find((a) => a.id === store.analysis.analysisTypeId);
    if (foundType) {
      val = foundType.name;
    } else {
      val = '';
    }
  } else {
    val = '';
  }
  return val;
};

const getObjectsValue= (store) => {
  let val = '';
  if (store.analysis) {
    if (store.analysis.type === 'AnalysisCollection') {
      val = store.analysis.events.map((a) => {
        return <div>{a.term}</div> ;
      });
    } else {
      val = store.analysis.term;
    }
  } else {
    val = '';
  }
  return val;
};
const getValue = (store, field) => {
  let val = '';
  if (store.analysis) {
    if (store.analysis.type === 'AnalysisCollection' && field !== 'id' && field !== 'registeredByName') {
      val = store.analysis.events[0][field];
    } else {
      val = store.analysis[field];
    }
  } else {
    val = '';
  }
  return val;
};



// TODO rename and convert to stateless function component e.g. ({ label, md = 1}) (curlies)
// TODO and call it like this <LabelFormat label="Label" md={2} /> instead of {labelFormat("Hei", 2)}
const labelFormat = (label, md = 1) => (
  <Col md={md} style={{ textAlign: 'right', padding: '7px' }}>
    <b>{label}</b>
  </Col>
);

const AnalysisView = ({ store } : Props) => (
  <div>
    <br/>
    <PageHeader style={{ paddingLeft: 20 }}>{ I18n.t('musit.analysis.registeringAnalysis') }</PageHeader>
    <Col md={12}>
      <strong>HID:</strong>{' '}{getValue(store, 'id')}
    </Col>
    <Col md={12}>
      <strong>Registrert:</strong>{' '}<FontAwesome name='user'/>{' '}{getValue(store, 'registeredByName')}{' '}
      <FontAwesome name='clock-o'/>{' '}{getValue(store, 'registeredDate')}
    </Col>
    <Col md={12}>
      <strong>Sist endret:</strong>{' '}<FontAwesome name='user'/>{' '}{getValue(store, 'doneBy')}{' '}
      <FontAwesome name='clock-o'/>{' '}{getValue(store, 'eventDate')}{' '}<a >Se endringshistorikk</a>
    </Col>
    <NewLine />
    <Form>
      <FormGroup>
        <FieldGroup
          id="formControlsText"
          type="text"
          label="saksnummer"
          value={getValue(store, 'caseNumber')}
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
    <NewLine />
    <Form inline>
      <Col md={12}><h5><b>Objekt/prøve</b></h5></Col>
      <Col mdOffset={1} md={5}>
        {getObjectsValue(store)}
      </Col>
      <AddButton
        id="2"
        label="Legg til objekt"
        md={11}
        mdOffset={1}
      />
    </Form>
    <NewLine />
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
          value={getValue(store, 'actor')}
        />
        {labelFormat('Rolle', 1)}
        <Col md={1}>
          <FormControl disabled componentClass="select" placeholder="Velg rolle">
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
    <NewLine />
    <FormGroup>
      {labelFormat('Analysested', 1)}
      <Col md={2}>
        <FormControl componentClass="select" disabled placeholder="Velg sted">
          <option value="Velgsted">Velg sted</option>
          <option value="other">...</option>
        </FormControl>
      </Col>
    </FormGroup>
    <NewLine />
    <Well>
      <Form horizontal>
        <FormGroup>
          <FieldGroup
            id="Type analyse"
            md={1}
            type="text"
            label="Type analyse"
            value={getAnalysisTypeTerm(store)}
          />
        </FormGroup>
        <FormGroup>
          <FieldGroup
            id="formControlsText"
            type="text"
            label="Ekstern kilde"
            placeholder="http://www.lenke.no"
            value={getValue(store, 'externalSource')}
          />
          <Col md={2}>
            <Button disabled>Lagre</Button>
          </Col>
        </FormGroup>
        <FormGroup>
          <FieldGroup
            id="formControlsText"
            type="text"
            label="Ladt opp fil"
          />
          <Col md={2}>
            <Button disabled>Bla gjennom</Button>
          </Col>
        </FormGroup>
        <FormGroup>
          {labelFormat('Kommentar / resultat', 1)}
          <Col md={5}>
            <FormControl
              componentClass="textarea"
              placeholder=""
              value={getValue(store, 'comments')}
              readOnly
            />
          </Col>
        </FormGroup>
        <FormGroup>
          {labelFormat('Klausulering', 1)}
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
          <Panel collapsible expanded style={{border:'none', backgroundColor: '#f5f5f5'}}>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Klausulert for"
                placeholder="Fornavn Etternavn"
                value={getValue(store, 'restrictionsFor')}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Årsak til klausulering"
                value={getValue(store, 'reasonForRestrictions')}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Sluttdato"
                value={getValue(store, 'restrictionsEndDate')}
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
                value={getValue(store, 'repealedBy')}
              />
            </FormGroup>
          </Panel>
        </FormGroup>
      </Form>
    </Well>
    <Form horizontal style={{ paddingLeft: 20 }}>
      <FormGroup
      >
        {labelFormat('Kommentar til analysen', 1)}
        <Col md={5}>
          <FormControl
            className="note"
            componentClass="textarea"
            value={getValue(store, 'note')}
            readOnly
          />
        </Col>
      </FormGroup>
      <FormGroup>
        {labelFormat('Avslutt analyse', 1)}
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
    <NewLine />
    <button>
      close
    </button>
    <NewLine />
    <Form horizontal>
      <FormGroup>
        <Col mdOffset={1}><h5><b>Endringshistorikk</b></h5></Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>{getValue(store, 'registeredByName')} - {getValue(store, 'registeredDate')}</Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>{getValue(store, 'doneBy')} - {getValue(store, 'eventDate')}</Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}><a href=''>Se mer</a></Col>
      </FormGroup>
    </Form>
  </div>
);

AnalysisView.propTypes = {
  store: PropTypes.object
};


export default AnalysisView;