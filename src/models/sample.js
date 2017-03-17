import { simplePost } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';

class Sample {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Sample.addSample = (ajaxPost = simplePost) => ({museumId, token, data, callback}) => {
  console.log('MuseumID:',museumId);
  const baseUrl= Config.magasin.urls.api.samples.baseUrl(museumId);
  const url = baseUrl;
  return ajaxPost(url, data, token, callback).map(({ response }) => response && new Sample(response));
};

export default Sample;