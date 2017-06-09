import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleFormAddComponent from './SampleFormComponent';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import Sample from '../../models/sample';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import { emitError, emitSuccess } from '../../shared/errors';
import { toPromise } from '../../shared/util';
import mount from '../../shared/mount';
import store$, { getPredefinedTypes$ } from './sampleStore';

const { form$, updateForm$, loadForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const props = {
  addSample: toPromise(Sample.addSample()),
  emitSuccess,
  emitError
};

const commands = {
  updateForm$,
  loadForm$,
  getPredefinedTypes$
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  SampleFormAddComponent
);

export function onMount({ appSession, getPredefinedTypes }) {
  getPredefinedTypes({ token: appSession.accessToken });
}
