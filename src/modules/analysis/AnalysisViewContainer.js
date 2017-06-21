import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../../stores/appSession';
import { loadPredefinedTypes } from '../../stores/predefined';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../shared/lifeCycle';
import store$, { getAnalysis$, setLoading$ } from './analysisStore';
import Analysis from '../../models/analysis';
import analysisForm, { fieldsArray } from './analysisForm';
import Config from '../../config';

const { form$, ...formActions } = analysisForm;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  getAnalysis$,
  setLoading$,
  ...formActions
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

export const onMount = props => {
  props.setLoading();
  props.getAnalysis({
    id: props.match.params.analysisId,
    sampleTypes: props.predefined.sampleTypes,
    museumId: props.appSession.museumId,
    collectionId: props.appSession.collectionId,
    token: props.appSession.accessToken
  });
};

export const onProps = fieldsArray => props => {
  if (props.store.analysis && !props.form.analysisTypeId.value) {
    props.loadForm(Analysis.fromJsonToForm(props.store.analysis, fieldsArray));
  }
};

const MountableAnalysisViewComponent = lifeCycle({
  onMount,
  onReceiveProps: onProps(fieldsArray)
})(AnalysisViewComponent);

export default flowRight([
  inject(data, commands, props),
  loadPredefinedTypes,
  makeUrlAware
])(MountableAnalysisViewComponent);
