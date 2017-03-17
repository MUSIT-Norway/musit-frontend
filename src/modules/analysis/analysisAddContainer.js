import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisAddForm from './analysisAddForm';
import AnalysisAddComponent from './AnalysisAddComponent';
import store$, {
  clearAnalysisTypes$,
  loadAnalysisTypes$
} from './analysisStore';
import MusitAnalysis from '../../models/analysis';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';


const { form$, updateForm$, loadForm$ } = analysisAddForm;
const data = {
  form$,
  appSession$: { type: React.PropTypes.object.isRequired },
  store$ };
const commands = { updateForm$, loadForm$, clearAnalysisTypes$, loadAnalysisTypes$ };
const props = {
  saveAnalysisEvent: MusitAnalysis.saveAnalysisEvent()
};

export default flowRight([
  inject(data, commands, props),
  mount(p => {
    p.loadAnalysisTypes({
      museumId: p.appSession.getMuseumId(),
      token: p.appSession.getAccessToken()
    });
  }),
  makeUrlAware
])(AnalysisAddComponent);