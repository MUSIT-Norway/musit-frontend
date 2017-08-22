// @flow

import PropTypes from 'prop-types';
import lifeCycle from '../../../shared/lifeCycle';
import inject from 'react-rxjs/dist/RxInject';
import flowRight from 'lodash/flowRight';

import { loadPredefinedTypes } from '../../../stores/predefined';
import { getAnalysis$ } from '../analysisStore';
import analysisExchangeStore$, {
  importResult$,
  uploadResultFailed$,
  clearStore$,
  setAnalysisTypes$
} from './analysisExchangeStore';
import { uploadAnalysisResultAction } from './uploadImportResultAction';

import AnalysisResultExchangeComponent from './AnalysisResultExchangeComponent';

import type { AppSession } from 'types/appSession';
import type { Match, History } from 'types/Routes';
import type { StoreState } from './analysisExchangeStore';
import type { Predefined } from 'types/predefined';
import type { AnalysisType } from 'types/analysis';

type RouterParams = {
  // should be a string but we're getting conflict with the match. Indicatig that
  // it should have been parsed to an integer...
  analysisId: number
};

type GetAnalysis = (props: {
  // should have been moved to the store
  id: number,
  museumId: number,
  collectionId: string,
  token: string,
  // callback?: Callback,
  sampleTypes: mixed
}) => void;

type ParentProps = {
  history: History
};

type MountProps = {
  setLoading: () => void,
  clearStore: () => void,
  uploadResultFailed: (errors: Array<string>) => void,
  getAnalysis: GetAnalysis,
  setAnalysisTypes: (types: Array<AnalysisType>) => void,
  appSession: AppSession,
  predefined: Predefined,
  match: Match<RouterParams>,
  analysisExchangeStore: StoreState
} & ParentProps;

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  analysisExchangeStore$
};

const commands = {
  getAnalysis$,
  importResult$,
  uploadResultFailed$,
  clearStore$,
  setAnalysisTypes$
};

const props = (props: MountProps) => ({
  ...props,
  cancelImport: props.history.goBack,
  uploadResult: uploadAnalysisResultAction(
    props.appSession,
    props.analysisExchangeStore,
    props.history.goBack,
    props.uploadResultFailed
  )
});

export const onMount = (props: MountProps) => {
  props.setAnalysisTypes(props.predefined.analysisTypes);
  props.setLoading();
  props.getAnalysis({
    id: props.match.params.analysisId,
    sampleTypes: props.predefined.sampleTypes,
    museumId: props.appSession.museumId,
    collectionId: props.appSession.collectionId,
    token: props.appSession.accessToken
  });
};

export const onUnmount = (props: MountProps) => {
  props.clearStore();
};

const MountedAnalysisResultExchangeComponent = lifeCycle({ onMount, onUnmount })(
  AnalysisResultExchangeComponent
);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  MountedAnalysisResultExchangeComponent
);
