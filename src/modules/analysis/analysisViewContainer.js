import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import AnalysisViewComponent from './AnalysisViewComponent';
import {makeUrlAware} from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';

import store$, {
  loadAnalysis$,
  getAnalysisTypesForCollection$
} from './analysisStore';

const data = {
  appSession$: {type: React.PropTypes.object.isRequired},
  store$
};
const commands = {loadAnalysis$, getAnalysisTypesForCollection$};


export const onMount = ({getAnalysisTypesForCollection, appSession, loadAnalysis, params}) => {
  getAnalysisTypesForCollection({
    museumId: appSession.getMuseumId(),
    collectionId: appSession.getCollectionId().uuid,
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
  inject(data, commands),
  mount(onMount),
  makeUrlAware
])(AnalysisViewComponent);