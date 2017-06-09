import inject from 'react-rxjs/dist/RxInject';
import analysisForm, { fieldsArray } from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import {
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$
} from '../../stores/predefined';
import store$, { getAnalysisTypes$, getAnalysis$, setLoading$ } from './analysisStore';
import PropTypes from 'prop-types';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import { toPromise } from '../../shared/util';
import { hashHistory } from 'react-router';
import { onMount, onProps } from './AnalysisViewContainer';
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
  getAnalysisTypes$,
  getAnalysis$,
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$,
  setLoading$
};

const props = {
  saveAnalysis: toPromise(Analysis.editAnalysisEvent()),
  saveResult: toPromise(Analysis.addResult()),
  goToUrl: hashHistory.push,
  goBack: hashHistory.goBack
};

export default flowRight([
  inject(data, commands, props),
  mount(onMount, onProps(fieldsArray)),
  makeUrlAware
])(AnalysisFormComponent);
