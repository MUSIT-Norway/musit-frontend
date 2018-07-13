// @flow
import * as PropTypes from 'prop-types';
import { RxInjectLegacy as inject } from '../../../shared/react-rxjs-patch';
import AnalysisEventsViewComponent from './AnalysisEventsViewComponent';
import lifeCycle from '../../../shared/lifeCycle';
import Config from '../../../config';
import { AppSession } from '../../../types/appSession';
import analysisEventsStore$, {
  getAnalysisEvents$,
  filterEvents$
} from './analysisEventsStore';
import { loadPredefinedTypes } from '../../../stores/predefinedLoader';
import { TODO } from '../../../types/common';

const data = {
  analysisEventsStore$,
  appSession$: { type: PropTypes.object.isRequired }
};
const commands = { getAnalysisEvents$, filterEvents$ };
const props = (props: TODO) => ({
  ...props,
  goToAnalysis: (appSession: AppSession, analysisId: number) =>
    props.history.push(
      Config.magasin.urls.client.analysis.viewAnalysis(appSession, analysisId)
    )
});

const LoadedAnalysisEventsViewComponent = lifeCycle<TODO>({
  onMount: ({ getAnalysisEvents, appSession, predefined }) => {
    getAnalysisEvents({
      museumId: appSession.museumId,
      collectionId: appSession.collectionId,
      token: appSession.accessToken,
      analysisTypes: predefined.analysisTypes
    });
  }
})(AnalysisEventsViewComponent);

export default inject(data, commands, props)(
  loadPredefinedTypes(LoadedAnalysisEventsViewComponent)
);
