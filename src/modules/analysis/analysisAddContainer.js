import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisAddForm from './analysisAddForm';
import AnalysisAddComponent from './AnalysisAddComponent';
import store$, { loadAnalysisTypes$ } from './analysisStore';
import Analysis from '../../models/analysis';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';
import { toPromise } from '../../shared/util';

const { form$, updateForm$, loadForm$ } = analysisAddForm;

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$,
  form$
};

const commands = { updateForm$, loadForm$, loadAnalysisTypes$ };

const props = {
  saveAnalysisEvent: toPromise(Analysis.saveAnalysisEvent())
};

export const onMount = ({ loadAnalysisTypes, appSession }) => {
  loadAnalysisTypes({
    museumId: appSession.getMuseumId(),
    token: appSession.getAccessToken()
  });
};

export default flowRight([
  inject(data, commands, props),
  mount(onMount),
  makeUrlAware
])(AnalysisAddComponent);