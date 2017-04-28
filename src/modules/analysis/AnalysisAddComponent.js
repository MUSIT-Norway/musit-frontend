/* @flow */
import React, { PropTypes } from 'react';
import { I18n } from 'react-i18nify';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  PageHeader,
  Panel,
  Radio,
  Well
} from 'react-bootstrap';
import { SaveCancel } from '../../components/formfields/index';
import { hashHistory } from 'react-router';
import Config from '../../config';
import type { AppSession } from '../../types/appSession';
import type { FormData, Update } from './types/form';
import type { ObjectData } from '../../types/object';
import Label from './components/Label';
import FieldGroup from './components/FIeldGroup';
import AddButton from './components/AddButton';
import NewLine from './components/NewLine';
import { Table } from 'reactable';
import { isEmpty, isString } from 'lodash';

type Location = {
  state?: Array<ObjectData>
};

type AnalysisType = { id: number, name: string };

type Store = {
  analysisTypes: Array<AnalysisType>
};

type Props = {
  form: FormData,
  updateForm: Update,
  store: Store,
  appSession: AppSession,
  saveAnalysisEvent: Function,
  location: Location
};

const getValue = field => field.rawValue || '';
const getApiValue = field =>
  isString(field.rawValue) && !isEmpty(field.rawValue.trim()) ? field.rawValue : null;

export const saveAnalysisEventLocal = (
  appSession: AppSession,
  form: FormData,
  location?: Location,
  saveAnalysisEvent: Function
) => {
  const data = {
    analysisTypeId: getApiValue(form.analysisTypeId),
    note: getApiValue(form.note),
    responsible: getApiValue(form.responsible),
    objectIds: location && location.state ? location.state.map(a => a.uuid) : [],
    // caseNumbers: getApiValue(form.caseNumbers),
    status: 1
  };
  if (form.restrictions.value) {
    data['restrictions'] = {
      requester: getApiValue(form.by),
      expiration: getApiValue(form.expirationDate),
      reason: getApiValue(form.reason)
    };
  }
  return saveAnalysisEvent({
    museumId: appSession.museumId,
    data: data,
    token: appSession.accessToken
  });
};

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
  fn: Promise<string>,
  appSession: AppSession,
  goTo: Function = hashHistory.push
) =>
  fn.then((analysisId: string) =>
    goTo(Config.magasin.urls.client.analysis.viewAnalysis(appSession, analysisId)));

const AnalysisAdd = (
  { form, updateForm, store, saveAnalysisEvent, appSession, location }: Props
) => (
  <div>
    <br />
    <PageHeader style={{ paddingLeft: 20 }}>
      {I18n.t('musit.analysis.registeringAnalysis')}
    </PageHeader>
    <Form>
      <FormGroup>
        <FieldGroup
          id="formControlsText"
          type="text"
          label="Saksnummer"
          value={getValue(form.caseNumbers)}
          onChange={updateFormField(form.caseNumbers, updateForm)}
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
        <Table
          className="table"
          columns={[
            { key: 'museumNo', label: 'Museumsnr' },
            { key: 'subNo', label: 'Unr' },
            { key: 'term', label: 'Term/artsnavn' }
          ]}
          data={location ? location.state || [] : []}
          sortable={['museumNumber', 'subNumber', 'term']}
          noDataText="Ingen objekter"
        />
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
                <option key={a.id} value={a.id}>{a.name}</option>
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
          <FieldGroup id="formControlsText" type="text" label="Last opp fil" />
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
            <Radio
              name="restrictions"
              inline
              onClick={updateFormFieldValue(form.restrictions, updateForm, true)}
            >
              Ja
            </Radio>
            <Radio
              name="restrictions"
              inline
              defaultChecked={!form.restrictions.rawValue}
              onClick={updateFormFieldValue(form.restrictions, updateForm, false)}
            >
              Nei
            </Radio>
          </Col>
        </FormGroup>
        {form.restrictions.value &&
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
                <AddButton
                  id="3"
                  label="Legg til flere saksnummer"
                  md={11}
                  mdOffset={1}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Sluttdato"
                  value={getValue(form.expirationDate)}
                  readOnly
                />
              </FormGroup>
            </Panel>
          </FormGroup>}
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
          saveAnalysisEventLocal(appSession, form, location, saveAnalysisEvent),
          appSession
        )}
    />
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

AnalysisAdd.propTypes = {
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
    type: PropTypes.shape(FieldShape),

    partOf: PropTypes.shape(FieldShape).isRequired,
    result: PropTypes.shape(FieldShape).isRequired,
    place: PropTypes.shape(FieldShape).isRequired,

    externalSource: PropTypes.shape(FieldShape).isRequired,
    comments: PropTypes.shape(FieldShape).isRequired,

    restrictions: PropTypes.shape(FieldShapeBoolean).isRequired,
    by: PropTypes.shape(FieldShape).isRequired,
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
  saveAnalysisEvent: PropTypes.func
};

export default AnalysisAdd;
