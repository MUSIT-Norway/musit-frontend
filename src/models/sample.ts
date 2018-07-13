// @flow
import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import { Observable } from 'rxjs';
import { DATE_FORMAT_DISPLAY } from '../shared/util';
import { Callback, AjaxGet, AjaxPost, AjaxPut } from '../types/ajax';
import { SampleData } from '../types/samples';
import { omit, uniq, uniqBy, flatten } from 'lodash';
import MusitActor from './actor';
import MusitObject from './object';
import * as moment from 'moment';
import { Star, mixed, Maybe, MUSTFIX, TODO } from '../types/common';
import { SampleType, SampleTypes } from '../types/sample';
import { Actor } from '../types/actor';

export type SampleStatus = {
  id: number;
  noStatus?: string;
  enStatus?: string;
};

class Sample {
  static addSample: (
    ajaxPost: AjaxPost<Star>
  ) => (
    props: {
      museumId: number;
      token: string;
      data: mixed;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static editSample: (
    ajaxPut: AjaxPut<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      data: mixed;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static loadSample: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      collectionId: string;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<SampleData>;
  static loadSampleDataForObject: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      id: string;
      museumId: number;
      token: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
  static prepareForSubmit: (
    tmpData: {
      [key: string]:
        | Maybe<string>
        | Maybe<number>
        | Maybe<{ user: Maybe<string>; date: string }>
        | { value: number; unit: string }
        | { objectId: string; objectType: string; sampleOrObjectData?: any };
      size?: { value: number; unit: string };
      parentObject: { objectId: string; objectType: string; sampleOrObjectData?: any };
      sizeUnit: Maybe<string>;
      externalId: Maybe<string>;
      externalIdSource: Maybe<string>;
    }
  ) => mixed;
  static loadSampleTypes: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      token: string;
      isEn: string;
    }
  ) => Observable<Star>;
  static loadAllSampleTypes: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      token: string;
    }
  ) => Observable<Star>;
  static loadTreatments: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      token: string;
    }
  ) => Observable<Star>;
  static loadStorageContainer: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      token: string;
    }
  ) => Observable<Star>;
  static loadStorageMediums: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      token: string;
    }
  ) => Observable<Star>;
  static loadPredefinedTypes: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      token: string;
      isEn: string;
      onComplete: (predefinedTypes: mixed) => void;
    }
  ) => Observable<Star>;
  static sampleStatuses: Array<SampleStatus>;
  static sampleSizeUnits: Array<string>;
  static loadSamplesForNode: (
    ajaxGet: AjaxGet<Star>
  ) => (
    props: {
      nodeId: string;
      museumId: number;
      token: string;
      collectionId: string;
      callback?: Callback<Star>;
    }
  ) => Observable<Star>;
}

Sample.loadPredefinedTypes = (ajaxGet: AjaxGet<TODO> = simpleGet) => props => {
  return Observable.forkJoin(
    Sample.loadStorageContainer(ajaxGet)(props),
    Sample.loadStorageMediums(ajaxGet)(props),
    Sample.loadTreatments(ajaxGet)(props),
    Sample.loadSampleTypes(ajaxGet)(props)
  )
    .map(([storageContainers, storageMediums, treatments, sampleTypes]) => ({
      storageContainers,
      storageMediums,
      treatments,
      sampleTypes
    }))
    .do(props.onComplete);
};

(Sample.loadSampleTypes as TODO) = (ajaxGet: AjaxGet<SampleType[]> = simpleGet) => ({
  token,
  isEn
}: TODO) => {
  const url = Config.magasin.urls.api.samples.sampleTypes;
  return ajaxGet(url, token).map(({ response }: TODO) => {
    if (isEn) {
      return {
        ...uniqBy(response, 'enSampleType').reduce(
          (acc, sampleType) => ({
            ...acc,
            [(sampleType as MUSTFIX).enSampleType]: response.filter(
              (v: TODO) => v.enSampleType === (sampleType as MUSTFIX).enSampleType
            )
          }),
          {}
        ),
        raw: response
      };
    }
    return {
      ...uniqBy(response, 'noSampleType').reduce(
        (acc, sampleType) => ({
          ...acc,
          [(sampleType as TODO).noSampleType]: response.filter(
            (v: TODO) => v.noSampleType === (sampleType as TODO).noSampleType
          )
        }),
        {}
      ),
      raw: response
    };
  });
};
Sample.loadAllSampleTypes = (ajaxGet: AjaxGet<SampleType[]> = simpleGet) => ({
  token
}) => {
  const url = Config.magasin.urls.api.samples.sampleTypes;
  return ajaxGet(url, token).map(({ response }: TODO) => response);
};

