import inject from 'react-rxjs/dist/RxInject';
import analysisForm, { fieldsArray } from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import store$, {
  getAnalysis$,
  setLoading$,
  updateExtraDescriptionAttribute$,
  updateExtraResultAttribute$,
  clearStore$
} from './analysisStore';
import PropTypes from 'prop-types';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/lifeCycle';
import { onMount, onReceiveProps } from './AnalysisViewContainer';
import { loadPredefinedTypes } from '../../stores/predefined';
import props from './shared/formProps';

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
  getAnalysis$,
  setLoading$,
  clearStore$,
  ...formActions
};

const MountableAnalysisFormComponent = lifeCycle({
  onMount,
  onReceiveProps: onReceiveProps(fieldsArray),
  onUnmount: props => {
    props.clearForm();
    props.clearStore();
  }
})(AnalysisFormComponent);

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(MountableAnalysisFormComponent);
