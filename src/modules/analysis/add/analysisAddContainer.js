import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisAddForm from '../analysisForm';
import AnalysisAddComponent from './AnalysisAddComponent';
import store$, {
  loadAnalysisTypes$,
  getAnalysisTypesForCollection$
} from '../analysisStore';
import Analysis from '../../../models/analysis';
import { makeUrlAware } from '../../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../../shared/mount';
import { toPromise } from '../../../shared/util';

const { form$, updateForm$, loadForm$ } = analysisAddForm;

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$,
  form$
};

const commands = {
  updateForm$,
  loadForm$,
  loadAnalysisTypes$,
  getAnalysisTypesForCollection$
};

const props = {
  saveAnalysisEvent: toPromise(Analysis.saveAnalysisEvent())
};

export const onMount = ({ loadAnalysisTypes, appSession, getAnalysisTypesForCollection }) => {
  const inputParams = {
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken
  };
  loadAnalysisTypes(inputParams);
  getAnalysisTypesForCollection(inputParams);
};

export default flowRight([
  inject(data, commands, props),
  mount(onMount),
  makeUrlAware
])(AnalysisAddComponent);
