import entries from 'object.entries';
import * as ajaxFunctions from '../shared/RxAjax';
import Config from '../config';

class Template {
  constructor(props) {
    entries(props).forEach(([k, v]) => this[k] = v);
  }
}

Template.loadTemplates = (simpleGet = ajaxFunctions.simpleGet) => ({ token }) =>
  simpleGet(Config.magasin.urls.api.barcode.templatesUrl, token)
    .map(({ response }) => response && response.map(json => new Template(json)));

Template.renderTemplate = (ajax = ajaxFunctions.ajax) => ({ templateId, codeFormat, nodes, token }) => {
  const data = nodes.map(node => ({ uuid: node.uuid, data: [{ field: 'name', value: node.name }] }));
  const url = Config.magasin.urls.api.barcode.templateRenderUrl(templateId, codeFormat);
  return ajax(url, 'POST', data, token, { 'Content-Type': 'application/json' }, 'text/html')
    .map(({response}) => response);
};

export default Template;