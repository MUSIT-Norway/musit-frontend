// @flow
import Config from '../config';
import { apiUrl } from '../shared/util';
import { simpleGet } from '../shared/RxAjax';
import type { AjaxGet } from '../types/ajax';
import { Observable } from 'rxjs';

class Report {
  static getKDReport: (
    ajaxGet: AjaxGet
  ) => (props: {
    token: string,
    museumId: number
  }) => Observable<*>;
}

Report.getKDReport = (ajaxGet = simpleGet) => ({ token, museumId }) => {
  const url = apiUrl(
    `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/report`
  );
  return ajaxGet(url, token).map(({ response }) => response);
};

export default Report;
