import Config from '../config';
import { apiUrl } from '../shared/util';

class Reports {

}

Reports.getKDReport = (ajaxGet, token: string, id: number)  => {
  console.log(token);
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(id)}/report`);
  const ret = ajaxGet(url,token);
  console.log(ret);
  return ret;
};

export default Reports;
