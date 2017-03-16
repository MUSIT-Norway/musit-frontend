import {simpleGet} from '../shared/RxAjax';
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


export default MusitAnalysis;