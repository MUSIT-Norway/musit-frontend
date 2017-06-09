import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../../stores/appSession';
import {
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$
} from '../../stores/predefined';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import Analysis from '../../models/analysis';
import analysisForm, { fieldsArray } from './analysisForm';
import { hashHistory } from 'react-router';

const { form$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  loadForm$,
  setLoadingSampleTypes$,
  loadSampleTypes$,
  setLoadingAnalysisTypes$,
  loadAnalysisTypes$,
  getAnalysis$,
  setLoading$
};

const props = {
  goToUrl: hashHistory.push,
  goBack: hashHistory.goBack
};

// Can be componentified
export const onMount = ({
  setLoadingSampleTypes,
  loadSampleTypes,
  setLoadingAnalysisTypes,
  loadAnalysisTypes,
  appSession,
  predefined
}) => {
  const inputParams = {
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
  if (!predefined.loadingSampleTypes) {
    setLoadingSampleTypes();
    loadSampleTypes(inputParams);
  }
  if (!predefined.loadingAnalysisTypes) {
    setLoadingAnalysisTypes();
    loadAnalysisTypes(inputParams);
  }
};

// Can be componentified
export const onProps = fieldsArray => ({
  appSession,
  getAnalysis,
  store,
  predefined,
  loadForm,
  setLoading,
  params
}) => {
  if (
    !store.loading &&
    !store.analysis &&
    predefined.sampleTypes &&
    predefined.analysisTypes
  ) {
    setLoading();
    getAnalysis({
      id: params.analysisId,
      sampleTypes: predefined.sampleTypes,
      museumId: appSession.museumId,
      collectionId: appSession.collectionId,
      token: appSession.accessToken,
      onComplete: analysis => {
        loadForm(Analysis.fromJsonToForm(analysis, fieldsArray));
      }
    });
  }
};

export default flowRight([
  inject(data, commands, props),
  mount(onMount, onProps(fieldsArray)),
  makeUrlAware
])(AnalysisViewComponent);
