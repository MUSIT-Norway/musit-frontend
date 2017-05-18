import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleEditForm';
import SampleFormComponent from './SampleFormComponent';
import React from 'react';
import { Observable } from 'rxjs';
import mount from 'shared/mount';
import { emitError, emitSuccess } from 'shared/errors';
import { toPromise } from 'shared/util';
import Sample from 'models/sample';
import { makeUrlAware } from 'modules/app/appSession';
import flowRight from 'lodash/flowRight';
import store$, { loadSampleTypes$ } from './sampleStore';
import { onMount } from './sampleViewContainer';

const { form$, loadForm$, updateForm$ } = sampleForm;

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const commands = { loadForm$, updateForm$, loadSampleTypes$ };

const props = {
  loadSample: toPromise(Sample.loadSample()),
  addSample: toPromise(Sample.editSample()),
  emitSuccess,
  emitError
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  SampleFormComponent
);
