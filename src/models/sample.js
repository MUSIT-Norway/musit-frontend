import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import object from './object';
import { Observable } from 'rxjs';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../shared/util';

class Sample {}

// To clean up after mapping single field to object for backend
Sample.prepareForSubmit = tmpData => {
  if (tmpData.size) {
    if (!tmpData.size.value) {
      delete tmpData.size;
    }
    if (tmpData.size && !tmpData.size.unit) {
      delete tmpData.sizeUnit;
    }
  }
  if (tmpData.sampleType) {
    if (!tmpData.sampleType.value) {
      delete tmpData.sampleType;
    }
    if (tmpData.sampleType && !tmpData.sampleType.subTypeValue) {
      delete tmpData.subTypeValue;
    }
  }

  if (tmpData.externalId) {
    if (!tmpData.externalId.value) {
      delete tmpData.externalId;
    }
    if (tmpData.externalId && !tmpData.externalId.source) {
      delete tmpData.externalIdSource;
    }
  }
  return tmpData;
};

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
            createdDate: parseISODate(r.createdDate, DATE_FORMAT_DISPLAY)
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
    const r = Observable.forkJoin(sampleRes, objResp).map(([samples, obj]) => {
      return {
        ...obj,
        data: samples.map(a => ({
          ...a,
          createdDate: parseISODate(a.createdDate, DATE_FORMAT_DISPLAY)
        }))
      };
    });
    return r;
  };

export default Sample;
