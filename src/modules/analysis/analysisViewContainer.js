import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';

import store$, {
  loadAnalysis$,
  getAnalysisTypesForCollection$
} from './analysisStore';

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$ };
const commands = { loadAnalysis$, getAnalysisTypesForCollection$ };

export default flowRight([
  inject(data, commands),
  mount(p => {
    p.getAnalysisTypesForCollection({
      museumId: p.appSession.getMuseumId(),
      collectionId: p.appSession.getCollectionId().uuid,
      token: p.appSession.getAccessToken()
    });
    p.loadAnalysis({
      museumId: p.appSession.getMuseumId(),
      id: p.params.analysisId,
      collectionId: p.appSession.getCollectionId(),
      token: p.appSession.getAccessToken()
    });
  }),
  makeUrlAware
])(AnalysisViewComponent);