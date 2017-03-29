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
import {SaveCancel} from '../../components/formfields/index';
const { Table } = require('reactable');
import { AppSession } from '../app/appSession';

type Field = { name: string, rawValue: ?string };
type FormData = {
  id: Field,
  registeredBy: Field,
  registeredDate: Field,
  doneBy: Field,
  doneDate: Field,
  eventDate: Field,
  objectId: Field,
  partOf: Field,
  result: Field,
  caseNumber: Field,
  actor: Field,
  role: Field,
  place: Field,
  analysisTypeId: Field,
  externalSource: Field,
  comments: Field,
  restrictions: Field,
  restrictionsFor: Field,
  reasonForRestrictions: Field,
  restrictionsEndDate: Field,
  repealedBy: Field,
  note: Field,
  completeAnalysis: Field
};
type AnalysisType = { id: number, name: string };
type ObjectData = { uuid: string }
type Store = { objectsData: ObjectData[], data: { analysisTypes: AnalysisType[] } };
type Update = (update: Field) => void;
type Props = {
  form: FormData,
  updateForm: Update,
  store: Store,
  appSession: AppSession,
  saveAnalysisEvent: Function
};

// TODO rename and convert to stateless function component e.g. ({ label, md = 1}) (curlies)
// TODO and call it like this <LabelFormat label="Label" md={2} /> instead of {labelFormat("Hei", 2)}
const labelFormat = (label, md = 1) => (
  <Col md={md} style={{ textAlign: 'right', padding: '7px' }}>
    <b>{label}</b>
  </Col>
);

const FieldGroup = ({id, label, md = 1, ...props}) => (
  <div id={id}>
    {labelFormat(label, md)}
    <Col md={2}>
      <FormControl {... props} />
    </Col>
  </div>
);

const AddButton = ({id, label, md, mdOffset = 0, ...props}) => (
  <div id={id}>
    <Col md={md} mdOffset={mdOffset}>
      <Button {... props}>
        <FontAwesome name='plus-circle'/>{' '}
        {label}
      </Button>
    </Col>
  </div>
);

const NewLine = () => (
  <Form horizontal>
    <FormGroup />
    <hr/>
  </Form>
);

const getValue = (field) => field.rawValue || '';

export const saveAnalysisEventLocal = (appSession: AppSession, form: FormData, store: Store, saveAnalysisEvent: Function) =>
  () => saveAnalysisEvent({
    museumId: appSession.getMuseumId(),
    data: {
      analysisTypeId: getValue(form.analysisTypeId),
      eventDate: getValue(form.registeredDate),
      note: getValue(form.note),
      objectIds: store.objectsData.map((a) => a.uuid)
    },
    token: appSession.getAccessToken()
  });

const updateFormField = (field, updateForm) =>
  (e) => updateForm({
    name: field.name,
    rawValue: e.target.value
  });

const AnalysisAdd = ({ form, updateForm, store, saveAnalysisEvent, appSession } : Props) => (
  <div>
    <br/>
    <PageHeader style={{ paddingLeft: 20 }}>{ I18n.t('musit.analysis.registeringAnalysis') }</PageHeader>
    <Col md={12}>
      <strong>HID:</strong>{' '}{getValue(form.id)}
    </Col>
    <Col md={12}>
      <strong>Registrert:</strong>{' '}<FontAwesome name='user'/>{' '}{getValue(form.registeredBy)}{' '}
      <FontAwesome name='clock-o'/>{' '}{getValue(form.registeredDate)}
    </Col>
    <Col md={12}>
      <strong>Sist endret:</strong>{' '}<FontAwesome name='user'/>{' '}{getValue(form.doneBy)}{' '}
      <FontAwesome name='clock-o'/>{' '}{getValue(form.doneDate)}{' '}<a href=''>Se endringshistorikk</a>
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
        <Table
          className="table"
          columns={[
            { key: 'museumNumber', label: 'Museumsnr'},
            { key: 'subNumber', label: 'Unr'},
            { key: 'term', label: 'Term/artsnavn' }
          ]}
          data={store.objectsData}
          sortable={['museumNumber', 'subNumber', 'term']}
          noDataText="Ingen objekter"
        />
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
          value={getValue(form.actor)}
          onChange={updateFormField(form.actor, updateForm)}
        />
        {labelFormat('Rolle', 1)}
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
    <NewLine />
    <FormGroup>
      {labelFormat('Analysested', 1)}
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
          {labelFormat('Type analyse', 1)}
          <Col md={2}>
            <FormControl
              componentClass="select"
              placeholder="Velg kategori"
              onChange={updateFormField(form.analysisTypeId, updateForm)}
            >
              <option>Velg kategori</option>
              {store.data.analysisTypes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
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
          {labelFormat('Kommentar / resultat', 1)}
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
                value={getValue(form.restrictionsFor)}
                onChange={updateFormField(form.restrictionsFor, updateForm)}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Årsak til klausulering"
                value={getValue(form.reasonForRestrictions)}
                onChange={updateFormField(form.reasonForRestrictions, updateForm)}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Sluttdato"
                value={getValue(form.restrictionsEndDate)}
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
                value={getValue(form.repealedBy)}
                onChange={updateFormField(form.repealedBy, updateForm)}
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
        {labelFormat('Kommentar til analysen', 1)}
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
    <SaveCancel
      onClickSave={saveAnalysisEventLocal(appSession, form, store, saveAnalysisEvent)}
    />
    <NewLine />
    <Form horizontal>
      <FormGroup>
        <Col mdOffset={1}><h5><b>Endringshistorikk</b></h5></Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>{getValue(form.registeredBy)} - {getValue(form.registeredDate)}</Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}>{getValue(form.doneBy)} - {getValue(form.doneDate)}</Col>
      </FormGroup>
      <FormGroup>
        <Col mdOffset={1}><a href=''>Se mer</a></Col>
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

AnalysisAdd.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.shape(FieldShape).isRequired,
    registeredBy: PropTypes.shape(FieldShape).isRequired,
    registeredDate: PropTypes.shape(FieldShape).isRequired,
    doneBy: PropTypes.shape(FieldShape).isRequired,
    doneDate: PropTypes.shape(FieldShape).isRequired,
    eventDate: PropTypes.shape(FieldShape).isRequired,
    objectId: PropTypes.shape(FieldShape).isRequired,
    partOf: PropTypes.shape(FieldShape).isRequired,
    result: PropTypes.shape(FieldShape).isRequired,
    caseNumber: PropTypes.shape(FieldShape).isRequired,
    actor: PropTypes.shape(FieldShape).isRequired,
    role: PropTypes.shape(FieldShape).isRequired,
    place: PropTypes.shape(FieldShape).isRequired,
    analysisTypeId: PropTypes.shape(FieldShape).isRequired,
    externalSource: PropTypes.shape(FieldShape).isRequired,
    comments: PropTypes.shape(FieldShape).isRequired,
    restrictions: PropTypes.shape(FieldShapeBoolean).isRequired,
    restrictionsFor: PropTypes.shape(FieldShape).isRequired,
    reasonForRestrictions: PropTypes.shape(FieldShape).isRequired,
    restrictionsEndDate: PropTypes.shape(FieldShape).isRequired,
    repealedBy: PropTypes.shape(FieldShape).isRequired,
    note: PropTypes.shape(FieldShape).isRequired
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  saveAnalysisEvent: PropTypes.func
};

export default AnalysisAdd;