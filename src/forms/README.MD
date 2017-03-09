sampleForm.js

```javascript
import type { Field } from '../../forms/form';
import createForm from '../../forms/form';
import {
  stringMapper,
  numberMapper
} from '../../forms/mappers';
import {
  isDecimalNumber,
  isNumberInRange
} from '../../forms/validators';
import {
  composeValidators,
  isRequired,
  isAlphaNumeric
} from 'revalidate';

const hid: Field<number> = {
  name: 'hid',
  mapper: numberMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isDecimalNumber(0, 3)),
    valueValidator: isNumberInRange(-1000, +1000)
  }
};

const registeredBy: Field<string> = {
  name: 'registeredBy',
  mapper: stringMapper,
  validator: {
    rawValidator: composeValidators(isRequired, isAlphaNumeric)
  }
};

const registeredDate: Field<string> = {
  name: 'registeredDate',
  mapper: stringMapper
};

export default createForm('sampleForm', [ hid, registeredBy, registeredDate ]);
```

SampleFormPage.jsx

```javascript
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
```