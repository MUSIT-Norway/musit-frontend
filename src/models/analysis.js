import {simpleGet, simplePost} from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import orderBy from 'lodash/orderBy';


class MusitAnalysis {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

MusitAnalysis.getAllAnalysisTypes = (ajaxGet = simpleGet) => ({museumId, token, callback}) => {
  return ajaxGet(`${Config.magasin.urls.api.analysisType.getAllAnalysisTypes(museumId)}`, token, callback)
    .map((analysisTypes) => orderBy(analysisTypes.response, ['name'], ['asc']));
};

MusitAnalysis.saveAnalysisEvent = (ajaxPost = simplePost) => ({ museumId, data, token, callback}) => {
  const url= Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
  return ajaxPost(url, data, token, callback).map(({ response }) => response && new MusitAnalysis(response) );
};


MusitAnalysis.getAnalysisById = (ajaxGet = simpleGet) => ({museumId, id, token, callback}) => {
  const url = `${Config.magasin.urls.api.analysis.getAnalysisById(museumId, id)}`;
  return ajaxGet(url, token, callback)
    .map((analysis) =>  analysis.response);
};


export default MusitAnalysis;