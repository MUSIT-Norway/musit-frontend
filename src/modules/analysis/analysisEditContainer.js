import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisAddForm from './analysisAddForm';
import AnalysisEditComponent from './AnalysisEditComponent';
import store$, { loadAnalysis$, getAnalysisTypesForCollection$ } from './analysisStore';
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

const commands = {
  updateForm$,
  loadForm$,
  getAnalysisTypesForCollection$,
  loadAnalysis$
};

const props = {
  editAnalysisEvent: toPromise(Analysis.editAnalysisEvent()),
  loadAnalysisForForm: toPromise(Analysis.getAnalysisWithDeatils())
};

export const onMount = (
  {
    getAnalysisTypesForCollection,
    loadAnalysisForForm,
    loadAnalysis,
    appSession,
    params,
    loadForm
  }
) => {
  getAnalysisTypesForCollection({
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  });

  const inputParam = {
    museumId: appSession.museumId,
    id: params.analysisId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };

  loadAnalysis(inputParam);

  loadAnalysisForForm(inputParam).then(analysis => {
    const dataForForm = Object.keys(analysis).reduce(
      (obj, attributeName) => [
        ...obj,
        { name: attributeName, defaultValue: analysis[attributeName] }
      ],
      []
    );
    loadForm(dataForForm);
  });
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisEditComponent
);
