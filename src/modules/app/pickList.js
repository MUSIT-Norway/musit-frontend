import { Observable, Subject } from 'rxjs';
import { createStore } from '../../rxjs/RxStore';
import { get as ajaxGet, onComplete, onFailure, toResponse } from '../../rxjs/ajax';
import Config from '../../config';

export const addObject$ = new Subject();
export const removeObject$ = new Subject();
export const toggleObject$ = new Subject();
export const toggleMainObject$ = new Subject();
export const clearObjects$ = new Subject();
export const refreshObject$ = new Subject().flatMap((cmd) =>
  ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/objects/${cmd.id}/currentlocation`, cmd.token)
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd))
);
export const refreshMainObject$ = new Subject().flatMap((cmd) =>
  ajaxGet(`${Config.magasin.urls.thingaggregate.baseUrl(cmd.museumId)}/objects/${cmd.id}/children?${cmd.collectionId.getQuery()}`, cmd.token)
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd))
);

export const addNode$ = new Subject();
export const removeNode$ = new Subject();
export const toggleNode$ = new Subject();
export const clearNodes$ = new Subject();
export const refreshNode$ = new Subject().flatMap((cmd) =>
  ajaxGet(`${Config.magasin.urls.storagefacility.baseUrl(cmd.museumId)}/${cmd.id}`)
    .map(toResponse)
    .do(onComplete(cmd))
    .catch(onFailure(cmd))
);

const addItem = (item, items = []) => {
  if (items.findIndex(node => item.value.id === node.value.id) > -1) {
    return items;
  }
  return items.concat({ marked: false, value: item.value, path: item.path});
};

const toggleItem = ({item, on}, items = []) => {
  const itemsToToggle = [].concat(item);
  return items.map(node => {
    const updatedMark = typeof on !== 'undefined' ? on : !node.marked;
    return {
      ...node,
      marked: itemsToToggle.find(i => i.id === node.value.id) ? updatedMark : node.marked
    };
  });
};

const toggleMainObject = ({item, on}, items = []) => {
  const mainObjectId = item.mainObjectId;
  const toggle = (node) => typeof on !== 'undefined' ? on : !node.marked;
  return items.map(node => ({
    ...node,
    marked: mainObjectId === node.value.mainObjectId ? toggle(node) : node.marked
  }));
};

const removeItem = (item, items = []) => {
  const itemsToRemove = [].concat(item);
  return items.filter(node => itemsToRemove.findIndex(i => i.id === node.value.id) === -1);
};

export const reducer$ = (actions) => Observable.empty().merge(
  actions.toggleObject$.map((item) => (state) => ({...state, objects: toggleItem(item, state.objects)})),
  actions.toggleMainObject$.map((item) => (state) => ({...state, objects: toggleMainObject(item, state.objects)})),
  actions.removeObject$.map((item) => (state) => ({...state, objects: removeItem(item, state.objects)})),
  actions.addObject$.map((item) => (state) => ({...state, objects: addItem(item, state.objects)})),
  actions.refreshObject$.map(() => (state) => ({...state})), // TODO
  actions.refreshMainObject$.map(() => (state) => ({...state})), // TODO
  actions.clearObjects$.map(() => (state) => ({...state, objects: []})),
  actions.toggleNode$.map((item) => (state) => ({...state, nodes: toggleItem(item, state.nodes)})),
  actions.removeNode$.map((item) => (state) => ({...state, nodes: removeItem(item, state.nodes)})),
  actions.addNode$.map((item) => (state) => ({...state, nodes: addItem(item, state.nodes)})),
  actions.refreshNode$.map(() => (state) => ({...state})), // TODO
  actions.clearNodes$.map(() => (state) => ({...state, nodes: []}))
);

export default createStore(reducer$({
  addNode$,
  removeNode$,
  toggleNode$,
  refreshNode$,
  clearNodes$,
  addObject$,
  removeObject$,
  toggleObject$,
  toggleMainObject$,
  refreshObject$,
  refreshMainObject$,
  clearObjects$
}));