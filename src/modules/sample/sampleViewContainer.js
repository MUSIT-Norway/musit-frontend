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
import store$, { getPredefinedTypes$ } from './sampleStore';
import flatten from 'lodash/flatten';
import { toPromise } from '../../shared/util';
import moment from 'moment';

const { form$, loadForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const props = {
  getSample: toPromise(Sample.loadSample()),
  emitSuccess,
  emitError
};

const commands = { loadForm$, getPredefinedTypes$ };

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  SampleViewComponent
);

export function getPersonsFromResponse(response) {
  let persons = [];
  if (response.doneByStamp && response.doneByStamp.user) {
    persons.push({
      name: response.doneByStamp.name,
      uuid: response.doneByStamp.user,
      role: 'creator',
      date: moment(response.doneByStamp.date).format()
    });
  }
  if (response.responsible && response.responsible.user) {
    persons.push({
      name: response.responsible.name,
      uuid: response.responsible.user,
      role: 'responsible'
    });
  }
  return persons;
}

export function convertSample(sampleTypes) {
  return sample => {
    const sampleType = flatten(Object.values(sampleTypes)).find(
      subType => sample.sampleTypeId === subType.sampleTypeId
    );
    const formData = {};
    formData.persons = {
      name: 'persons',
      defaultValue: getPersonsFromResponse(sample)
    };
    formData.updatedByName = {
      name: 'updatedByName',
      defaultValue: sample.updatedStamp ? sample.updatedStamp.name : null
    };
    formData.updatedDate = {
      name: 'updatedDate',
      defaultValue: sample.updatedStamp ? sample.updatedStamp.date : null
    };
    formData.registeredByName = {
      name: 'registeredByName',
      defaultValue: sample.registeredStamp.name
    };
    formData.registeredDate = {
      name: 'registeredDate',
      defaultValue: sample.registeredStamp.date
    };
    formData.sampleType = {
      name: 'sampleType',
      defaultValue: sampleType ? sampleType.enSampleType : null
    };
    formData.subTypeValue = {
      name: 'subTypeValue',
      defaultValue: sampleType
        ? sampleType.enSampleSubType || sampleType.enSampleType
        : null
    };
    formData.externalId = {
      name: 'externalId',
      defaultValue: sample.externalId ? sample.externalId.value : null
    };
    formData.externalIdSource = {
      name: 'externalIdSource',
      defaultValue: sample.externalId ? sample.externalId.source : null
    };
    formData.size = {
      name: 'size',
      defaultValue: sample.size ? sample.size.value : null
    };
    formData.sizeUnit = {
      name: 'sizeUnit',
      defaultValue: sample.size ? sample.size.unit : null
    };
    const data = Object.keys(sample).reduce((akk, key: string) => {
      if (akk[key]) {
        return akk;
      }
      return { ...akk, [key]: { name: key, defaultValue: sample[key] } };
    }, formData);
    return Object.values(data);
  };
}

export function loadSample(id, museumId, token, getSample, loadForm) {
  return ({ sampleTypes }) => {
    return getSample({ id, museumId, token })
      .then(convertSample(sampleTypes))
      .then(res => {
        loadForm(res);
        return res; // simulate do operator in rxjs for a promise
      });
  };
}

export function onMount({ getSample, getPredefinedTypes, loadForm, params, appSession }) {
  const id = params.sampleId;
  const museumId = appSession.museumId;
  const token = appSession.accessToken;
  getPredefinedTypes({
    token: appSession.accessToken,
    onComplete: loadSample(id, museumId, token, getSample, loadForm)
  });
}
