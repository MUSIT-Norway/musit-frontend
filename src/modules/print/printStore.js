import { Observable } from 'rxjs';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import * as ajaxMethods from '../../shared/RxAjax';
import Config from '../../config';
import Template from '../../models/template';

export const loadTemplates = ({ simpleGet }) => ({ token }) =>
  simpleGet(Config.magasin.urls.api.barcode.templatesUrl, token)
    .map(({ response }) => response && response.map(json => new Template(json)));

export const renderTemplate = ({ ajax }) => ({ templateId, codeFormat, nodes, token }) => {
  const data = nodes.map(node => ({ uuid: node.uuid, data: [{ field: 'name', value: node.name }] }));
  const url = Config.magasin.urls.api.barcode.templateRenderUrl(templateId, codeFormat);
  return ajax(url, 'POST', data, token, { 'Content-Type': 'application/json' }, 'text/html')
    .map(({response}) => response);
};

export const clearAll$ = createAction('clearAll$');
export const clearRendered$ = createAction('clearRendered$');
export const loadTemplates$ = createAction('loadTemplates$').switchMap(loadTemplates(ajaxMethods));
export const renderTemplate$ = createAction('renderTemplate$').switchMap(renderTemplate(ajaxMethods));

const initialState = { templates: [] };

export const reducer$ = (actions) => Observable.merge(
  actions.clearAll$.map(() => () => initialState),
  actions.clearRendered$.map(() => (state) => ({...state, rendered: null})),
  actions.loadTemplates$.map((templates) => (state) => ({...state, templates})),
  actions.renderTemplate$.map((rendered) => (state) => ({...state, rendered}))
);

const store$ = createStore('print', reducer$({ clearAll$, clearRendered$, loadTemplates$, renderTemplate$ }), Observable.of(initialState));

export default store$;