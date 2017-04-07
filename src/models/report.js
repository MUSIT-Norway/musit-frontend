import Config from '../config';
import { apiUrl } from '../shared/util';
import { simpleGet } from '../shared/RxAjax';

class Report {}

Report.getKDReport = (ajaxGet = simpleGet) =>
  ({ token, museumId }) => {
    const url = apiUrl(
      `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/report`
    );
    return ajaxGet(url, token).map(({ response }) => response);
  };

export default Report;
