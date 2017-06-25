//@flow
import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleEditForm';
import SampleFormComponent from './SampleFormComponent';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from '../../shared/lifeCycle';
import { simplePut } from '../../shared/RxAjax';
import Sample from '../../models/sample';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import store$, { getPredefinedTypes$, getSample$ } from './sampleStore';
import { onMount } from './sampleViewContainer';
import { sampleProps } from './shared/submit';

const { form$, loadForm$, updateForm$, clearForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const commands = { loadForm$, updateForm$, getSample$, getPredefinedTypes$, clearForm$ };

const props = (props, ajaxPut = simplePut) => ({
  ...props,
  ...sampleProps(props, Sample.editSample(ajaxPut))
});

const onUnmount = props => {
  props.clearForm();
};

export default flowRight([
  inject(data, commands, props),
  lifeCycle({ onMount, onUnmount }),
  makeUrlAware
])(SampleFormComponent);
