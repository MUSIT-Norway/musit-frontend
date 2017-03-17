import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleFormAddComponent from './SampleAddComponent';
import Sample from '../../models/sample';
import React from 'react';
import {Observable} from 'rxjs';
import {emitError, emitSuccess} from '../../shared/errors';
import  sampleStore$, { clearForm$ } from './sampleStore';

const {form$, updateForm$} = sampleForm;
const data = {
  appSession$: {type: React.PropTypes.instanceOf(Observable).isRequired},
  form$,
  sampleStore$};
const props = {
  addSample: Sample.addSample(),
  emitSuccess,
  emitError
};

const commands = {updateForm$, clearForm$};
export default inject(data, commands, props)(SampleFormAddComponent);