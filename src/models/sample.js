import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import Object from './object';
import { Observable } from 'rxjs';

class Sample {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Sample.addSample = (ajaxPost = simplePost) => ({museumId, token, data, callback}) => {
  const url = Config.magasin.urls.api.samples.baseUrl(museumId);
  return ajaxPost(url, data, token, callback).map(({response}) => response);
};

Sample.editSample = (ajaxPut = simplePut) => ({id, museumId, token, data, callback}) => {
  const baseUrl= Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  return ajaxPut(url, data, token, callback).map(({response}) => response && new Sample(response));
};

Sample.loadSample = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  const baseUrl= Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  return ajaxGet(url, token, callback).map(({ response }) => response && new Sample(response));
};

Sample.loadSamplesForObject  = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  const url=Config.magasin.urls.api.thingaggregate.objectDetailsUrl(museumId,id);
  const objResp = Object.getObjectDetails(ajaxGet)({id,museumId,token}).map(({response}) => response);
  const sampleRes= ajaxGet(url, token, callback).map(({response})=> response);
  return Observable.of({...objResp, data: sampleRes});
};

export default Sample;