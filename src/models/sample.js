// @flow
import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import { Observable } from 'rxjs';
import { DATE_FORMAT_DISPLAY } from '../shared/util';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';
import { omit } from 'lodash';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import MusitActor from '../models/actor';
import moment from 'moment';
import flatten from 'lodash/flatten';

export type SampleStatus = {
  id: number,
  noStatus?: string,
  enStatus?: string
};

class Sample {
  static addSample: (
    ajaxPost: AjaxPost
  ) => (props: {
    museumId: number,
    token: string,
    data: mixed,
    callback?: Callback
  }) => Observable;
  static editSample: (
    ajaxPut: AjaxPut
  ) => (props: {
    id: number,
    museumId: number,
    token: string,
    data: mixed,
    callback?: Callback
  }) => Observable;
  static loadSample: (
    ajaxGet: AjaxGet
  ) => (props: {
    id: number,
    museumId: number,
    token: string,
    callback?: Callback
  }) => Observable;
  static loadSampleDataForObject: (
    ajaxGet: AjaxGet
  ) => (props: {
    id: number,
    museumId: number,
    token: string,
    callback?: Callback
  }) => Observable;
  static prepareForSubmit: (tmpData: {
    size?: { value: number, unit: string },
    parentObject: { objectId: number, objectType: string },
    sizeUnit: mixed,
    subTypeValue: mixed,
    sampleType: { value: string, subTypeValue: string },
    externalId: { value: string, source: string },
    externalIdSource: mixed
  }) => mixed;
  static loadSampleTypes: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string
  }) => Observable;
  static loadAllSampleTypes: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string,
    language: string
  }) => Observable;
  static loadTreatments: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string
  }) => Observable;
  static loadStorageContainer: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string
  }) => Observable;
  static loadStorageMediums: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string
  }) => Observable;
  static loadPredefinedTypes: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string,
    onComplete: (predefinedTypes: mixed) => void
  }) => Observable;
  static sampleStatuses: Array<SampleStatus>;
  static sampleSizeUnits: Array<string>;
}

Sample.loadPredefinedTypes = (ajaxGet = simpleGet) => props => {
  return Observable.forkJoin([
    Sample.loadStorageContainer(ajaxGet)(props),
    Sample.loadStorageMediums(ajaxGet)(props),
    Sample.loadTreatments(ajaxGet)(props),
    Sample.loadSampleTypes(ajaxGet)(props)
  ])
    .map(([storageContainers, storageMediums, treatments, sampleTypes]) => ({
      storageContainers,
      storageMediums,
      treatments,
      sampleTypes
    }))
    .do(props.onComplete);
};

Sample.loadSampleTypes = (ajaxGet = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.samples.sampleTypes;
  return ajaxGet(url, token).map(({ response }) =>
    uniqBy(response, 'enSampleType').reduce(
      (acc, sampleType) => ({
        ...acc,
        [sampleType.enSampleType]: response.filter(
          v => v.enSampleType === sampleType.enSampleType
        )
      }),
      {}
    )
  );
};
Sample.loadAllSampleTypes = (ajaxGet = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.samples.sampleTypes;
  return ajaxGet(url, token).map(({ response }) => response);
};

Sample.loadTreatments = (ajaxGet = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.samples.treatments;
  return ajaxGet(url, token).map(({ response }) => response);
};

Sample.loadStorageContainer = (ajaxGet = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.samples.storagecontainer;
  return ajaxGet(url, token).map(({ response }) => response);
};

Sample.loadStorageMediums = (ajaxGet = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.samples.storagemediums;
  return ajaxGet(url, token).map(({ response }) => response);
};

// To clean up after mapping single field to object for backend
Sample.prepareForSubmit = tmpData => ({
  ...omit(tmpData, [
    'externalIdSource',
    'subTypeValue',
    'sizeUnit',
    'sampleType',
    'updatedBy',
    'updatedByName',
    'updatedDate',
    'registeredBy',
    'registeredByName',
    'registeredDate',
    'persons'
  ]),
  isExtracted: true,
  originatedObjectUuid: tmpData.originatedObjectUuid || tmpData.parentObject.objectId,
  size: tmpData.size ? { value: tmpData.size, unit: tmpData.sizeUnit } : null,
  externalId: tmpData.externalId
    ? { value: tmpData.externalId, source: tmpData.externalIdSource }
    : null
});

