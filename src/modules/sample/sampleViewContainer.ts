import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import SampleViewComponent from './SampleViewComponent';
import * as PropTypes from 'prop-types';
import { Observable } from 'rxjs';
import lifeCycle from '../../shared/lifeCycle';
import { flowRight, values, flatten } from 'lodash';
import sampleStore$, { getSample$, clear$ } from './sampleStore';
import objectStore$, { loadObject$, clearStore$ } from '../objects/objectStore';
import * as moment from 'moment';
import Config from '../../config';
import { SampleData } from '../../types/samples';
import { SampleTypes, SampleType } from '../../types/sample';
import { loadPredefinedTypes } from '../../stores/predefinedLoader';
import Sample, { getSampleType } from '../../models/sample';
import { Language, AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  predefined$: { type: PropTypes.object.isRequired },
  sampleStore$,
  objectStore$
};

function getStatusText(sampleData: SampleData, locale: Language) {
  if (!sampleData) {
    return null;
  }
  const status = Sample.sampleStatuses.find(st => st.id === sampleData.status)!;
  return locale.isEn ? status.enStatus : status.noStatus;
}

const props = (props: TODO) => {
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
    goBack: (e: Event) => {
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

export function onMount(props: TODO) {
  const id = props.match.params.sampleId;
  const museumId = props.appSession.museumId;
  const collectionId = props.appSession.collectionId;
  const token = props.appSession.accessToken;
  retrieveSample(id, token, museumId, collectionId, props.getSample, props.loadObject);
}

const onUnmount = (props: TODO) => {
  props.clearSampleStore();
  props.clearObjectStore();
};

const ManagedSampleViewComponent = lifeCycle({ onMount, onUnmount })(SampleViewComponent);

export default flowRight([inject(data, commands, props), loadPredefinedTypes])(
  ManagedSampleViewComponent
);

export function clickEditSample(appSession: AppSession, sampleId: TODO, goTo: TODO) {
  return (e: Event) => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.editSample(appSession, sampleId)
    });
  };
}

export function clickCreateAnalysis(
  appSession: AppSession,
  sampleData: SampleData,
  sampleTypes: TODO,
  objectData: TODO,
  goTo: TODO
) {
  return (e: Event) => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
      state: [
        {
          objectData,
          sampleData: addSampleTypeInformation(sampleData, sampleTypes /*, appSession*/)
        }
      ]
    });
  };
}

export function clickCreateSample(appSession: AppSession, sample: TODO, goTo: TODO) {
  return (e: Event) => {
    e.preventDefault();
    goTo({
      pathname: Config.magasin.urls.client.analysis.addFromSample(
        appSession,
        sample.objectId
      )
    });
  };
}

export function getPersonsFromResponse(response: TODO) {
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

export function getSampleTypeWithLanguage(
  sampleType: SampleType,
  appSession: AppSession
) {
  if (sampleType) {
    return appSession.language.isEn ? sampleType.enSampleType : sampleType.noSampleType;
  }
  return null;
}

export function getSampleSubTypeWithLanguage(
  sampleType: SampleType,
  appSession: AppSession
) {
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
  sampleId: TODO,
  token: string,
  museumId: TODO,
  collectionId: TODO,
  getSample: Function,
  loadObject: Function
) {
  getSample({
    token,
    id: sampleId,
    museumId,
    collectionId,
    onComplete: (sample: TODO) => {
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
