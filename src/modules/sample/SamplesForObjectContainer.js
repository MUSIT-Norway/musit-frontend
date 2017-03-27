import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleForm';
import SamplesForObjectComponent from 'SamplesForObjectComponent';import React from 'react';
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
  loadSamplesForObject: Sample.loadSamplesForObject(),
  emitSuccess,
  emitError
};


const commands = {loadForm$};

export default flowRight([
  inject(data, commands, props),
  mount(({ loadSamplesForObject, loadForm, params, appSession }) => {
    const objectId = params.parentId;
    const museumId = appSession.state.museumId;
    const accessToken = appSession.state.accessToken;
    const val = {objectId: objectId, museumId: museumId, token: accessToken};
    loadSamplesForObject(val).toPromise().then((v) => {
      const formData = Object.keys(v).reduce((akk, key: string) => ([...akk, {name: key, defaultValue: v[key]}]), []);
      loadForm(formData);
    });
  })
])(SamplesForObjectComponent);