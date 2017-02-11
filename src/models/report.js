import Config from '../config';
import entries from 'object.entries';
import { apiUrl } from '../shared/util';
import { simpleGet } from '../shared/RxAjax';

class Report {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Report.getKDReport = (ajaxGet = simpleGet) => ({ token, museumId }) => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(museumId)}/report`);
  return ajaxGet(url, token).map(({response}) => {
    return response && new Report(response);
  });
};

export default Report;
