import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleFormAddComponent from './SampleFormComponent';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from '../../shared/lifeCycle';
import store$, { getPredefinedTypes$ } from './sampleStore';
import { sampleProps } from './shared/submit';
import Sample from '../../models/sample';
import { simplePost } from '../../shared/RxAjax';

const { form$, updateForm$, loadForm$, clearForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const props = (props, ajaxPost = simplePost) => ({
  ...props,
  ...sampleProps(props, Sample.addSample(ajaxPost))
});

const commands = {
  updateForm$,
  loadForm$,
  getPredefinedTypes$,
  clearForm$
};

const onUnmount = props => {
  props.clearForm();
};

export default flowRight([
  inject(data, commands, props),
  lifeCycle({ onMount, onUnmount }),
  makeUrlAware
])(SampleFormAddComponent);

export function onMount({ appSession, getPredefinedTypes }) {
  getPredefinedTypes({ token: appSession.accessToken, isEn: appSession.language.isEn });
}
