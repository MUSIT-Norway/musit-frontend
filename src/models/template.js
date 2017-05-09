/* @flow */
import { simpleGet, ajax } from '../shared/RxAjax';
import Config from '../config';
import type { AjaxGet } from './types/ajax';
import { Observable } from 'rxjs';

class Template {
  static loadTemplates: (ajaxGet: AjaxGet) => (props: { token: string }) => Observable;
  static renderTemplate: (ajaxFn: Function) => (
    props: {
      templateId: number,
      codeFormat: number,
      nodes: Array<{ uuid: string, name: string }>,
      token: string
    }
  ) => Observable;
}

Template.loadTemplates = (ajaxGet = simpleGet) =>
  ({ token }) =>
    ajaxGet(Config.magasin.urls.api.barcode.templatesUrl, token).map(
      ({ response }) => response
    );

Template.renderTemplate = (ajaxFn = ajax) =>
  ({ templateId, codeFormat, nodes, token }) => {
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
    ).map(({ response }) => response);
  };

export default Template;
