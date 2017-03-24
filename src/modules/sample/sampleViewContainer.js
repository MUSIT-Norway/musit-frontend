import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleForm';
import SampleViewComponent from './SampleViewComponent';
import React from 'react';
import {Observable} from 'rxjs';
import  mount from '../../shared/mount';
import {emitError, emitSuccess} from '../../shared/errors';
import Sample from '../../models/sample';
import flowRight from 'lodash/flowRight';

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

export default flowRight([
  inject(data, commands, props),
  mount(({ loadSample, loadForm, params, appSession }) => {
    const sampleId = params.sampleId;
    const museumId = appSession.state.museumId;
    const accessToken = appSession.state.accessToken;
    const i = {id: sampleId, museumId: museumId, token: accessToken};
    loadSample(i).toPromise().then((v) => {
      const formData = Object.keys(v).reduce((akk, key: string) => ([...akk, {name: key, defaultValue: v[key]}]), []);
      loadForm(formData);
    });
  })
])(SampleViewComponent);