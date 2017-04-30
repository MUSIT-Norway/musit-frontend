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
import type { AppSession } from '../../types/appSession';
import type { FormData } from './types/form';
import { hashHistory } from 'react-router';
import Config from '../../config';
import Label from './components/Label';
import FieldGroup from './components/FIeldGroup';
import AddButton from './components/AddButton';
import NewLine from './components/NewLine';

type AnalysisType = { id: number, name: string };

type ObjectData = { uuid: string };

type Store = {
  objectsData: ObjectData[],
  analysisTypes: AnalysisType[]
};

type Params = {
  analysisId?: string
};

type Props = {
  form: FormData,
  updateForm: Function,
  store: Store,
  appSession: AppSession,
  editAnalysisEvent: Function,
  params: Params
};

const getTableRow = (museumNo: ?string, subNo: ?string, term: ?string) => {
  return (
    <tr>
      <td>{museumNo}</td>
      <td>{subNo}</td>
      <td>{term}</td>
    </tr>
  );
};

const getObjectsValue = (form: FormData) => {
  if (form.type.rawValue === 'AnalysisCollection') {
    return form.events.rawValue
      ? form.events.rawValue.map(a => getTableRow(a.museumNo, a.subNo, a.term))
      : [];
  }
  return getTableRow(form.museumNo.rawValue, form.subNo.rawValue, form.term.rawValue);
};

const getValue = field => field.rawValue || '';

export const editAnalysisEventLocal = (
  appSession: AppSession,
  form: FormData,
  editAnalysisEvent: Function,
  params: Params
) =>
  editAnalysisEvent({
    id: params.analysisId,
    museumId: appSession.museumId,
    data: {
      analysisTypeId: getValue(form.analysisTypeId),
      eventDate: getValue(form.registeredDate),
      note: getValue(form.note),
      ...(form.type.rawValue === 'Analysis'
        ? { objectId: form.objectId.rawValue }
        : {
            objectIds: form.events.rawValue
              ? form.events.rawValue.map(a => a.objectId)
              : []
          }),
      restriction: form.restrictions.rawValue
        ? {
            requester: getValue(form.requester),
            expirationDate: getValue(form.expirationDate),
            reason: getValue(form.reason),
            caseNumbers: getValue(form.caseNumbers),
            cancelledBy: getValue(form.cancelledBy),
            cancelledReason: getValue(form.cancelledReason)
          }
        : null
    },
    token: appSession.accessToken
  });

const updateFormField = (field, updateForm) =>
  e =>
    updateForm({
      name: field.name,
      rawValue: e.target.value
    });

const updateFormFieldValue = (field, updateForm, value) =>
  () =>
    updateForm({
      name: field.name,
      rawValue: value
    });

export const goToAnalysis = (
  fn: Promise<*>,
  appSession: AppSession,
  goTo: Function = hashHistory.push
) =>
  fn.then(updated =>
    goTo(Config.magasin.urls.client.analysis.editAnalysis(appSession, updated.id)));

