import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleViewForm';
import SampleViewComponent from './SampleViewComponent';
import type { ClickEvents } from './SampleViewComponent';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import mount from '../../shared/mount';
import { getSampleType } from '../../models/sample';
import { makeUrlAware } from '../../stores/appSession';
import flowRight from 'lodash/flowRight';
import store$, { getPredefinedTypes$, getSample$ } from './sampleStore';
import moment from 'moment';
import Config from '../../config';
import type { SampleData } from '../../types/samples';
import type { ObjectData } from '../../types/object';
import type { FormDetails } from './types/form';

const { form$, loadForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  form$,
  store$
};

const props: ClickEvents = props => ({
  clickEditSample: (appSession, sampleId, objectData) =>
    clickEditSample(appSession, sampleId, objectData, props.history.push),
  clickCreateAnalysis: (appSession, sample, form, objectData) =>
    clickCreateAnalysis(appSession, sample, form, objectData, props.history.push),
  clickCreateSample: (appSession, sample, form, objectData) =>
    clickCreateSample(appSession, sample, form, objectData, props.history.push),
  goBack: props.history.goBack
});

const commands = { getSample$, loadForm$, getPredefinedTypes$ };

export default flowRight([inject(data, commands, props), mount(onMount), makeUrlAware])(
  SampleViewComponent
);

export function clickEditSample(appSession, sampleId, objectData, goTo) {
  return e => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.editSample(appSession, sampleId),
      state: [objectData]
    });
  };
}

export function clickCreateAnalysis(appSession, sample, form, objectData, goTo) {
  return e => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
      state: [
        {
          ...mergeSampleWithObject(sample, objectData, form)
        }
      ]
    });
  };
}

export function clickCreateSample(appSession, sample, form, objectData, goTo) {
  return e => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.addSample(
        appSession,
        sample.objectId
      ),
      state: [
        {
          ...mergeSampleWithObject(sample, objectData, form)
        }
      ]
    });
  };
}

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

export function convertSample(sample, sampleTypes) {
  const sampleType = getSampleType(sample.sampleTypeId, sampleTypes);
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
  formData.sampleSubType = {
    name: 'sampleSubType',
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
}

export function loadSample(id, museumId, token, getSample, loadForm) {
  return ({ sampleTypes }) =>
    getSample({
      id,
      museumId,
      token,
      onComplete: sample => loadForm(convertSample(sample, sampleTypes))
    });
}

export function onMount({ getSample, getPredefinedTypes, loadForm, match, appSession }) {
  const id = match.params.sampleId;
  const museumId = appSession.museumId;
  const token = appSession.accessToken;
  getPredefinedTypes({
    token: appSession.accessToken,
    onComplete: loadSample(id, museumId, token, getSample, loadForm)
  });
}

function mergeSampleWithObject(
  sample: SampleData,
  objectData: ObjectData,
  form: FormDetails
) {
  return {
    ...objectData,
    ...sample,
    sampleType: form.sampleType.value,
    sampleSubType: form.sampleSubType.value
  };
}
