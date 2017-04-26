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
import { SaveCancel } from '../../components/formfields/index';
import { hashHistory } from 'react-router';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { Analysis, AnalysisType } from './types/analysis';
import Label from './components/Label';
import FieldGroup from './components/FIeldGroup';
import AddButton from './components/AddButton';
import NewLine from './components/NewLine';

type ObjectData = { uuid: string };

type Store = {
  objectsData: ObjectData[],
  analysisTypes: AnalysisType[],
  analysis: Analysis
};

type Params = {
  analysisId: string
};

type Props = { store: Store, appSession: AppSession, params: Params };

const getAnalysisTypeTerm = store => {
  if (store.analysis && store.analysisTypes) {
    const foundType = store.analysisTypes.find(
      a => a.id === store.analysis.analysisTypeId
    );
    return foundType ? foundType.name : '';
  }
};

const getTableRow = a => {
  return (
    <tr>
      <td>{a.museumNo}</td>
      <td>{a.subNo}</td>
      <td>{a.term}</td>
    </tr>
  );
};
const getObjectsValue = store => {
  if (store.analysis) {
    if (store.analysis.type === 'AnalysisCollection') {
      return store.analysis.events.map(a => getTableRow(a));
    }
    return getTableRow(store.analysis);
  }
  return '';
};
const getValue = (store, field) => store.analysis ? store.analysis[field] : '';

const AnalysisView = ({ store, appSession, params }: Props) => (
  <div>
    <br />
    <PageHeader style={{ paddingLeft: 20 }}>
      {I18n.t('musit.analysis.registeringAnalysis')}
    </PageHeader>
    <Col md={12}>
      <strong>HID:</strong>{' '}{getValue(store, 'id')}
    </Col>
    <Col md={12}>
      <strong>Registrert:</strong>
      {' '}
      <FontAwesome name="user" />
      {' '}
      {getValue(store, 'registeredByName')}
      {' '}
      <FontAwesome name="clock-o" />{' '}{getValue(store, 'registeredDate')}
    </Col>
    <Col md={12}>
      <strong>Sist endret:</strong>
      {' '}
      <FontAwesome name="user" />
      {' '}
      {getValue(store, 'doneBy')}
      {' '}
      <FontAwesome name="clock-o" />
      {' '}
      {getValue(store, 'eventDate')}
      {' '}
      <a>Se endringshistorikk</a>
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
        <AddButton id="1" label="Legg til saksnummer" md={5} />
      </FormGroup>
    </Form>
    <NewLine />
    <Form inline>
      <Col md={12}><h5><strong>Objekt/prøve</strong></h5></Col>
      <Col mdOffset={1} md={5}>
        <Table responsive>
          <thead>
            <tr>
              <th>Museumsnr</th>
              <th>Unr</th>
              <th>Term/artsnavn</th>
            </tr>
          </thead>
          <tbody>
            {getObjectsValue(store)}
          </tbody>
        </Table>
      </Col>
      <AddButton id="2" label="Legg til objekt" md={11} mdOffset={1} />
    </Form>
    <NewLine />
    <Form horizontal style={{ paddingLeft: 20 }}>
      <FormGroup>
        <Col md={12}><h5><strong>Personer tilknyttet analysen</strong></h5></Col>
      </FormGroup>
      <FormGroup>
        <FieldGroup
          id="navn"
          type="text"
          label="Navn"
          placeholder="Fornavn Etternavn"
          value={getValue(store, 'actor')}
        />
        <Label label="Rolle" md={1} />
        <Col md={1}>
          <FormControl disabled componentClass="select" placeholder="Velg rolle">
            <option value="Velgsted">Velg rolle</option>
            <option value="other">...</option>
          </FormControl>
        </Col>
        <AddButton id="3" label="Legg til person" md={2} />
      </FormGroup>
    </Form>
    <NewLine />
    <FormGroup>
      <Label label="Analysested" md={1} />
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
          <FieldGroup id="formControlsText" type="text" label="Ladt opp fil" />
          <Col md={2}>
            <Button disabled>Bla gjennom</Button>
          </Col>
        </FormGroup>
        <FormGroup>
          <Label label="Kommentar / resultat" md={1} />
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
          <Label label="Klausulering" md={1} />
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
          <Panel
            collapsible
            expanded
            style={{ border: 'none', backgroundColor: '#f5f5f5' }}
          >
            <FormGroup>
              <FieldGroup
                id="by"
                md={1}
                type="text"
                label="Klausulert for"
                placeholder="Fornavn Etternavn"
                value={getValue(store, 'by')}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="reason"
                md={1}
                type="text"
                label="Årsak til klausulering"
                value={getValue(store, 'reason')}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="Saksnummer"
                md={1}
                type="text"
                label="Saksnummer"
                value={getValue(store, 'caseNumbers')}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="expirationDate"
                md={1}
                type="text"
                label="Sluttdato"
                value={getValue(store, 'expirationDate')}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="cancelledBy"
                md={1}
                type="text"
                label="Opphevet av"
                placeholder="Fornavn Etternavn"
                value={getValue(store, 'cancelledBy')}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="cancelledReason"
                md={1}
                type="text"
                label="Årsak til oppheving"
                placeholder="Årsak til oppheving"
                value={getValue(store, 'cancelledReason')}
              />
            </FormGroup>
          </Panel>
        </FormGroup>
      </Form>
    </Well>
    <Form horizontal style={{ paddingLeft: 20 }}>
      <FormGroup>
        <Label label="Kommentar til analysen" md={1} />
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
        <Label label="Avslutt analyse" md={1} />
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
    <SaveCancel
      onClickSave={e => {
        e.preventDefault();
        hashHistory.push(
          Config.magasin.urls.client.analysis.editAnalysis(appSession, params.analysisId)
        );
      }}
      saveLabel="Endre"
    />
    <NewLine />
    <Form horizontal>
      <FormGroup>
        <Col mdOffset={1}><h5><strong>Endringshistorikk</strong></h5></Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>
          {getValue(store, 'registeredByName')} - {getValue(store, 'registeredDate')}
        </Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>
          {getValue(store, 'doneBy')} - {getValue(store, 'eventDate')}
        </Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}><Button bsStyle="link">Se mer</Button></Col>
      </FormGroup>
    </Form>
  </div>
);

AnalysisView.propTypes = {
  store: PropTypes.object
};

export default AnalysisView;
