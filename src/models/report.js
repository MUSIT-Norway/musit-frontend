import Config from '../config';
import entries from 'object.entries';
import { apiUrl } from '../shared/util';

class Report {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Report.getKDReport = (ajaxGet) => (token: string, id: number)  => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(id)}/report`);
  const r = ajaxGet(url,token).map(({ response }) => response && new Report(response));
  console.log(r);
  return r;
};

export default Report;
