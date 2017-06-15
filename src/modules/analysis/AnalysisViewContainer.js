import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../../stores/appSession';
import { loadPredefinedTypes } from '../../stores/predefined';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import Analysis from '../../models/analysis';
import { toPromise } from '../../shared/util';
import analysisForm, { fieldsArray } from './analysisForm';

const { form$, loadForm$ } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$: { type: PropTypes.object.isRequired },
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

// Can be componentified
export const onProps = fieldsArray => ({
  appSession,
  getAnalysis,
  store,
  predefined,
  loadForm,
  setLoading,
  match
}) => {
  if (
    !store.loading &&
    !store.analysis &&
    predefined.sampleTypes &&
    predefined.analysisTypes
  ) {
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
  }
};

export default flowRight([
  inject(data, commands, props),
  mount(null, onProps(fieldsArray)),
  loadPredefinedTypes,
  makeUrlAware
])(AnalysisViewComponent);
