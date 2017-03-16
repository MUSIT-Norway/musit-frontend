import inject from 'react-rxjs/dist/RxInject';
import React from 'react';
import analysisAddForm from './analysisAddForm';
import AnalysisAddComponent from './AnalysisAddComponent';
import store$, {
  clearAnalysisTypes$,
  loadAnalysisTypes$
} from './analysisStore';

const { form$, updateForm$, loadForm$ } = analysisAddForm;
const data = {
  form$,
  appSession$: { type: React.PropTypes.object.isRequired },
  store$ };
const commands = { updateForm$, loadForm$, clearAnalysisTypes$, loadAnalysisTypes$ };
export default inject(data, commands)(AnalysisAddComponent);