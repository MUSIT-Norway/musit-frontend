import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import analysisAddForm from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import { onMount } from './AnalysisViewContainer';
import store$ from './analysisStore';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import { toPromise } from '../../shared/util';
import { hashHistory } from 'react-router';
import predefined$, {
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$
} from '../../stores/predefined';
const { form$, updateForm$, loadForm$ } = analysisAddForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$,
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$,
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$
};

const props = {
  saveAnalysis: toPromise(Analysis.saveAnalysisEvent()),
  saveResult: toPromise(Analysis.addResult()),
  goToUrl: hashHistory.push,
  goBack: hashHistory.goBack
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisFormComponent
);
