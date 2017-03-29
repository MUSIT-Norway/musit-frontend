import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import AnalysisViewComponent from './AnalysisViewComponent';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';

import store$, {
  loadAnalysis$
} from './analysisStore';

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$ };
const commands = { loadAnalysis$ };

export default flowRight([
  inject(data, commands),
  mount(p => {
    p.loadAnalysis({
      museumId: p.appSession.getMuseumId(),
      id: p.params.analysisId,
      token: p.appSession.getAccessToken()
    });
  }),
  makeUrlAware
])(AnalysisViewComponent);