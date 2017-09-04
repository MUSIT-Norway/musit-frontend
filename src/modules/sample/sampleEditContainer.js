import inject from 'react-rxjs/dist/RxInject';
import sampleForm from './sampleEditForm';
import SampleFormComponent from './SampleFormComponent';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from '../../shared/lifeCycle';
import { simplePut } from '../../shared/RxAjax';
import Sample, { getSampleType } from '../../models/sample';
import flowRight from 'lodash/flowRight';
import store$, { getPredefinedTypes$, getSample$ } from './sampleStore';
import objectStore$, { loadObject$, clearStore$ } from '../objects/objectStore';
import {
  getPersonsFromResponse,
  getSampleSubTypeWithLanguage,
  getSampleTypeWithLanguage
} from './sampleViewContainer';
import { sampleProps, saveSample, callback, onComplete } from './shared/submit';
import { loadPredefinedTypes } from '../../stores/predefined';
import type { SampleData } from '../../types/samples';
import type { DomEvent } from '../../types/dom';

const { form$, loadForm$, updateForm$, clearForm$ } = sampleForm;

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  form$,
  store$,
  objectStore$
};

const commands = {
  loadForm$,
  updateForm$,
  getSample$,
  getPredefinedTypes$,
  clearForm$,
  loadObject$,
  clearObjectStore$: clearStore$
};

const props = (props, ajaxPut = simplePut) => {
  return {
    ...props,
    ...sampleProps(props),
    objectData: [
      {
        ...props.objectStore.objectData,
        derivedFrom: props.store.sample &&
          props.store.sample.parentObject.sampleOrObjectData
      }
    ],
    clickSave: (e: DomEvent) => {
      e.preventDefault();
      saveSample(Sample.editSample(ajaxPut))(
        props.form,
        props.store.sample,
        props.predefined.sampleTypes,
        props.objectStore.objectData,
        props.match.params,
        props.appSession,
        props.history,
        callback,
        onComplete(props.history, props.appSession)
      );
    }
  };
};

export function onMount({
  getSample,
  loadObject,
  loadForm,
  match,
  appSession,
  predefined
}) {
  getSample({
    id: match.params.sampleId,
    museumId: appSession.museumId,
    collectionId: appSession.collectionId,
    token: appSession.accessToken,
    onComplete: sample => {
      if (sample) {
        loadForm(convertSample(sample, predefined.sampleTypes, appSession));
        loadObject({
          objectId: sample.originatedObjectUuid,
          token: appSession.accessToken,
          museumId: appSession.museumId,
          collectionId: appSession.collectionId
        });
      }
    }
  });
}

const onUnmount = props => {
  props.clearForm();
  props.clearObjectStore();
};

const ManagedSampleFormComponent = lifeCycle({ onMount, onUnmount })(SampleFormComponent);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  ManagedSampleFormComponent
);

export function convertSample(sample: SampleData, sampleTypes, appSession) {
  const sampleType = getSampleType(sample.sampleTypeId, sampleTypes);
  const formData = {};
  const sampleTypeText = getSampleTypeWithLanguage(sampleType, appSession);
  const sampleSubTypeText = getSampleSubTypeWithLanguage(sampleType, appSession);
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
    defaultValue: sampleTypeText
  };
  formData.sampleSubType = {
    name: 'sampleSubType',
    defaultValue: sampleSubTypeText || sampleTypeText
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
  formData.statusText = {
    name: 'statusText',
    defaultValue: getStatusValue(sample.status, appSession)
  };

  const data = Object.keys(sample).reduce((akk, key: string) => {
    if (akk[key]) {
      return akk;
    }
    return { ...akk, [key]: { name: key, defaultValue: sample[key] } };
  }, formData);

  return Object.values(data);
}

function getStatusValue(v, appSession) {
  if (v) {
    const statuses = Sample.sampleStatuses;
    const s = statuses.find(e => e.id === v);
    if (s) {
      return appSession.language.isEn ? s.enStatus : s.noStatus;
    }
    return null;
  }
}
