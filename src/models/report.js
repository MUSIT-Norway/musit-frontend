import Config from '../config';
import { apiUrl } from '../shared/util';

class Reports {
  constructor() {
  }
}

Reports.getKDReport = (ajaxGet, token: string, id: number)  => {
  console.log(`${token} ${id}   Hei`);
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(id)}/report`);
  const ret = ajaxGet(url,token);

  console.log('Retur', ret);
  return ret;
};

export default Reports;
