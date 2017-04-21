import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleForm';
import SampleFormAddComponent from './SampleAddComponent';
import Sample from '../../models/sample';
import React from 'react';
import { Observable } from 'rxjs';
import { emitError, emitSuccess } from '../../shared/errors';
import { toPromise } from '../../shared/util';

const { form$, updateForm$, loadForm$ } = sampleForm;

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  form$
};

const props = {
  addSample: toPromise(Sample.addSample()),
  addPersonToSample: toPromise(Sample.addPersonToSample()),
  updatePersonForSample: toPromise(Sample.updatePersonForSample()),
  emitSuccess,
  emitError
};

const commands = { updateForm$, loadForm$ };

export default inject(data, commands, props)(SampleFormAddComponent);
