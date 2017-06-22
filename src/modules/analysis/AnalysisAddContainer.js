import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import analysisForm from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import { loadPredefinedTypes } from '../../stores/predefined';
import store$, {
  updateExtraDescriptionAttribute$,
  updateExtraResultAttribute$,
  clearStore$
} from './analysisStore';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import props from './shared/formProps';
import lifeCycle from '../../shared/lifeCycle';

const { form$, ...formActions } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateExtraDescriptionAttribute$,
  updateExtraResultAttribute$,
  clearStore$,
  ...formActions
};

const ManagedAnalysisFormComponent = lifeCycle({
  onUnmount: props => {
    props.clearForm();
    props.clearStore();
  }
})(AnalysisFormComponent);

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(ManagedAnalysisFormComponent);
