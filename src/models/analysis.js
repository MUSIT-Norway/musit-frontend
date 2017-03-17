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
  let url= Config.magasin.urls.api.analysis.saveAnalysisEvent(museumId);
  url = 'api/management/99/analyses';
  data = {
    analysisTypeId: '1bbf15cb-8348-4e66-99a4-bc314da57a42',
    eventDate: '2017-03-16T14:37:45+00:00',
    note: 'test record',
    objectIds: ['1cbf15cb-8348-4e66-99a4-bc314da57a42', '2cbf15cb-8348-4e66-99a4-bc314da57a42', '3cbf15cb-8348-4e66-99a4-bc314da57a42']
  };
  return ajaxPost(url, data, token, callback).map(({ response }) => response && new MusitAnalysis(response) );
};


export default MusitAnalysis;