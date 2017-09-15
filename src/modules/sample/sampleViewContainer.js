import { RxInjectLegacy as inject } from 'react-rxjs';
import SampleViewComponent from './SampleViewComponent';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from '../../shared/lifeCycle';
import flowRight from 'lodash/flowRight';
import sampleStore$, { getSample$, clear$ } from './sampleStore';
import objectStore$, { loadObject$, clearStore$ } from '../objects/objectStore';
import moment from 'moment';
import Config from '../../config';
import type { SampleData } from '../../types/samples';
import type { SampleTypes } from 'types/predefined';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import Sample, { getSampleType } from '../../models/sample';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  sampleStore$,
  objectStore$
};

function getStatusText(sampleData, locale) {
  if (!sampleData) {
    return null;
  }
  const status = Sample.sampleStatuses.find(st => st.id === sampleData.status);
  return locale.isEn ? status.enStatus : status.noStatus;
}

const props = props => {
  const sampleData = props.sampleStore.sample;
  const sampleType = flatten(values(props.predefined.sampleTypes)).find(
    st => sampleData && st.sampleTypeId === sampleData.sampleTypeId
  );
  const statusText = getStatusText(sampleData, props.appSession.language);
  return {
    ...props,
    persons: sampleData ? getPersonsFromResponse(sampleData) : [],
    sampleType: getSampleTypeWithLanguage(sampleType, props.appSession),
    sampleSubType: getSampleSubTypeWithLanguage(sampleType, props.appSession),
    statusText: statusText,
    clickEditSample: clickEditSample(
      props.appSession,
      props.match.params.sampleId,
      props.history.push
    ),
    clickCreateAnalysis: clickCreateAnalysis(
      props.appSession,
      props.sampleStore.sample,
      props.predefined.sampleTypes,
      props.objectStore.objectData,
      props.history.push
    ),
    clickCreateSample: clickCreateSample(
      props.appSession,
      props.sampleStore.sample,
      props.history.push
    ),
    goBack: e => {
      e.preventDefault();
      props.history.goBack();
    }
  };
};

const commands = {
  getSample$,
  loadObject$,
  clearSampleStore$: clear$,
  clearObjectStore$: clearStore$
};

export function onMount(props) {
  const id = props.match.params.sampleId;
  const museumId = props.appSession.museumId;
  const collectionId = props.appSession.collectionId;
  const token = props.appSession.accessToken;
  retrieveSample(id, token, museumId, collectionId, props.getSample, props.loadObject);
}

const onUnmount = props => {
  props.clearSampleStore();
  props.clearObjectStore();
};

const ManagedSampleViewComponent = lifeCycle({ onMount, onUnmount })(SampleViewComponent);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  ManagedSampleViewComponent
);

export function clickEditSample(appSession, sampleId, goTo) {
  return e => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.editSample(appSession, sampleId)
    });
  };
}

export function clickCreateAnalysis(
  appSession,
  sampleData,
  sampleTypes,
  objectData,
  goTo
) {
  return e => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
      state: [
        {
          objectData,
          sampleData: addSampleTypeInformation(sampleData, sampleTypes, appSession)
        }
      ]
    });
  };
}

export function clickCreateSample(appSession, sample, goTo) {
  return e => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.addFromSample(
        appSession,
        sample.objectId
      )
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

export function getSampleTypeWithLanguage(sampleType, appSession) {
  if (sampleType) {
    return appSession.language.isEn ? sampleType.enSampleType : sampleType.noSampleType;
  }
  return null;
}

export function getSampleSubTypeWithLanguage(sampleType, appSession) {
  if (sampleType) {
    return appSession.language.isEn
      ? sampleType.enSampleSubType
      : sampleType.noSampleSubType;
  }
  return null;
}

function addSampleTypeInformation(sample: SampleData, sampleTypes: SampleTypes) {
  const sampleType = getSampleType(sample.sampleTypeId, sampleTypes);

  return {
    ...sample,
    sampleType: sampleType
  };
}

export function retrieveSample(
  sampleId,
  token,
  museumId,
  collectionId,
  getSample,
  loadObject
) {
  getSample({
    token,
    id: sampleId,
    museumId,
    collectionId,
    onComplete: sample => {
      if (sample) {
        loadObject({
          objectId: sample.originatedObjectUuid,
          token,
          museumId,
          collectionId
        });
      }
    }
  });
}
