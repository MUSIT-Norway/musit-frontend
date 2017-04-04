import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisAddForm from './analysisAddForm';
import AnalysisEditComponent from './AnalysisEditComponent';
import store$, { getAnalysisTypesForCollection$, loadAnalysis$ } from './analysisStore';
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

const commands = { updateForm$, loadForm$, getAnalysisTypesForCollection$, loadAnalysis$ };

const props = {
  editAnalysisEvent: toPromise(Analysis.editAnalysisEvent())
};

export const onMount = ({ getAnalysisTypesForCollection, loadAnalysis, appSession, params }) => {
  getAnalysisTypesForCollection({
    museumId: appSession.getMuseumId(),
    collectionId: appSession.getCollectionId(),
    token: appSession.getAccessToken()
  });
  loadAnalysis({
    museumId: appSession.getMuseumId(),
    id: params.analysisId,
    collectionId: appSession.getCollectionId(),
    token: appSession.getAccessToken()
  });
};

export default flowRight([
  inject(data, commands, props),
  mount(onMount),
  makeUrlAware
])(AnalysisEditComponent);