const AnalysisEdit = (
  { params, form, store, updateForm, editAnalysisEvent, appSession }: Props
) => (
  <div>
    <br />
    <PageHeader style={{ paddingLeft: 20 }}>
      {I18n.t('musit.analysis.registeringAnalysis')}
    </PageHeader>
    <Col md={12}>
      <strong>HID:</strong>{' '}{getValue(form.id)}
    </Col>
    <Col md={12}>
      <strong>Registrert:</strong>
      {' '}
      <FontAwesome name="user" />
      {' '}
      {getValue(form.registeredByName)}
      {' '}
      <FontAwesome name="clock-o" />{' '}{getValue(form.registeredDate)}
    </Col>
    <Col md={12}>
      <strong>Sist endret:</strong>
      {' '}
      <FontAwesome name="user" />
      {' '}
      {getValue(form.doneBy)}
      {' '}
      <FontAwesome name="clock-o" />
      {' '}
      {getValue(form.doneDate)}
      {' '}
      <Button bsStyle="link">Se endringshistorikk</Button>
    </Col>
    <NewLine />
    <Form>
      <FormGroup>
        <FieldGroup
          id="formControlsText"
          type="text"
          label="saksnummer"
          value={getValue(form.caseNumber)}
          onChange={updateFormField(form.caseNumber, updateForm)}
        />
      </FormGroup>
      <FormGroup>
        <AddButton id="1" label="Legg til saksnummer" md={5} />
      </FormGroup>
    </Form>
    <NewLine />
    <Form inline>
      <Col md={12}><h5><b>Objekt/prøve</b></h5></Col>
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
            {getObjectsValue(form)}
          </tbody>
        </Table>
      </Col>
      <AddButton id="2" label="Legg til objekt" md={11} mdOffset={1} />
    </Form>
    <NewLine />
    <Form horizontal style={{ paddingLeft: 20 }}>
      <FormGroup>
        <Col md={12}><h5><b>Personer tilknyttet analysen</b></h5></Col>
      </FormGroup>
      <FormGroup>
        <FieldGroup
          id="responsible"
          type="text"
          label="Navn"
          placeholder="Fornavn Etternavn"
          value={getValue(form.responsible)}
          onChange={updateFormField(form.responsible, updateForm)}
        />
        <Label label="Rolle" md={1} />
        <Col md={1}>
          <FormControl componentClass="select" placeholder="Velg rolle">
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
        <FormControl componentClass="select" placeholder="Velg sted">
          <option value="Velgsted">Velg sted</option>
          <option value="other">...</option>
        </FormControl>
      </Col>
    </FormGroup>
    <NewLine />
    <Well>
      <Form horizontal>
        <FormGroup>
          <Label label="Type analyse" md={1} />
          <Col md={2}>
            <FormControl
              componentClass="select"
              placeholder="Velg kategori"
              onChange={updateFormField(form.analysisTypeId, updateForm)}
            >
              <option>Velg kategori</option>
              {store.analysisTypes.map(a => (
                <option
                  key={a.id}
                  value={a.id}
                  selected={form.analysisTypeId.rawValue === a.id}
                >
                  {a.name}
                </option>
              ))}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup>
          <FieldGroup
            id="formControlsText"
            type="text"
            label="Ekstern kilde"
            placeholder="http://www.lenke.no"
            value={getValue(form.externalSource)}
            onChange={updateFormField(form.externalSource, updateForm)}
          />
          <Col md={2}>
            <Button>Lagre</Button>
          </Col>
        </FormGroup>
        <FormGroup>
          <FieldGroup id="formControlsText" type="text" label="Ladt opp fil" />
          <Col md={2}>
            <Button>Bla gjennom</Button>
          </Col>
        </FormGroup>
        <FormGroup>
          <Label label="Kommentar / resultat" md={1} />
          <Col md={5}>
            <FormControl
              componentClass="textarea"
              placeholder=""
              value={getValue(form.comments)}
              onChange={updateFormField(form.comments, updateForm)}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Label label="Klausulering" md={1} />
          <Col md={5}>
            <Radio checked={form.restrictions.rawValue} readOnly inline>
              Ja
            </Radio>
            <Radio inline checked={!form.restrictions.rawValue} readOnly>
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
                id="navn"
                md={1}
                type="text"
                label="Klausulert for"
                placeholder="Fornavn Etternavn"
                value={getValue(form.by)}
                onChange={updateFormField(form.by, updateForm)}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Årsak til klausulering"
                value={getValue(form.reason)}
                onChange={updateFormField(form.reason, updateForm)}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="Saksnummer"
                md={1}
                type="text"
                label="Saksnummer"
                value={getValue(form.caseNumbers)}
                onChange={updateFormField(form.caseNumbers, updateForm)}
              />
            </FormGroup>
            <FormGroup>
              <AddButton id="3" label="Legg til flere saksnummer" md={11} mdOffset={1} />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Sluttdato"
                value={getValue(form.expirationDate)}
                onChange={updateFormField(form.expirationDate, updateForm)}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Opphevet av"
                placeholder="Fornavn Etternavn"
                value={getValue(form.cancelledBy)}
                onChange={updateFormField(form.cancelledBy, updateForm)}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Årsak til oppheving"
                placeholder=""
                value={getValue(form.cancelledReason)}
                onChange={updateFormField(form.cancelledReason, updateForm)}
              />
            </FormGroup>
          </Panel>
        </FormGroup>
      </Form>
    </Well>
    <Form horizontal style={{ paddingLeft: 20 }}>
      <FormGroup
        controlId={form.note.name}
        validationState={form.note.status && !form.note.status.valid ? 'error' : null}
      >
        <Label label="Kommentar til analysen" md={1} />
        <Col md={5}>
          <FormControl
            className="note"
            onChange={updateFormField(form.note, updateForm)}
            componentClass="textarea"
            placeholder={form.note.name}
            value={getValue(form.note)}
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
      onClickSave={() =>
        goToAnalysis(
          editAnalysisEventLocal(appSession, form, editAnalysisEvent, params),
          appSession
        )}
    />
    <NewLine />
    <Form horizontal>
      <FormGroup>
        <Col mdOffset={1}><h5><b>Endringshistorikk</b></h5></Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>
          {getValue(form.registeredBy)} - {getValue(form.registeredDate)}
        </Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>{getValue(form.doneBy)} - {getValue(form.doneDate)}</Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}><Button bsStyle="link">Se mer</Button></Col>
      </FormGroup>
    </Form>
  </div>
);

