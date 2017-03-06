import React from 'react';
import sampleForm from './sampleForm';
import inject from 'react-rxjs/dist/RxInject';
import { FormControl, ControlLabel, Form, FormGroup, Well } from 'react-bootstrap';

const FormInput = (props) => (
  <FormGroup
    controlId={props.field.name}
    validationState={props.field.status && !props.field.status.valid ? 'error' : null}
  >
    <ControlLabel>{props.field.name}</ControlLabel>
    <FormControl
      value={props.field.rawValue || ''}
      onChange={(e) => props.onChangeField({ name: props.field.name, rawValue: e.target.value })}
    />
  </FormGroup>
);

const SampleFormPage = (props) => (
  <Well>
    <Form>
      <h1>Test</h1>
      <FormInput field={props.form.hid} onChangeField={props.updateForm} />
      <FormInput field={props.form.registeredBy} onChangeField={props.updateForm} />
      <FormInput field={props.form.registeredDate} onChangeField={props.updateForm} />
    </Form>
  </Well>

);

const { form$, updateForm$ } = sampleForm;
const data = { form$ };
const commands = { updateForm$ };
export default inject(data, commands)(SampleFormPage);