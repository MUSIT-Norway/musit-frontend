import React from 'react';
import sampleForm from './sampleForm';
import inject from 'react-rxjs/dist/RxInject';

const SampleFormPage = (props) => (
  <div>
    <h1>Test</h1>
    <div>
      <label htmlFor="hid">HID</label>
      <input
        name="hid"
        type="text"
        value={props.form.hid.value || ''}
        onChange={(e) => props.updateField({ name: 'hid', value: e.target.value })}
      />
      {props.form.hid.status && !props.form.hid.status.valid && <span color="red">{props.form.hid.status.error}</span>}
    </div>
  </div>
);

const { form$, updateField$ } = sampleForm;
const data = { form$ };
const commands = { updateField$ };
export default inject(data, commands)(SampleFormPage);