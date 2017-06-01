//@flow
import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleEditForm';
import SampleFormComponent from './SampleFormComponent';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from '../../shared/mount';
import { emitError, emitSuccess } from '../../shared/errors';
import { toPromise } from '../../shared/util';
import Sample from '../../models/sample';
import { makeUrlAware } from '../../modules/app/appSession';
import flowRight from 'lodash/flowRight';
import store$, { getPredefinedTypes$ } from './sampleStore';
import { onMount } from './sampleViewContainer';

const { form$, loadForm$, updateForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const commands = { loadForm$, updateForm$, getPredefinedTypes$ };

const props = {
  getSample: toPromise(Sample.loadSample()),
  addSample: toPromise(Sample.editSample()),
  emitSuccess,
  emitError
};

export default flowRight([
  inject(data, commands, props),
  lifeCycle(onMount),
  makeUrlAware
])(SampleFormComponent);
