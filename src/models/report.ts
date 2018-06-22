// @flow
import Config from '../config';
import { apiUrl } from '../shared/util';
import { simpleGet } from '../shared/RxAjax';
import { AjaxGet } from '../types/ajax';
import { Observable } from 'rxjs';
import { Star } from '../types/common';

class Report {
  static getKDReport: (
    ajaxGet?: AjaxGet<Star>
  ) => (
    props: {
      token: string;
      museumId: number;
    }
  ) => Observable<Star>;
}

Report.getKDReport = (ajaxGet = simpleGet) => ({ token, museumId }) => {
  const url = apiUrl(
    `${Config.magasin.urls.api.storagefacility.baseUrl(museumId)}/report`
  );
  return ajaxGet(url, token).map(({ response }) => response);
};

export default Report;
