import inject from 'react-rxjs/dist/RxInject';
import analysisAddForm from './analysisAddForm';
import AnalysisAddComponent from './AnalysisAddComponent';

const { form$, updateForm$, loadForm$ } = analysisAddForm;
const data = { form$ };
const commands = { updateForm$, loadForm$ };
export default inject(data, commands)(AnalysisAddComponent);