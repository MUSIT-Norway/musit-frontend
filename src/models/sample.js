import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';

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

Sample.loadSamplesForObject = (ajaxGet = simpleGet) => ({id, museumId, token, callback}) => {
  //TODO: Get object details for object
  const objectDetails = {museNo: 'TRH-V-1234', subNo: '3', term_species: 'Carex saxatilis'};
  const url= Config.magasin.urls.api.samplesForObject(museumId,id);
  const samples = ajaxGet(url, token, callback).map(({ response }) => response);
  return { ...objectDetails, data: samples};
};

export default Sample;