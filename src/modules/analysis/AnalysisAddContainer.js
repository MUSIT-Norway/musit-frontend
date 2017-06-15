import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import analysisAddForm from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import { loadPredefinedTypes } from '../../stores/predefined';
import store$ from './analysisStore';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import { toPromise } from '../../shared/util';
const { form$, updateForm$, loadForm$ } = analysisAddForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$
};

const props = props => ({
  ...props,
  saveAnalysis: toPromise(Analysis.saveAnalysisEvent()),
  saveResult: toPromise(Analysis.addResult()),
  goToUrl: props.history.push,
  goBack: props.history.goBack
});

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(AnalysisFormComponent);
