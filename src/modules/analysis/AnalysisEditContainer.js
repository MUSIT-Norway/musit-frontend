import inject from 'react-rxjs/dist/RxInject';
import analysisForm, { fieldsArray } from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import PropTypes from 'prop-types';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/mount';
import { onMount } from './AnalysisViewContainer';
import { loadPredefinedTypes } from '../../stores/predefined';
import props from './shared/formProps';

const { form$, updateForm$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$,
  getAnalysis$,
  setLoading$
};

const MountableAnalysisFormComponent = lifeCycle(onMount(fieldsArray))(
  AnalysisFormComponent
);

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(MountableAnalysisFormComponent);
