import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleFormAddComponent from './SampleAddComponent';
import Sample from '../../models/sample';
import {emitError, emitSuccess} from '../../shared/errors';
import  sampleStore$, { clearSample$} from './sampleStore';

const {form$, updateForm$} = sampleForm;
const data = {form$, sampleStore$};
const props = {
  addSample: Sample.addSample(),
  emitSuccess,
  emitError
};

const commands = {updateForm$, clearSample$};
export default inject(data, commands, props)(SampleFormAddComponent);