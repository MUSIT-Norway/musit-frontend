import { Observable } from 'rxjs';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import Template from '../../models/template';

export const clearAll$ = createAction('clearAll$');
export const setLevel$ = createAction('setLevel$');
export const clearRendered$ = createAction('clearRendered$');
export const setTemplateId$ = createAction('setTemplateId$');
export const loadTemplates$ = createAction('loadTemplates$').switchMap(
  Template.loadTemplates()
);
export const renderTemplate$ = createAction('renderTemplate$').switchMap(
  Template.renderTemplate()
);

const initialState = { templates: [], rendered: null, level: 0 };

export const reducer$ = actions =>
  Observable.merge(
    actions.clearAll$.map(() => () => initialState),
    actions.setLevel$.map(level => state => ({ ...state, level })),
    actions.clearRendered$.map(() => state => ({ ...state, rendered: null })),
    actions.setTemplateId$.map(templateId => state => ({ ...state, templateId })),
    actions.loadTemplates$.map(templates => state => ({ ...state, templates })),
    actions.renderTemplate$.map(rendered => state => ({ ...state, rendered }))
  );

export const store$ = (
  actions = {
    clearAll$,
    clearRendered$,
    loadTemplates$,
    renderTemplate$,
    setTemplateId$,
    setLevel$
  }
) => createStore('print', reducer$(actions), Observable.of(initialState));

export default store$();