const FieldShape = {
  name: PropTypes.string.isRequired,
  rawValue: PropTypes.string,
  status: PropTypes.shape({
    valid: PropTypes.bool,
    error: PropTypes.any
  })
};

const FieldShapeBoolean = {
  name: PropTypes.string.isRequired,
  rawValue: PropTypes.bool,
  status: PropTypes.shape({
    valid: PropTypes.bool,
    error: PropTypes.any
  })
};

AnalysisEdit.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.shape(FieldShape).isRequired,
    analysisTypeId: PropTypes.shape(FieldShape).isRequired,
    doneBy: PropTypes.shape(FieldShape).isRequired,
    doneDate: PropTypes.shape(FieldShape).isRequired,
    registeredBy: PropTypes.shape(FieldShape).isRequired,
    registeredDate: PropTypes.shape(FieldShape).isRequired,

    responsible: PropTypes.shape(FieldShape).isRequired,

    administrator: PropTypes.shape(FieldShape).isRequired,
    completedBy: PropTypes.shape(FieldShape).isRequired,
    completedDate: PropTypes.shape(FieldShape).isRequired,
    objectId: PropTypes.shape(FieldShape).isRequired,
    note: PropTypes.shape(FieldShape).isRequired,
    type: PropTypes.shape(FieldShape).isRequired,

    partOf: PropTypes.shape(FieldShape).isRequired,
    result: PropTypes.shape(FieldShape).isRequired,
    place: PropTypes.shape(FieldShape).isRequired,

    externalSource: PropTypes.shape(FieldShape).isRequired,
    comments: PropTypes.shape(FieldShape).isRequired,

    restrictions: PropTypes.shape(FieldShapeBoolean).isRequired,
    requester: PropTypes.shape(FieldShape).isRequired,
    expirationDate: PropTypes.shape(FieldShape).isRequired,
    reason: PropTypes.shape(FieldShape).isRequired,
    caseNumbers: PropTypes.shape(FieldShape).isRequired,
    cancelledBy: PropTypes.shape(FieldShape).isRequired,
    cancelledReason: PropTypes.shape(FieldShape).isRequired,

    completeAnalysis: PropTypes.shape(FieldShapeBoolean).isRequired,
    museumNo: PropTypes.shape(FieldShape).isRequired,
    term: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  editAnalysisEvent: PropTypes.func
};

export default AnalysisEdit;
