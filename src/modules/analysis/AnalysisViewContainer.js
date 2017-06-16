import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../../stores/appSession';
import { loadPredefinedTypes } from '../../stores/predefined';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/mount';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import Analysis from '../../models/analysis';
import { toPromise } from '../../shared/util';
import analysisForm, { fieldsArray } from './analysisForm';

const { form$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  loadForm$,
  getAnalysis$,
  setLoading$
};

const props = props => ({
  ...props,
  loadAnalysis: toPromise(Analysis.getAnalysisWithDetails()),
  goToUrl: props.history.push,
  goBack: props.history.goBack
});

export const onMount = fieldsArray => ({
  appSession,
  getAnalysis,
  predefined,
  loadForm,
  setLoading,
  match
}) => {
  setLoading();
  getAnalysis({
    id: match.params.analysisId,
    sampleTypes: predefined.sampleTypes,
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken,
    onComplete: analysis => {
      loadForm(Analysis.fromJsonToForm(analysis, fieldsArray));
    }
  });
};

const MountableAnalysisViewComponent = lifeCycle(onMount(fieldsArray))(
  AnalysisViewComponent
);

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(MountableAnalysisViewComponent);
