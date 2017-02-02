import Config from '../config';
import { apiUrl } from '../shared/util';

class Reports {
}

Reports.getKDReport = (ajaxGet, token: string, id: number)  => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(id)}/report`);
  return ajaxGet(url,token);
};

export default Reports;