Sample.loadTreatments = (ajaxGet: AjaxGet<TODO> = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.samples.treatments;
  return ajaxGet(url, token).map(({ response }) => response);
};

Sample.loadStorageContainer = (ajaxGet: AjaxGet<TODO> = simpleGet) => ({ token }) => {
  const url = Config.magasin.urls.api.samples.storagecontainer;
  return ajaxGet(url, token).map(({ response }) => response);
};

Sample.loadStorageMediums = (ajaxGet: AjaxGet<TODO> = simpleGet) => ({ token }) => {
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
  return ajaxPost(url, data, token, callback);
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
  return ajaxPut(url, data, token, callback);
};

Sample.loadSample = (ajaxGet = simpleGet, ajaxPost = simplePost) => ({
  id,
  museumId,
  collectionId,
  token,
  callback
}) => {
  const url = (sampleId: TODO) =>
    Config.magasin.urls.api.samples.getSample(museumId, sampleId);
  return ajaxGet(url(id), token, callback)
    .map(({ response }) => response)
    .flatMap(sampleJson => {
      if (sampleJson.parentObject.objectType === 'sample') {
        const sampleUrl = url(sampleJson.parentObject.objectId);
        return ajaxGet(sampleUrl, token).map(subSampleRes => {
          return {
            ...sampleJson,
            parentObject: {
              ...sampleJson.parentObject,
              sampleOrObjectData: subSampleRes.response
            }
          };
        });
      } else if (sampleJson.parentObject.objectType === 'collection') {
        return MusitObject.getObjectWithCurrentLocation(ajaxGet)({
          objectId: sampleJson.parentObject.objectId || sampleJson.originatedObjectUuid,
          museumId,
          collectionId,
          token
        }).map(subSample => {
          return {
            ...sampleJson,
            parentObject: { ...sampleJson.parentObject, sampleOrObjectData: subSample }
          };
        });
      }
      return Observable.of(sampleJson);
    })
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

export function getSampleType(sampleTypeId: number, sampleTypesMap: SampleTypes) {
  return flatten(Object.values(sampleTypesMap)).find(
    (subType: any) => sampleTypeId === subType.sampleTypeId
  );
}

function getActorName(actors: Actor[], actorId: Maybe<string>) {
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
  const url = Config.magasin.urls.api.samples.originatedFromObject(museumId, id);
  return ajaxGet(url, token, callback).map(
    ({ response }) =>
      (response &&
        response.map((r: TODO) => ({
          ...r,
          doneDate: r.doneDate
            ? moment(r.doneByStamp.date).format(DATE_FORMAT_DISPLAY)
            : null,
          registeredDate: moment(r.registeredStamp.date).format(DATE_FORMAT_DISPLAY)
        }))) ||
      []
  );
};

Sample.loadSamplesForNode = (ajaxGet = simpleGet) => ({
  nodeId,
  museumId,
  token,
  collectionId,
  callback
}) => {
  const url = Config.magasin.urls.api.samples.samplesForNode(
    museumId,
    nodeId,
    collectionId
  );
  return ajaxGet(url, token, callback).map(({ response }) => response);
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
    noStatus: 'Kansellert',
    enStatus: 'Canceled'
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

Sample.sampleSizeUnits = ['µg', 'mg', 'g', 'hg', 'µl', 'ml', 'cl', 'dl', 'l', 'cm3'];

export default Sample;
