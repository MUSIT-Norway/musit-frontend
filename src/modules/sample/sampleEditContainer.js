import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleForm';
import SampleEditComponent from './SampleEditComponent';
import React from 'react';
import {Observable} from 'rxjs';
import  mount from '../../shared/mount';
import {emitError, emitSuccess} from '../../shared/errors';
import Sample from '../../models/sample';


const {form$, loadForm$, updateForm$} = sampleForm;
const data = {
  appSession$: {type: React.PropTypes.instanceOf(Observable).isRequired},
  form$
};

const props = {
  loadSample: Sample.loadSample(),
  editSample: Sample.editSample(),
  emitSuccess,
  emitError
};

const commands = {loadForm$, updateForm$};

export default inject (data, commands, props) (mount ((p) => {
  const sampleId = p.params.sampleId;
  const museumId = p.appSession.state.museumId;
  const accessToken = p.appSession.state.accessToken;
  const i = {id: sampleId, museumId: museumId, token: accessToken};
  p.loadSample(i).toPromise().then ((v)=> {
    const  r = Object.keys(v).reduce((akk, key: string) => ([...akk, {name: key, defaultValue: v[key]}]), []);
    p.loadForm(r);
  } );
}) (SampleEditComponent));