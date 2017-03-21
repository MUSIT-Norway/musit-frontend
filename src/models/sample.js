import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';

class Sample {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Sample.addSample = (ajaxPost = simplePost) => ({museumId, token, data, callback}) => {
  const baseUrl= Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = baseUrl;
  return ajaxPost(url, data, token, callback).map(({response}) => response);
};

Sample.editSample = (ajaxPut = simplePut) => ({id,museumId, token, data, callback}) => {
  const baseUrl= Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  return ajaxPut(url, data, token, callback).map(({response}) => response && new Sample(response));

};


Sample.loadSample = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  const baseUrl= Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  return ajaxGet(url, token, callback).map(({ response }) => response && new Sample(response));
};

export default Sample;