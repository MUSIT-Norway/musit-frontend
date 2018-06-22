// @flow
import { simpleGet, ajaxHelper } from '../shared/RxAjax';
import Config from '../config';
import { AjaxGet } from '../types/ajax';
import { Observable } from 'rxjs';
import { Star, TODO } from '../types/common';

class Template {
  static loadTemplates: (
    ajaxGet?: AjaxGet<Star>
  ) => (props: { token: string }) => Observable<Star>;
  static renderTemplate: (
    ajaxFn?: Function
  ) => (
    props: {
      templateId: number;
      codeFormat: number;
      nodes: Array<{ uuid: string; name: string }>;
      token: string;
    }
  ) => Observable<Star>;
}

Template.loadTemplates = (ajaxGet = simpleGet) => ({ token }) =>
  ajaxGet(Config.magasin.urls.api.barcode.templatesUrl, token).map(
    ({ response }) => response
  );

Template.renderTemplate = (ajaxFn = ajaxHelper) => ({
  templateId,
  codeFormat,
  nodes,
  token
}) => {
  const data = nodes.map(node => ({
    uuid: node.uuid,
    data: [{ field: 'name', value: node.name }]
  }));
  const url = Config.magasin.urls.api.barcode.templateRenderUrl(templateId, codeFormat);
  return ajaxFn(
    url,
    'POST',
    data,
    token,
    { 'Content-Type': 'application/json' },
    'text/html'
  ).map(({ response }: TODO) => response);
};

export default Template;
