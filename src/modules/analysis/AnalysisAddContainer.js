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
import flowRight from 'lodash/flowRight';
import props, { onUnmount } from './shared/formProps';
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

const ManagedAnalysisFormComponent = lifeCycle({ onUnmount })(AnalysisFormComponent);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  ManagedAnalysisFormComponent
);
