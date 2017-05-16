// @flow
import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import object from './object';
import { Observable } from 'rxjs';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';
import type { Callback, AjaxGet, AjaxPost, AjaxPut } from './types/ajax';

class Sample {
  static addSample: (ajaxPost: AjaxPost) => (
    props: {
      museumId: number,
      token: string,
      data: mixed,
      callback?: ?Callback
    }
  ) => Observable;
  static editSample: (ajaxPut: AjaxPut) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      data: mixed,
      callback?: ?Callback
    }
  ) => Observable;
  static loadSample: (ajaxGet: AjaxGet) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;
  static loadSampleDataForObject: (ajaxGet: AjaxGet) => (
    props: {
      id: number,
      museumId: number,
      token: string,
      callback?: ?Callback
    }
  ) => Observable;
  static loadSamplesForObject: (ajaxGet: AjaxGet) => (
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
}

// To clean up after mapping single field to object for backend
Sample.prepareForSubmit = tmpData => ({
  ...tmpData,
  originatedObjectUuid: tmpData.parentObjectId,
  size: tmpData.size ? { value: tmpData.size, unit: tmpData.sizeUnit } : null,
  sampleType: tmpData.sampleType
    ? { value: tmpData.sampleType, subTypeValue: tmpData.subTypeValue }
    : null,
  externalId: tmpData.externalId
    ? { value: tmpData.externalId, source: tmpData.externalIdSource }
    : null,
  externalIdSource:null,
  sizeUnit: null,
  subTypeValue: null
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
