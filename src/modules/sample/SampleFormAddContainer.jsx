import React from 'react';
import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleFormAdd';
import SampleFormAddComponent from './SampleFormAddComponent'

const { form$, updateForm$ } = sampleForm;
const data = { form$ };
const commands = { updateForm$ };
export default inject(data, commands)(SampleFormAddComponent);