// @flow
import inject from 'react-rxjs/dist/RxInject';
import PropTypes from 'prop-types';
import analysisTypesForm from './analysisTypesForm';
import AnalysisTypesComponent from './AnalysisTypesComponent';
import store$, { getAnalysisTypes$ } from './analysisTypesStore';
import Analysis from '../../../models/analysis';
import { makeUrlAware } from '../../../stores/appSession';
import flowRight from 'lodash/flowRight';
import lifeCycle from '../../../shared/lifeCycle';
import { toPromise } from '../../../shared/util';
import type { AppSession } from '../../../types/appSession';

const { form$, updateForm$, loadForm$ } = analysisTypesForm;

type Props = {
  appSession: AppSession,
  getAnalysisTypes: Function
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
  saveAnalysisType: toPromise(Analysis.saveAnalysisEvent())
};

export const onMount = ({ appSession, getAnalysisTypes }: Props) => {
  getAnalysisTypes({
    museumId: appSession.museumId,
    token: appSession.accessToken
  });
};

export default flowRight([
  inject(data, commands, props),
  lifeCycle({ onMount }),
  makeUrlAware
])(AnalysisTypesComponent);
