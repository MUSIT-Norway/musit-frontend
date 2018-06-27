// @flow
import { RxInjectLegacy as inject } from '../../../shared/react-rxjs-patch/';
import * as PropTypes from 'prop-types';
import analysisTypesForm from './analysisTypesForm';
import AnalysisTypesComponent from './AnalysisTypesComponent';
import store$, { getAnalysisTypes$ } from './analysisTypesStore';
import Analysis from '../../../models/analysis';
import { flowRight } from 'lodash';
import lifeCycle from '../../../shared/lifeCycle';
import { toPromise } from '../../../shared/util';
import { AppSession } from '../../../types/appSession';
import { simplePost } from '../../../shared/RxAjax';

const { form$, updateForm$, loadForm$ } = analysisTypesForm;

type Props = {
  appSession: AppSession;
  getAnalysisTypes: Function;
};
const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$,
  getAnalysisTypes$
};

const props = {
  saveAnalysisType: toPromise(Analysis.saveAnalysisEvent(simplePost))
};

export const onMount = ({ appSession, getAnalysisTypes }: Props) => {
  getAnalysisTypes({
    museumId: appSession.museumId,
    token: appSession.accessToken
  });
};

export default flowRight([inject(data, commands, props), lifeCycle({ onMount })])(
  AnalysisTypesComponent
);
