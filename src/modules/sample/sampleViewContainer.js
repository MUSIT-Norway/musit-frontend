import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleAddForm';
import SampleViewComponent from './SampleViewComponent';
import React from 'react';
import {Observable} from 'rxjs';
import  mount from '../../shared/mount';
//import flowRight from 'lodash/flowRight';
import {emitError, emitSuccess} from '../../shared/errors';
import Sample from '../../models/sample';


const {form$, loadForm$} = sampleForm;
const data = {
  appSession$: {type: React.PropTypes.instanceOf(Observable).isRequired},
  form$
};

const props = {
  loadSample: Sample.loadSample(),
  emitSuccess,
  emitError
};

const commands = {loadForm$};

/*export default flowRight([inject (data, commands, props),(mount ((p) => {
  p.loadForm(p);
}) (SampleViewComponent))]);*/


export default inject (data, commands, props) (mount ((p) => {
  console.log('Props', p);
  const sampleId = p.params.sampleId;
  const museumId = p.appSession.state.museumId;
  const accessToken = p.appSession.state.accessToken;
  const i = {id: sampleId, museumId: museumId, token: accessToken};
  console.log('I', i);
  p.loadSample(i).toPromise().then ((v)=> {
    const  r = Object.keys(v).reduce((akk, key: string) => ([...akk, {name: key, defaultValue: v[key]}]), []);
    p.loadForm(r);
  } );
}) (SampleViewComponent));


//export default flowRight([(inject (data, commands, props)) , (mount ((p) => (Sample.loadSample(p.params.sampleId)))), (SampleViewComponent)]);