// @flow
import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import object from './object';
import { Observable } from 'rxjs';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';
import { omit } from 'lodash';
import uniqBy from 'lodash/uniqBy';

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
      return ajaxGet(url, token).map(({ response }) =>
        uniqBy(response, 'enTreatment').reduce(
          (acc, treatment) => ({
            ...acc,
            [treatment.enTreatment]: response.filter(
              v => v.enTreatment === treatment.enTreatment
            )
          }),
          {}
        ));
    };

  static loadStorageContainer: (AjaxGet) => (
    props: {
      token: string
    }
  ) => Observable = (ajaxGet = simpleGet) =>
    ({ token }) => {
      const url = Config.magasin.urls.api.samples.storagecontainer;
      return ajaxGet(url, token).map(({ response }) =>
        uniqBy(response, 'enStorageContainer').reduce(
          (acc, storageContainer) => ({
            ...acc,
            [storageContainer.enStorageContainer]: response.filter(
              v => v.enStorageContainer === storageContainer.enStorageContainer
            )
          }),
          {}
        ));
    };

  static loadStorageMediums: (AjaxGet) => (
    props: {
      token: string
    }
  ) => Observable = (ajaxGet = simpleGet) =>
    ({ token }) => {
      const url = Config.magasin.urls.api.samples.storagemediums;
      return ajaxGet(url, token).map(({ response }) =>
        uniqBy(response, 'enStorageMedium').reduce(
          (acc, storagemediums) => ({
            ...acc,
            [storagemediums.enStorageMedium]: response.filter(
              v => v.enStorageMedium === storagemediums.enStorageMedium
            )
          }),
          {}
        ));
    };
}

// To clean up after mapping single field to object for backend
Sample.prepareForSubmit = tmpData => ({
  ...omit(tmpData, ['externalIdSource', 'subTypeValue', 'sizeUnit']),
  originatedObjectUuid: tmpData.originatedObjectUuid || tmpData.parentObjectId,
  size: tmpData.size ? { value: tmpData.size, unit: tmpData.sizeUnit } : null,
  sampleType: tmpData.sampleType
    ? { value: tmpData.sampleType, subTypeValue: tmpData.subTypeValue }
    : null,
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

Sample.loadSample = (ajaxGet = simpleGet) =>
  ({ id, museumId, token, callback }) => {
    const baseUrl = Config.magasin.urls.api.samples.baseUrl(museumId);
    const url = `${baseUrl}/${id}`;
    return ajaxGet(url, token, callback).map(({ response }) => response);
  };

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

export default Sample;
