import inject from 'react-rxjs/dist/RxInject';
import analysisForm, { fieldsArray } from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import PropTypes from 'prop-types';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import { toPromise } from '../../shared/util';
import { onProps } from './AnalysisViewContainer';
import { loadPredefinedTypes } from '../../stores/predefined';
const { form$, updateForm$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$: { type: PropTypes.object.isRequired },
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

export default flowRight([
  inject(data, commands, props),
  mount(null, onProps(fieldsArray)),
  loadPredefinedTypes,
  makeUrlAware
])(AnalysisFormComponent);
