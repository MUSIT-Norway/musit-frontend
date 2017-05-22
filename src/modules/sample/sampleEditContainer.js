import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleEditForm';
import SampleFormComponent from './SampleFormComponent';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from 'shared/mount';
import { emitError, emitSuccess } from 'shared/errors';
import { toPromise } from 'shared/util';
import Sample from 'models/sample';
import { makeUrlAware } from 'modules/app/appSession';
import flowRight from 'lodash/flowRight';
import store$, { loadSampleTypes$, loadPredefinedTypes$ } from './sampleStore';
import flatten from 'lodash/flatten';

const { form$, loadForm$, updateForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const commands = { loadForm$, updateForm$, loadSampleTypes$, loadPredefinedTypes$ };

const props = {
  loadSample: toPromise(Sample.loadSample()),
  addSample: toPromise(Sample.editSample()),
  emitSuccess,
  emitError
};

export default flowRight([
  inject(data, commands, props),
  lifeCycle(onMount, onProps),
  makeUrlAware
])(SampleFormComponent);

function onMount({ loadSampleTypes, appSession, loadPredefinedTypes }) {
  const token = appSession.accessToken;
  loadSampleTypes({
    token
  });
  loadPredefinedTypes({ token });
}

function onProps({ store, loadForm, loadSample, params, appSession }) {
  if (!store.sampleTypes) {
    return;
  }
  loadSample({
    id: params.sampleId,
    museumId: appSession.museumId,
    token: appSession.accessToken
  }).then(v => {
    const sampleType = flatten(Object.values(store.sampleTypes)).find(
      subType => v.sampleTypeId === subType.sampleTypeId
    );
    const formData = Object.keys(v).reduce(
      (akk, key: string) => {
        switch (key) {
          case 'sampleType': {
            return [
              ...akk,
              { name: 'sampleType', defaultValue: v[key].value },
              { name: 'subTypeValue', defaultValue: v[key].subTypeValue }
            ];
          }
          case 'externalId': {
            return [
              ...akk,
              { name: 'externalId', defaultValue: v[key].value },
              { name: 'externalIdSource', defaultValue: v[key].source }
            ];
          }
          case 'size': {
            return [
              ...akk,
              { name: 'size', defaultValue: v[key].value },
              { name: 'sizeUnit', defaultValue: v[key].unit }
            ];
          }
          case 'sampleTypeId': {
            return [
              ...akk,
              { name: 'sampleType', defaultValue: sampleType.enSampleType },
              { name: 'subTypeValue', defaultValue: sampleType.sampleTypeId }
            ];
          }
          default: {
            return [...akk, { name: key, defaultValue: v[key] }];
          }
        }
      },
      []
    );
    loadForm(formData);
  });
}
