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
    museumId: appSession.getMuseumId(),
    collectionId: appSession.getCollectionId().uuid,
    token: appSession.getAccessToken()
  });

  loadAnalysisForForm({
    museumId: appSession.getMuseumId(),
    id: params.analysisId,
    collectionId: appSession.getCollectionId(),
    token: appSession.getAccessToken()
  })
    .then(analysis => {
      const dataForForm = Object.keys(analysis).reduce(
        (obj, attributeName) => [
          ...obj,
          { name: attributeName, defaultValue: analysis[attributeName] }
        ],
        []
      );
      loadForm(dataForForm);
    });

  loadAnalysis({
    museumId: appSession.getMuseumId(),
    id: params.analysisId,
    collectionId: appSession.getCollectionId(),
    token: appSession.getAccessToken()
  });
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisEditComponent
);
