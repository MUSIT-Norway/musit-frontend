import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleForm';
import SampleViewComponent from './SampleViewComponent';
import React from 'react';
import { Observable } from 'rxjs';
import mount from '../../shared/mount';
import { emitError, emitSuccess } from '../../shared/errors';
import Sample from '../../models/sample';
import flowRight from 'lodash/flowRight';

const { form$, loadForm$ } = sampleForm;

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  form$
};

const props = {
  loadSample: Sample.loadSample(),
  emitSuccess,
  emitError
};

const commands = { loadForm$ };

export default flowRight([
  inject(data, commands, props),
  mount(({ loadSample, loadForm, params, appSession }) => {
    const sampleId = params.sampleId;
    const museumId = appSession.museumId;
    const accessToken = appSession.accessToken;
    const val = { id: sampleId, museumId: museumId, token: accessToken };
    loadSample(val).toPromise().then(v => {
      const formData = Object.keys(v).reduce(
        (akk, key: string) => {
          switch (key) {
            case 'sampleType': {
              return [...akk,
                {name: 'sampleType', defaultValue: v[key].value},
                {name: 'subTypeValue', defaultValue: v[key].subTypeValue}];
            }
            case 'externalId': {
              return [...akk,
                {name: 'externalId', defaultValue: v[key].value},
                {name: 'externalIdSource', defaultValue: v[key].source}];
            }
            case 'size': {
              return [...akk,
                {name: 'size', defaultValue: v[key].value},
                {name: 'sizeUnit', defaultValue: v[key].unit}];
            }
            default: {
              return [...akk, {name: key, defaultValue: v[key]}];
            }
          }
        },
        []
      );
      console.log('Formdata', formData);
      loadForm(formData);
    });
  })
])(SampleViewComponent);
