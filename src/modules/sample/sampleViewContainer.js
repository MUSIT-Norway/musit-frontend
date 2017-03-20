import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleViewComponent from './SampleViewComponent';
import React from 'react';
import {Observable} from 'rxjs';
import  mount from '../../shared/mount';
import flowRight from 'lodash/flowRight';
import {emitError, emitSuccess} from '../../shared/errors';
import  sampleStore$, {loadForm$} from './sampleStore';

const {form$} = sampleForm;
const data = {
  appSession$: {type: React.PropTypes.instanceOf(Observable).isRequired},
  form$,
  sampleStore$
};

const props = {
  emitSuccess,
  emitError
};

const commands = {loadForm$};

export default flowRight([inject (data, commands, props),mount ((p) => {
  p.loadForm(p);
})]) (SampleViewComponent);


//export default flowRight([(inject (data, commands, props)) , (mount ((p) => (Sample.loadSample(p.params.sampleId)))), (SampleViewComponent)]);