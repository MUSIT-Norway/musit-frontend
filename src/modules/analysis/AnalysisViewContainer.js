import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../../stores/appSession';
import { loadPredefinedTypes } from '../../stores/predefined';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/mount';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import Analysis from '../../models/analysis';
import analysisForm, { fieldsArray } from './analysisForm';
import Config from '../../config';

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
  clickEdit: () => {
    props.history.push(
      Config.magasin.urls.client.analysis.editAnalysis(
        props.appSession,
        props.match.params.analysisId
      )
    );
  }
});

export const onMount = fieldsArray => props => {
  props.setLoading();
  props.getAnalysis({
    id: props.match.params.analysisId,
    sampleTypes: props.predefined.sampleTypes,
    museumId: props.appSession.museumId,
    collectionId: props.appSession.collectionId,
    token: props.appSession.accessToken,
    onComplete: analysis => {
      props.loadForm(Analysis.fromJsonToForm(analysis, fieldsArray));
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
