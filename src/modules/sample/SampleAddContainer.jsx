import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleFormAddComponent from './SampleAddComponent';

const { form$, updateForm$ } = sampleForm;
const data = { form$ };
const commands = { updateForm$ };
export default inject(data, commands)(SampleFormAddComponent);