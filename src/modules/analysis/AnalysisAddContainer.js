import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import analysisAddForm from './analysisForm';
import AnalysisFormComponent from './AnalysisFormComponent';
import store$, { loadPredefinedTypes$ } from './analysisStore';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import { toPromise } from '../../shared/util';
import { hashHistory } from 'react-router';

const { form$, updateForm$, loadForm$ } = analysisAddForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$,
  loadPredefinedTypes$
};

const props = {
  saveAnalysis: toPromise(Analysis.saveAnalysisEvent()),
  saveResult: toPromise(Analysis.addResult()),
  goToUrl: hashHistory.push,
  goBack: hashHistory.goBack
};

export const onMount = ({ appSession, loadPredefinedTypes }) =>
  loadPredefinedTypes({
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken,
    language: appSession.language
  });

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisFormComponent
);
