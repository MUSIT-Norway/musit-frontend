import inject from 'react-rxjs/dist/RxInject';
import analysisForm, { fieldsArray } from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import PropTypes from 'prop-types';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/mount';
import { toPromise } from '../../shared/util';
import { onMount } from './AnalysisViewContainer';
import { loadPredefinedTypes } from '../../stores/predefined';
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

const props = props => ({
  ...props,
  saveAnalysis: toPromise(Analysis.editAnalysisEvent()),
  saveResult: toPromise(Analysis.addResult()),
  goToUrl: props.history.push,
  goBack: props.history.goBack
});

const MountableAnalysisFormComponent = lifeCycle(onMount(fieldsArray))(
  AnalysisFormComponent
);

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(MountableAnalysisFormComponent);
