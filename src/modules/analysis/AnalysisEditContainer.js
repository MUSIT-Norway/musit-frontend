import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisForm from './analysisForm';
import AnalysisEditComponent from './AnalysisEditComponent';
import store$, { getAnalysisTypes$ } from './analysisStore';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import { toPromise } from '../../shared/util';

const { form$, updateForm$, loadForm$ } = analysisForm;

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
  editAnalysisEvent: toPromise(Analysis.editAnalysisEvent()),
  loadAnalysis: toPromise(Analysis.getAnalysisWithDetails())
};

export const onMount = ({ getAnalysisTypes, loadAnalysis, appSession, params, loadForm }) => {
  const inputParams = {
    museumId: appSession.museumId,
    id: params.analysisId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
  getAnalysisTypes(inputParams);
  loadAnalysis(inputParams).then(analysis => loadForm(Analysis.fromJsonToForm(analysis)));
};

export default flowRight([
  inject(data, commands, props),
  mount(onMount),
  makeUrlAware
])(AnalysisEditComponent);
