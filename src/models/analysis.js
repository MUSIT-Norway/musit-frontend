import {simpleGet, simplePost} from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import orderBy from 'lodash/orderBy';

class Analysis {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Analysis.getAllAnalysisTypes = (ajaxGet = simpleGet) => ({museumId, token, callback}) => {
  return ajaxGet(`${Config.magasin.urls.api.analysisType.getAllAnalysisTypes(museumId)}`, token, callback)
    .map(({ response }) => orderBy(response, ['name'], ['asc']));
};

Analysis.saveAnalysisEvent = (ajaxPost = simplePost) => ({ museumId, data, token, callback}) => {
  const url= Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response && new Analysis(response) );
};

Analysis.getAnalysesForObject = (ajaxGet = simpleGet) => ({museumId, token, id, callback}) => {
  const url= Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

Analysis.getAnalysisById = (ajaxGet = simpleGet) => ({museumId, id, token, callback}) => {
  const url = `${Config.magasin.urls.api.analysis.getAnalysisById(museumId, id)}`;
  return ajaxGet(url, token, callback)
    .map((analysis) =>  analysis.response);
};

export default Analysis;
