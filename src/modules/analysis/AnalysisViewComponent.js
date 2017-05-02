/* @flow */
import React, { PropTypes } from 'react';
import { I18n } from 'react-i18nify';
import {
  Radio,
  PageHeader,
  Form,
  FormGroup,
  Col,
  Well,
  Table,
  Panel
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { SaveCancel } from '../../components/formfields/index';
import { hashHistory } from 'react-router';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { FormData } from './types/form';
import Label from './components/Label';
import NewLine from './components/NewLine';

type AnalysisType = { id: number, name: string };

type ObjectData = { uuid: string };

type Store = {
  objectsData: ObjectData[],
  analysisTypes: AnalysisType[]
};

type Params = {
  analysisId: string
};

type Props = { form: FormData, store: Store, appSession: AppSession, params: Params };

const getAnalysisTypeTerm = (form, store) => {
  if (form.analysisTypeId.rawValue && store.analysisTypes) {
    const foundType = store.analysisTypes.find(
      a => a.id === form.analysisTypeId.rawValue
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

const FieldGroup = ({ id, label, md, value }) => (
  <div id={id}>
    <Label label={label} md={md} />
    <Col md={2}>
      {value}
    </Col>
  </div>
);

FieldGroup.defaultProps = {
  md: 1
};
const getObjectsValue = form => {
  if (form.type.rawValue === 'AnalysisCollection') {
    return form.events.rawValue ? form.events.rawValue.map(getTableRow) : [];
  }
  return getTableRow({
    museumNo: form.museumNo.rawValue,
    subNo: form.subNo.rawValue,
    term: form.term.rawValue
  });
};

const getValue = (form, field) => form[field] ? form[field].rawValue || '' : '';

const AnalysisView = ({ form, store, appSession, params }: Props) => (
  <div>
    <br />
    <PageHeader style={{ paddingLeft: 20 }}>
      {I18n.t('musit.analysis.registeringAnalysis')}
    </PageHeader>
    <Col md={12}>
      <strong>Registrert:</strong>
      {' '}
      <FontAwesome name="user" />
      {' '}
      {getValue(form, 'registeredByName')}
      {' '}
      <FontAwesome name="clock-o" />{' '}{getValue(form, 'registeredDate')}
    </Col>
    <Col md={12}>
      <strong>Sist endret:</strong>
      {' '}
      <FontAwesome name="user" />
      {' '}
      {getValue(form, 'doneBy')}
      {' '}
      <FontAwesome name="clock-o" />
      {' '}
      {getValue(form, 'eventDate')}
    </Col>
    <NewLine />
    <Form horizontal style={{ paddingLeft: 10 }}>
      <FormGroup>
        <Label label="Type analyse" md={1} />
        <Col md={11}>
          {getAnalysisTypeTerm(form, store)}
        </Col>
      </FormGroup>
      <FormGroup>
        <Label label="Analysested" md={1} />
        <Col md={2} />
      </FormGroup>
      <FormGroup>
        <FieldGroup
          id="formControlsText"
          label="saksnummer"
          value={getValue(form, 'caseNumber')}
        />
      </FormGroup>
      <FormGroup>
        <Label label="Kommentar til analysen" md={1} />
        <Col md={5}>
            {getValue(form, 'note')}
        </Col>
      </FormGroup>
      <FormGroup>
        <Col md={12}><h5><strong>Personer tilknyttet analysen</strong></h5></Col>
      </FormGroup>
      <FormGroup>
        <FieldGroup id="navn" label="Navn" value={getValue(form, 'actor')} />
        <Label label="Rolle" md={1} />
        <Col md={2} />
      </FormGroup>
    </Form>
    <NewLine />
    <Well>
      <Form horizontal>
        <FormGroup>
          <Col md={1}>
            <h5><strong>Objekt/prøve</strong></h5>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col md={11} mdOffset={1}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Museumsnr</th>
                  <th>Unr</th>
                  <th>Term/artsnavn</th>
                </tr>
              </thead>
              <tbody>
                {getObjectsValue(form)}
              </tbody>
            </Table>
          </Col>
        </FormGroup>
        <NewLine />
        <FormGroup>
          <FieldGroup
            id="formControlsText"
            label="Ekstern kilde"
            value={getValue(form, 'externalSource')}
          />
        </FormGroup>
        <FormGroup>
          <FieldGroup id="formControlsText" label="Ladt opp fil" />
        </FormGroup>
        <FormGroup>
          <Label label="Kommentar / resultat" md={1} />
          <Col md={5}>
            {getValue(form, 'comments')}
          </Col>
        </FormGroup>
        <FormGroup>
          <Label label="Klausulering" md={1} />
          <Col md={5}>
            <Radio defaultChecked={form.restrictions.rawValue} readOnly inline>
              Ja
            </Radio>
            <Radio inline defaultChecked={!form.restrictions.rawValue} readOnly>
              Nei
            </Radio>
          </Col>
        </FormGroup>
        {form.restrictions.rawValue &&
          <FormGroup>
            <Panel
              collapsible
              expanded
              style={{ border: 'none', backgroundColor: '#f5f5f5' }}
            >
              <FormGroup>
                <FieldGroup
                  id="requester"
                  md={1}
                  label="Klausulert for"
                  value={getValue(form, 'requester')}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="reason"
                  label="Årsak til klausulering"
                  value={getValue(form, 'reason')}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="Saksnummer"
                  label="Saksnummer"
                  value={getValue(form, 'caseNumbers')}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="expirationDate"
                  label="Sluttdato"
                  value={getValue(form, 'expirationDate')}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="cancelledBy"
                  label="Opphevet av"
                  value={getValue(form, 'cancelledBy')}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="cancelledReason"
                  label="Årsak til oppheving"
                  value={getValue(form, 'cancelledReason')}
                />
              </FormGroup>
            </Panel>
          </FormGroup>}
      </Form>
    </Well>
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
  </div>
);

AnalysisView.propTypes = {
  store: PropTypes.object
};

export default AnalysisView;
