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


const expanded = true;




const AnalysisAdd = ({ form, updateForm, store } : Props) => {
  return (
    <div>
      <br/>
      <PageHeader style={{ paddingLeft: 20 }}>{ I18n.t('musit.analysis.registeringAnalysis') }</PageHeader>
      <Form>
        <FormGroup>
          {LabelFormat('HID:')}
          <Col style={{ padding: '7px' }}>{form.id.rawValue || ''}</Col>
          {LabelFormat('Registrert:', 1)}
          <Col md={1} style={{ padding: '7px' }}><FontAwesome name='user'/>{' '}
            {form.registeredBy.rawValue || ''}
          </Col>
          <Col md={10} style={{ padding: '7px' }}>
            <FontAwesome name='clock-o'/>{' '}
            {form.registeredDate.rawValue || ''}
          </Col>
          {LabelFormat('Sist endret:', 1)}
          <Col md={1} style={{ padding: '7px' }}><FontAwesome name='user'/>{' '}{form.doneBy.rawValue || ''}</Col>
          <Col md={1} style={{ padding: '7px' }}><FontAwesome name='clock-o'/>{' '}{form.doneDate.rawValue || ''}</Col>
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
            value={form.caseNumber.rawValue || ''}
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
            <tr>
              <td>1234</td>
              <td>12345678911</td>
              <td>Spyd</td>
              <td>1cbf15cb-8348-4e66-99a4-bc314da57a42</td>
            </tr>
            <tr>
              <td>2345</td>
              <td>12345678912</td>
              <td>Beltering</td>
              <td>2cbf15cb-8348-4e66-99a4-bc314da57a42</td>
            </tr>
            <tr>
              <td>3455</td>
              <td>12345678911</td>
              <td>Øsekar</td>
              <td>3cbf15cb-8348-4e66-99a4-bc314da57a42</td>
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
            value={form.actor.rawValue || ''}
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
              <FormControl componentClass="select" placeholder="Velg kategori">
                <option>Velg kategori</option>
                {store.data.analysisTypes ?
                  store.data.analysisTypes.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)
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
              value={form.externalSource.rawValue || ''}
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
                value={form.comments.rawValue || ''}
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
                  value={form.restrictionsFor.rawValue || ''}
                  onChange={(e) => updateForm({name: form.restrictionsFor.name, rawValue: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Årsak til klausulering"
                  value={form.reasonForRestrictions.rawValue || ''}
                  onChange={(e) => updateForm({name: form.reasonForRestrictions.name, rawValue: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <FieldGroup
                  id="navn"
                  md={1}
                  type="text"
                  label="Sluttdato"
                  value={form.restrictionsEndDate.rawValue || ''}
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
                  value={form.repealedBy.rawValue || ''}
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
              value={form.note.rawValue || ''}
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
          <Col mdOffset={1}>{form.registeredBy.rawValue || ''} - {form.registeredDate.rawValue || ''}</Col>
        </FormGroup>
        <FormGroup>
          <Col mdOffset={1}>{form.doneBy.rawValue || ''} - {form.doneDate.rawValue || ''}</Col>
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
  loadForm: PropTypes.func.isRequired,
  clearAnalysisTypes: PropTypes.func.isRequired,
  loadAnalysisTypes: PropTypes.func.isRequired,
  store: PropTypes.object,
  saveAnalysisEvent: PropTypes.func
};

export default AnalysisAdd;