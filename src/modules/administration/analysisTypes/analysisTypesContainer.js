import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisTypesForm from './analysisTypesForm';
import AnalysisTypesComponent from './AnalysisTypesComponent';
import store$, { getAnalysisTypes$ } from './analysisTypesStore';
import Analysis from '../../../models/analysis';
import { makeUrlAware } from '../../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../../shared/mount';
import { toPromise } from '../../../shared/util';

const { form$, updateForm$, loadForm$ } = analysisTypesForm;

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
  saveAnalysisEvent: toPromise(Analysis.saveAnalysisEvent()),
  getAnalysisTypesWithCollectionDetails: toPromise(
    Analysis.getAnalysisTypes()
  )
};

export const onMount = (
  { appSession, getAnalysisTypes, getAnalysisTypesWithCollectionDetails }
) => {
  getAnalysisTypes({
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  });
  getAnalysisTypesWithCollectionDetails({
    museumId: appSession.museumId,
    token: appSession.accessToken
  }).then(a => console.log('Rituvesh', a));
};

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  AnalysisTypesComponent
);
