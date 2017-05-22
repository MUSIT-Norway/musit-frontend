// @flow
import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import object from './object';
import { Observable } from 'rxjs';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';
import { omit } from 'lodash';
import uniqBy from 'lodash/uniqBy';
import MusitActor from '../models/actor';

export type SampleStatus = {id: number, noStatus:string|null, enStatus:string|null};

class Sample {
  static addSample: (AjaxPost) => (
    props: {
      museumId: number,
      token: string,
      data: mixed,
      callback?: ?Callback
    }
  ) => Observable;
  static editSample: (AjaxPut) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      data: mixed,
      callback?: ?Callback
    }
  ) => Observable;
  static loadSample: (AjaxGet) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;
  static loadSampleDataForObject: (AjaxGet) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;
  static loadSamplesForObject: (AjaxGet) => (
    props: {
      objectId: number,
      museumId: number,
      collectionId: string,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;

  static prepareForSubmit: (
    tmpData: {
      size?: { value: number, unit: string },
      parentObjectId: number,
      sizeUnit: mixed,
      subTypeValue: mixed,
      sampleType: { value: string, subTypeValue: string },
      externalId: { value: string, source: string },
      externalIdSource: mixed
    }
  ) => mixed;
  static loadSampleTypes: (AjaxGet) => (
    props: {
      token: string
    }
  ) => Observable = (ajaxGet = simpleGet) =>
    ({ token }) => {
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
        ));
    };

  static loadTreatments: (AjaxGet) => (
    props: {
      token: string
    }
  ) => Observable = (ajaxGet = simpleGet) =>
    ({ token }) => {
      const url = Config.magasin.urls.api.samples.treatments;
      return ajaxGet(url, token).map(({ response }) => response);
    };

  static loadStorageContainer: (AjaxGet) => (
    props: {
      token: string
    }
  ) => Observable = (ajaxGet = simpleGet) =>
    ({ token }) => {
      const url = Config.magasin.urls.api.samples.storagecontainer;
      return ajaxGet(url, token).map(({ response }) => response);
    };

  static loadStorageMediums: (AjaxGet) => (
    props: {
      token: string
    }
  ) => Observable = (ajaxGet = simpleGet) =>
    ({ token }) => {
      const url = Config.magasin.urls.api.samples.storagemediums;
      return ajaxGet(url, token).map(({ response }) => response);
    };

  static getSampleStatuses: () => Array<SampleStatus>;
  static getSampleSizeUnits: () => Array<string>;
}

// To clean up after mapping single field to object for backend
Sample.prepareForSubmit = tmpData => ({
  ...omit(tmpData, ['externalIdSource', 'subTypeValue', 'sizeUnit', 'sampleType']),
  originatedObjectUuid: tmpData.originatedObjectUuid || tmpData.parentObjectId,
  size: tmpData.size ? { value: tmpData.size, unit: tmpData.sizeUnit } : null,
  externalId: tmpData.externalId
    ? { value: tmpData.externalId, source: tmpData.externalIdSource }
    : null
});

Sample.addSample = (ajaxPost = simplePost) =>
  ({ museumId, token, data, callback }) => {
    const url = Config.magasin.urls.api.samples.baseUrl(museumId);
    return ajaxPost(url, data, token, callback).map(({ response }) => response);
  };

Sample.editSample = (ajaxPut = simplePut) =>
  ({ id, museumId, token, data, callback }) => {
    const baseUrl = Config.magasin.urls.api.samples.baseUrl(museumId);
    const url = `${baseUrl}/${id}`;
    return ajaxPut(url, data, token, callback).map(({ response }) => response);
  };

Sample.loadSample = (ajaxGet = simpleGet, ajaxPost = simplePost) =>
  ({ id, museumId, token, callback }) => {
    const baseUrl = Config.magasin.urls.api.samples.baseUrl(museumId);
    const url = `${baseUrl}/${id}`;
    return ajaxGet(url, token, callback)
      .map(({ response }) => response)
      .flatMap(sampleJson => {
        return MusitActor.getActors(ajaxPost)({
          token: token,
          actorIds: [sampleJson.responsible.value, sampleJson.registeredStamp.user]
        }).map(actors => {
          if (!actors || actors.length === 0) {
            return sampleJson;
          }
          return {
            ...sampleJson,
            responsible: {
              ...sampleJson.responsible,
              name: getActorName(actors, sampleJson.responsible.value)
            },
            registeredStamp: {
              ...sampleJson.registeredStamp,
              name: getActorName(actors, sampleJson.registeredStamp.user)
            }
          };
        });
      });
  };

function getActorName(actors, actorId) {
  const actor = actors.find(a => MusitActor.hasActorId(a, actorId));
  if (actor) {
    return actor.fn;
  }
  return null;
}

Sample.loadSampleDataForObject = (ajaxGet = simpleGet) =>
  ({ id, museumId, token, callback }) => {
    const url = Config.magasin.urls.api.samples.samplesForObject(museumId, id);
    return ajaxGet(url, token, callback).map(
      ({ response }) =>
        (response &&
          response.map(r => ({
            ...r,
            doneDate: parseISODate(r.doneDate, DATE_FORMAT_DISPLAY)
          }))) || []
    );
  };

Sample.loadSamplesForObject = (ajaxGet = simpleGet) =>
  ({ objectId, museumId, token, collectionId, callback }) => {
    const url = Config.magasin.urls.api.samples.samplesForObject(museumId, objectId);
    const objResp = object.getObjectDetails(ajaxGet)({
      id: objectId,
      museumId,
      token,
      collectionId
    });
    const sampleRes = ajaxGet(url, token, callback).map(e => e.response);
    return Observable.forkJoin(sampleRes, objResp).map(([samples, obj]) => {
      return {
        ...obj,
        data: samples.map(a => ({
          ...a,
          doneDate: parseISODate(a.doneDate, DATE_FORMAT_DISPLAY)
        }))
      };
    });
  };

Sample.getSampleStatuses = () => [
  {
    id: 1,
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
    noStatus: 'Uttørket',
    enStatus: 'Dessicated'
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

Sample.getSampleSizeUnits = () => [
  'µg',
  'mg',
  'g',
  'hg',
  'µl',
  'ml',
  'cl',
  'dl',
  'l',
  'cm3'
];

export default Sample;
