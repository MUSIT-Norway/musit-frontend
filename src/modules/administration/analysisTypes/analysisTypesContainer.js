// @flow
import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisTypesForm from './analysisTypesForm';
import AnalysisTypesComponent from './AnalysisTypesComponent';
import store$, { getAnalysisTypes$ } from './analysisTypesStore';
import Analysis from 'models/analysis';
import { makeUrlAware } from '../../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../../shared/mount';
import { toPromise } from '../../../shared/util';
import type { AppSession } from 'types/appSession';

const { form$, updateForm$, loadForm$ } = analysisTypesForm;

type Props = {
  appSession: AppSession,
  getAnalysisTypes: Function
};
const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
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

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisTypesComponent
);
