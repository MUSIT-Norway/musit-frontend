import { simplePost, simpleGet, simplePut } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
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

Sample.loadSamplesForObject = () => () => {
  //TODO: Get object details for object
  const objectDetails = {musNo: 'TRH-V-1234', subNo: '3', term_species: 'Carex saxatilis'};
  const data =  [
    {
      id: '123',
      date: '1992-12-22',
      sampleType: 'Vev',
      sampleSubType: 'DNA',
      status: 'Forrurenset',
      hasAnalyse: true},
    {
      id: '1423',
      date: '1992-12-01',
      sampleType: 'Vev',
      sampleSubType: 'Muscle',
      status: 'Rent',
      hasAnalyse: false},
    {
      id: '1233',
      date: '1992-11-12',
      sampleType: 'Vev',
      sampleSubType: 'Bone',
      status: 'Forrurenset',
      hasAnalyse: false},
    {
      id: '1231',
      date: '1992-12-12',
      sampleType: 'Vev',
      sampleSubType: 'Skin',
      status: 'Forrurenset',
      hasAnalyse: true}];
  //return ajaxGet(url, token, callback).map(({ response }) => response);
  return Observable.of ({ ...objectDetails, data: data});
};

export default Sample;