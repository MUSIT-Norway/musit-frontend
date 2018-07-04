import { Observable } from 'rxjs';
import { createStore } from 'react-rxjs';
import { createAction } from '../../shared/react-rxjs-patch';
import Template from '../../models/template';
import { TODO } from '../../types/common';

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

export const reducer$ = (actions: TODO) =>
  Observable.merge(
    actions.clearAll$.map(() => () => initialState),
    actions.setLevel$.map((level: TODO) => (state: TODO) => ({ ...state, level })),
    actions.clearRendered$.map(() => (state: TODO) => ({ ...state, rendered: null })),
    actions.setTemplateId$.map((templateId: TODO) => (state: TODO) => ({
      ...state,
      templateId
    })),
    actions.loadTemplates$.map((templates: TODO) => (state: TODO) => ({
      ...state,
      templates
    })),
    actions.renderTemplate$.map((rendered: TODO) => (state: TODO) => ({
      ...state,
      rendered
    }))
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
) => createStore('print', reducer$(actions) as TODO, initialState);

export default store$();
