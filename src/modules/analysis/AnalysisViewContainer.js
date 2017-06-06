import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import store$, { loadPredefinedTypes$ } from './analysisStore';
import Analysis from '../../models/analysis';
import { toPromise } from '../../shared/util';
import analysisForm, { fieldsArray } from './analysisForm';
import { hashHistory } from 'react-router';

const { form$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  loadForm$,
  loadPredefinedTypes$
};

const props = {
  loadAnalysis: toPromise(Analysis.getAnalysisWithDetails()),
  goToUrl: hashHistory.push,
  goBack: hashHistory.goBack
};

export const onMount = ({
  loadPredefinedTypes,
  appSession,
  loadForm,
  loadAnalysis,
  params
}) => {
  const inputParams = {
    id: params.analysisId,
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
  loadPredefinedTypes({
    ...inputParams,
    onComplete: () =>
      loadAnalysis(inputParams).then(analysis =>
        loadForm(Analysis.fromJsonToForm(analysis, fieldsArray))
      )
  });
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisViewComponent
);