Sample.addSample = (ajaxPost = simplePost) => ({ museumId, token, data, callback }) => {
  const url = Config.magasin.urls.api.samples.baseUrl(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response);
};

Sample.editSample = (ajaxPut = simplePut) => ({
  id,
  museumId,
  token,
  data,
  callback
}) => {
  const baseUrl = Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  return ajaxPut(url, data, token, callback).map(({ response }) => response);
};

Sample.loadSample = (ajaxGet = simpleGet, ajaxPost = simplePost) => ({
  id,
  museumId,
  token,
  callback
}) => {
  const baseUrl = Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  return ajaxGet(url, token, callback)
    .map(({ response }) => response)
    .flatMap(sampleJson => {
      return MusitActor.getActors(ajaxPost)({
        token: token,
        actorIds: uniq(
          [
            sampleJson.responsible && sampleJson.responsible,
            sampleJson.registeredStamp.user,
            sampleJson.updatedStamp && sampleJson.updatedStamp.user,
            sampleJson.doneByStamp && sampleJson.doneByStamp.user
          ].filter(uuid => !!uuid)
        )
      }).map(actors => {
        if (!actors || actors.length === 0) {
          return sampleJson;
        }
        return {
          ...sampleJson,
          doneByStamp: {
            ...sampleJson.doneByStamp,
            name: sampleJson.doneByStamp
              ? getActorName(actors, sampleJson.doneByStamp.user)
              : null
          },
          responsible: {
            user: sampleJson.responsible,
            name: sampleJson.responsible
              ? getActorName(actors, sampleJson.responsible)
              : null
          },
          registeredStamp: {
            ...sampleJson.registeredStamp,
            name: getActorName(actors, sampleJson.registeredStamp.user)
          },
          updatedStamp: {
            ...sampleJson.updatedStamp,
            name: sampleJson.updatedStamp
              ? getActorName(actors, sampleJson.updatedStamp.user)
              : null
          }
        };
      });
    });
};

export function getSampleType(sampleTypeId: number, sampleTypesMap: mixed) {
  return flatten(Object.values(sampleTypesMap)).find(
    subType => sampleTypeId === subType.sampleTypeId
  );
}

function getActorName(actors, actorId) {
  const actor = actors.find(a => MusitActor.hasActorId(a, actorId));
  if (actor) {
    return actor.fn;
  }
  return null;
}

Sample.loadSampleDataForObject = (ajaxGet = simpleGet) => ({
  id,
  museumId,
  token,
  callback
}) => {
  const url = Config.magasin.urls.api.samples.samplesForObject(museumId, id);
  return ajaxGet(url, token, callback).map(
    ({ response }) =>
      (response &&
        response.map(r => ({
          ...r,
          doneDate: r.doneDate
            ? moment(r.doneByStamp.date).format(DATE_FORMAT_DISPLAY)
            : null,
          registeredDate: moment(r.registeredStamp.date).format(DATE_FORMAT_DISPLAY)
        }))) || []
  );
};

export const STATUS_INTACT_ID = 1;

Sample.sampleStatuses = [
  {
    id: STATUS_INTACT_ID,
    noStatus: 'Intakt',
    enStatus: 'Intact'
  },
  {
    id: 2,
    noStatus: 'Ødelagt',
    enStatus: 'Destroyed'
  },
  {
    id: 3,
    noStatus: 'Kontaminert',
    enStatus: 'Contaminated'
  },
  {
    id: 4,
    noStatus: 'Preparert',
    enStatus: 'Prepared'
  },
  {
    id: 5,
    noStatus: 'Kassert',
    enStatus: 'Discarded'
  },
  {
    id: 6,
    noStatus: 'Uttørket',
    enStatus: 'Dehydrated'
  },
  {
    id: 7,
    noStatus: 'Oppbrukt',
    enStatus: 'Consumed'
  },
  {
    id: 8,
    noStatus: 'Kansellert',
    enStatus: 'Canceled'
  },
  {
    id: 9,
    noStatus: 'Degradert',
    enStatus: 'Degraded'
  },
  {
    id: 10,
    noStatus: 'Montert',
    enStatus: 'Mounted'
  }
];

Sample.sampleSizeUnits = ['µg', 'mg', 'g', 'hg', 'µl', 'ml', 'cl', 'dl', 'l', 'cm3'];

export default Sample;
