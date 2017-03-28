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

type Field = { name: string, rawValue: ?string };
type Update = (update: Field) => void;

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

type Props = {
  form: FormData,
  updateForm: Update,
  clearAnalysisTypes: Function,
  loadAnalysisTypes: Function,
  store: any,
  appSession: any,
  saveAnalysisEvent: Function
};

const LabelFormat = (label, md = 1) => (
  <Col md={md} style={{ textAlign: 'right', padding: '7px' }}>
    <b>{label}</b>
  </Col>
);

const FieldGroup = ({id, label, md = 1, ...props}) => (
  <div id={id}>
    {LabelFormat(label, md)}
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

const saveAnalysisEventLocal = (appSession, form, store, saveAnalysisEvent) =>{
  return saveAnalysisEvent({
    museumId: appSession.getMuseumId(),
    data: {
      analysisTypeId: getValue(form.analysisTypeId),
      eventDate: getValue(form.registeredDate),
      note: getValue(form.note),
      objectIds: store.objectsData.map((a) => a.uuid)
    },
    token: appSession.getAccessToken()});
};

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
          label="saksnummber"
          value={getValue(form.caseNumber)}
          onChange={(e) => updateForm({name: form.caseNumber.name, rawValue: e.target.value })}
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
          onChange={(e) => updateForm({name: form.actor.name, rawValue: e.target.value })}
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
    <NewLine />
    <FormGroup>
      {LabelFormat('Analysested', 1)}
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
          {LabelFormat('Type analyse', 1)}
          <Col md={2}>
            <FormControl
              componentClass="select"
              placeholder="Velg kategori"
              onChange={(e) => updateForm({name: form.analysisTypeId.name, rawValue: e.target.value })}
            >
              <option>Velg kategori</option>
              {store.data.analysisTypes && store.data.analysisTypes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
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
            onChange={(e) => updateForm({name: form.externalSource.name, rawValue: e.target.value })}
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
            <FormControl
              componentClass="textarea"
              placeholder=""
              value={getValue(form.comments)}
              onChange={(e) => updateForm({name: form.comments.name, rawValue: e.target.value })}
            />
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
          <Panel collapsible expanded style={{border:'none', backgroundColor: '#f5f5f5'}}>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Klausulert for"
                placeholder="Fornavn Etternavn"
                value={getValue(form.restrictionsFor)}
                onChange={(e) => updateForm({name: form.restrictionsFor.name, rawValue: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <FieldGroup
                id="navn"
                md={1}
                type="text"
                label="Årsak til klausulering"
                value={getValue(form.reasonForRestrictions)}
                onChange={(e) => updateForm({name: form.reasonForRestrictions.name, rawValue: e.target.value })}
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
                onChange={(e) => updateForm({name: form.repealedBy.name, rawValue: e.target.value })}
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
        {LabelFormat('Kommentar til analysen', 1)}
        <Col md={5}>
          <FormControl
            className="note"
            onChange={(e) => updateForm({name: form.note.name, rawValue: e.target.value })}
            componentClass="textarea"
            placeholder={form.note.name}
            value={getValue(form.note)}
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
    <NewLine />
    <SaveCancel
      onClickSave={() => saveAnalysisEventLocal(appSession, form, store, saveAnalysisEvent)}
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
    id: PropTypes.shape(FieldShape),
    registeredBy: PropTypes.shape(FieldShape),
    registeredDate: PropTypes.shape(FieldShape),
    doneBy: PropTypes.shape(FieldShape),
    doneDate: PropTypes.shape(FieldShape),
    eventDate: PropTypes.shape(FieldShape),
    objectId: PropTypes.shape(FieldShape),
    partOf: PropTypes.shape(FieldShape),
    result: PropTypes.shape(FieldShape),
    caseNumber: PropTypes.shape(FieldShape),
    actor: PropTypes.shape(FieldShape),
    role: PropTypes.shape(FieldShape),
    place: PropTypes.shape(FieldShape),
    analysisTypeId: PropTypes.shape(FieldShape),
    externalSource: PropTypes.shape(FieldShape),
    comments: PropTypes.shape(FieldShape),
    restrictions: PropTypes.shape(FieldShapeBoolean),
    restrictionsFor: PropTypes.shape(FieldShape),
    reasonForRestrictions: PropTypes.shape(FieldShape),
    restrictionsEndDate: PropTypes.shape(FieldShape),
    repealedBy: PropTypes.shape(FieldShape),
    note: PropTypes.shape(FieldShape)
  }).isRequired,
  updateForm: PropTypes.func,
  loadForm: PropTypes.func,
  clearAnalysisTypes: PropTypes.func,
  loadAnalysisTypes: PropTypes.func,
  store: PropTypes.object.isRequired,
  saveAnalysisEvent: PropTypes.func
};

export default AnalysisAdd;