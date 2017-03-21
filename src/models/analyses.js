import { simpleGet } from '../shared/RxAjax';
import Config from '../config';
import entries from 'object.entries';

class Analyses {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Analyses.getAnalysesForObject = (ajaxGet = simpleGet) => ({museumId, token, id, callback}) => {
  const url= Config.magasin.urls.api.analysis.analysesForObject(museumId, id);
  return ajaxGet(url, token, callback).map(({ response }) => response);
};

export default Analyses;