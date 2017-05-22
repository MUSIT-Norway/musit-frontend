import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleFormAddComponent from './SampleFormComponent';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import Sample from '../../models/sample';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import { emitError, emitSuccess } from '../../shared/errors';
import { toPromise } from '../../shared/util';
import mount from '../../shared/mount';
import store$, { loadSampleTypes$ } from './sampleStore';

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
  loadSampleTypes$
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  SampleFormAddComponent
);

function onMount({ loadSampleTypes, appSession }) {
  loadSampleTypes({ token: appSession.accessToken });
}
