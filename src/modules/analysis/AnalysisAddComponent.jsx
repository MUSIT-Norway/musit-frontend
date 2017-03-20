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

const getVal = (form, field) => form[field] && (form[field].rawValue || '');
const expanded = true;

const saveAnalysisEventLocal = (appSession, form, store, saveAnalysisEvent) =>{
  return saveAnalysisEvent({
    museumId: appSession.getMuseumId(),
    data: {
      analysisTypeId: getVal(form, 'analysisTypeId'),
      eventDate: getVal(form, 'registeredDate'),
      note: getVal(form, 'note'),
      objectIds: store.objectsData.map((a) => a.uuid)
    },
    token: appSession.getAccessToken()});
};

const AnalysisAdd = ({ form, updateForm, store, saveAnalysisEvent, appSession } : Props) => {
  return (
    <div>
      <br/>
      <PageHeader style={{ paddingLeft: 20 }}>{ I18n.t('musit.analysis.registeringAnalysis') }</PageHeader>
      <Form>
        <FormGroup>
          {LabelFormat('HID:')}
          <Col style={{ padding: '7px' }}>{getVal(form, 'id')}</Col>
          {LabelFormat('Registrert:', 1)}
          <Col md={2} style={{ padding: '7px' }}><FontAwesome name='user'/>{' '}
            {getVal(form, 'registeredBy')}
          </Col>
          <Col md={9} style={{ padding: '7px' }}>
            <FontAwesome name='clock-o'/>{' '}
            {getVal(form, 'registeredDate')}
          </Col>
          {LabelFormat('Sist endret:', 1)}
          <Col md={2} style={{ padding: '7px' }}><FontAwesome name='user'/>{' '}{getVal(form, 'doneBy')}</Col>
          <Col md={2} style={{ padding: '7px' }}><FontAwesome name='clock-o'/>{' '}{getVal(form, 'doneDate')}</Col>
          <Col md={7} style={{ padding: '7px' }}><a href=''>Se endringshistorikk</a></Col>
        </FormGroup>
      </Form>
      {newLine()}
      <Form>
        <FormGroup>
          <FieldGroup
            id="formControlsText"
            type="text"
            label="saksnummber"
            value={getVal(form, 'caseNumber')}
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
              <th>UUID</th>
            </tr>
            </thead>
            <tbody>
            {store.objectsData ?
              store.objectsData.map((a) =>
                <tr key={a.uuid}>
                  <td>{a.museumNumber}</td>
                  <td>{a.subNumber}</td>
                  <td>{a.term}</td>
                  <td>{a.uuid}</td>
                </tr>
              )
              : ''}
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
            value={getVal(form, 'actor')}
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
              <FormControl
                componentClass="select"
                placeholder="Velg kategori"
                onChange={(e) => updateForm({name: form.analysisTypeId.name, rawValue: e.target.value })}
              >
                <option>Velg kategori</option>
                {store.data.analysisTypes ?
                  store.data.analysisTypes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)
                  : ''}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <FieldGroup
              id="formControlsText"
              type="text"
              label="Ekstern kilde"
              placeholder="http://www.lenke.no"
              value={getVal(form, 'externalSource')}
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
                value={getVal(form, 'comments')}
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
            <Panel collapsible expanded={expanded} style={{border:'none', backgroundColor: '#f5f5f5'}}>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Klausulert for"
                  placeholder="Fornavn Etternavn"
                  value={getVal(form, 'restrictionsFor')}
                  onChange={(e) => updateForm({name: form.restrictionsFor.name, rawValue: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Årsak til klausulering"
                  value={getVal(form, 'reasonForRestrictions')}
                  onChange={(e) => updateForm({name: form.reasonForRestrictions.name, rawValue: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Sluttdato"
                  value={getVal(form, 'restrictionsEndDate')}
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
                  value={getVal(form, 'repealedBy')}
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
              value={getVal(form, 'note')}
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
      <SaveCancel
        onClickSave={() => saveAnalysisEventLocal(appSession, form, store, saveAnalysisEvent)}
      />
      {newLine()}
      <Form horizontal>
        <FormGroup>
          <Col mdOffset={1}><h5><b>Endringshistorikk</b></h5></Col>
        </FormGroup>
        <FormGroup>
          <Col mdOffset={1}>{getVal(form, 'registeredBy')} - {getVal(form, 'registeredDate')}</Col>
        </FormGroup>
        <FormGroup>
          <Col mdOffset={1}>{getVal(form, 'doneBy')} - {getVal(form, 'doneDate')}</Col>
        </FormGroup>
        <FormGroup>
          <Col mdOffset={1}><a href=''>Se mer</a></Col>
        </FormGroup>
      </Form>
    </div>);
};


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