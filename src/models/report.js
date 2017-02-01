import Config from '../config';
import { apiUrl } from '../../shared/util';

class Reports {
  constructor(museumId: number) {
    this.id = museumId;
  }
}

Reports.getKDReport = (ajaxGet, token: string)  => {
  const url = apiUrl(`${Config.magasin.urls.storagefacility.baseUrl(this.id)}/report`);
  return ajaxGet(url, token);
}

export default Reports;
