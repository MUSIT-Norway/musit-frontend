import { simpleGet } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';
import { getPath } from '../shared/util';

class MusitAnalysis {

  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
    this.breadcrumb = getPath(props);
  }
}

MusitAnalysis.getAllAnalysisTypes = (ajaxGet = simpleGet) => ({museumId, token, callback}) => {
  return ajaxGet(`${Config.magasin.urls.api.analysisType.getAllAnalysisTypes(museumId)}`, token, callback)
    .map((analysisTypes) => analysisTypes.response && new MusitAnalysis(analysisTypes.response));
};


export default MusitAnalysis;