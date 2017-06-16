import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import analysisAddForm from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import { loadPredefinedTypes } from '../../stores/predefined';
import store$ from './analysisStore';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import props from './shared/formProps';

const { form$, updateForm$, loadForm$ } = analysisAddForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$
};

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(AnalysisFormComponent);
