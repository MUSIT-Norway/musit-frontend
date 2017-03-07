import { Observable } from 'rxjs';
import { createAction, createStore } from 'react-rxjs/dist/RxStore';
import Template from '../../models/template';

export const clearAll$ = createAction('clearAll$');
export const clearRendered$ = createAction('clearRendered$');
export const loadTemplates$ = createAction('loadTemplates$').switchMap(Template.loadTemplates());
export const renderTemplate$ = createAction('renderTemplate$').switchMap(Template.renderTemplate());

const initialState = { templates: [], rendered: null };

export const reducer$ = (actions) => Observable.merge(
  actions.clearAll$.map(() => () => initialState),
  actions.clearRendered$.map(() => (state) => ({...state, rendered: null})),
  actions.loadTemplates$.map((templates) => (state) => ({...state, templates})),
  actions.renderTemplate$.map((rendered) => (state) => ({...state, rendered}))
);

export const store$ = (actions = { clearAll$, clearRendered$, loadTemplates$, renderTemplate$ }) =>
  createStore('print', reducer$(actions), Observable.of(initialState));

export default store$();