import inject from 'react-rxjs/dist/RxInject';
import analysisForm, { fieldsArray } from './analysisForm';
import AnalysiFormComponent from './AnalysisFormComponent';
import store$, { getAnalysisTypes$, getAnalysis$ } from './analysisStore';
import PropTypes from 'prop-types';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import { toPromise } from '../../shared/util';
import { hashHistory } from 'react-router';

const { form$, updateForm$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$,
  getAnalysisTypes$,
  getAnalysis$
};

const props = {
  saveAnalysis: toPromise(Analysis.editAnalysisEvent()),
  saveResult: toPromise(Analysis.addResult()),
  goToUrl: hashHistory.push,
  goBack: hashHistory.goBack
};

export const onMount = ({
  getAnalysisTypes,
  getAnalysis,
  appSession,
  params,
  loadForm
}) => {
  const inputParams = {
    museumId: appSession.museumId,
    id: params.analysisId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
  getAnalysisTypes(inputParams);
  getAnalysis({
    ...inputParams,
    onComplete: analysis => loadForm(Analysis.fromJsonToForm(analysis, fieldsArray))
  });
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysiFormComponent
);
