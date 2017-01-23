import { Observable, Subject } from 'rxjs';
import { createStore } from '../../state/RxStore';
import { get as ajaxGet, del as ajaxDelete } from '../../state/ajax';
import Config from '../../config';
import MusitObject from '../../shared/models/object';
import { getPath } from '../../shared/util';

export const addObject$ = new Subject();
export const removeObject$ = new Subject();
export const toggleObject$ = new Subject();
export const toggleMainObject$ = new Subject();
export const clearObjects$ = new Subject();
export const refreshObject$ = new Subject();

export const addNode$ = new Subject();
export const removeNode$ = new Subject();
export const toggleNode$ = new Subject();
export const clearNodes$ = new Subject();
export const refreshNode$ = new Subject();

const addItem = (item, items = []) => {
  if (items.findIndex(node => item.value.id === node.value.id) > -1) {
    return items;
  }
  return items.concat({ marked: false, value: item.value, path: item.path});
};

export const reducer$ = (actions) => Observable.empty().merge(
  actions.addObject$.map((item) => (state) => ({...state, objects: addItem(item, state.objects)})),
  actions.clearObjects$.map(() => (state) => ({...state, objects: []})),
  actions.addNode$.map((item) => (state) => ({...state, nodes: addItem(item, state.nodes)})),
  actions.clearNodes$.map(() => (state) => ({...state, nodes: []}))
);

export default createStore(reducer$({addNode$, clearNodes$, addObject$, clearObjects$}));