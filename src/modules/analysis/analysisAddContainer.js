import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisAddForm from './analysisAddForm';
import AnalysisAddComponent from './AnalysisAddComponent';
import store$, {
  clearAnalysisTypes$,
  loadAnalysisTypes$
} from './analysisStore';
import MusitAnalysis from '../../models/analysis';
import { makeUrlAware, AppSession } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import mount from '../../shared/mount';


const { form$, updateForm$, loadForm$ } = analysisAddForm;
const data = {
  form$,
  appSession$: { type: React.PropTypes.object.isRequired },
  store$ };
const commands = { updateForm$, loadForm$, clearAnalysisTypes$, loadAnalysisTypes$ };

const saveAnalysisEvent = () => {
  MusitAnalysis.saveAnalysisEvent()({
    museumId: AppSession.getMuseumId(),
    data: {
      analysisTypeId: form$.analysisTypeId.rawValue || '',
      eventDate: form$.registeredDate.rawValue || '',
      note: form$.note.rawValue || '',
      objectIds: store$.objectsData.map((a) => a.uuid)
    },
    token: AppSession.getAccessToken()
  }).toPromise();
};

const props = {
  //saveAnalysisEvent: (val) => MusitAnalysis.saveAnalysisEvent()(val).toPromise()
  saveAnalysisEvent
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