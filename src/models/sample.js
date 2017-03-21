import { simplePost, simpleGet } from '../shared/RxAjax';
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
  const resp = ajaxPost(url, data, token, callback);
  return resp.map(({response}) => response);
};


Sample.loadSample = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  const baseUrl= Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = `${baseUrl}/${id}`;
  console.log('URL', url, token);
  return ajaxGet(url, token, callback).map(({ response }) => response && new Sample(response));
};

export default Sample;