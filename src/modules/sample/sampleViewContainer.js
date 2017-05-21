import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleViewForm';
import SampleViewComponent from './SampleViewComponent';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import mount from '../../shared/mount';
import { emitError, emitSuccess } from '../../shared/errors';
import Sample from '../../models/sample';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import store$, { loadSampleTypes$ } from './sampleStore';
import flatten from 'lodash/flatten';
import { toPromise } from 'shared/util';

const { form$, loadForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const props = {
  loadSample: toPromise(Sample.loadSample()),
  emitSuccess,
  emitError
};

const commands = { loadForm$, loadSampleTypes$ };

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  SampleViewComponent
);

export function onMount({ loadSample, loadSampleTypes, loadForm, params, appSession }) {
  const sampleId = params.sampleId;
  const museumId = appSession.museumId;
  const accessToken = appSession.accessToken;
  const val = { id: sampleId, museumId: museumId, token: accessToken };
  loadSampleTypes({
    token: accessToken,
    onComplete: types => {
      loadSample(val).then(v => {
        const sampleType = flatten(Object.values(types)).find(
          subType => v.sampleTypeId === subType.sampleTypeId
        );
        const formData = Object.keys(v).reduce(
          (akk, key: string) => {
            switch (key) {
              case 'responsible': {
                return [
                  ...akk,
                  {
                    name: 'persons',
                    defaultValue: [
                      { name: v[key].name, uuid: v[key].value, role: 'responsible' }
                    ]
                  }
                ];
              }
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
                  {
                    name: 'subTypeValue',
                    defaultValue: sampleType.enSampleSubType || sampleType.enSampleType
                  }
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
  });
}
