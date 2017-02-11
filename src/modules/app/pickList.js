import { Observable } from 'rxjs';
import { getPath, customSortingStorageNodeType } from '../../shared/util';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';

export const addObject$ = createAction('addObject$');
export const removeObject$ = createAction('removeObject$');
export const toggleObject$ = createAction('toggleObject$');
export const toggleMainObject$ = createAction('toggleMainObject$');
export const clearObjects$ = createAction('clearObjects$');
export const refreshObjects$ = createAction('refreshObject$').flatMap(MusitObject.getObjectLocations());
export const addNode$ = createAction('addNode$');
export const removeNode$ = createAction('removeNode$');
export const toggleNode$ = createAction('toggleNode$');
export const clearNodes$ = createAction('clearNodes$');
export const refreshNode$ = createAction('refreshNode$').flatMap(MusitNode.getNode());

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

export const getPathString = (pathStr) => {
  const pathStrArr = pathStr.substr(1, pathStr.length - 2).split(',');
  // EX: ,1,2,3,19, will be transformed to ,1,2,3,
  return `,${pathStrArr.slice(0, -1).join(',').toString()},`;
};

const findItem = (itemsToRefresh, n) => {
  return itemsToRefresh.find(item => {
    const isMatchingId = n.value.id === item.id;
    const isMatchingObjectId = n.value.id === item.objectId;
    return isMatchingId || isMatchingObjectId;
  });
};

const getItemPath = (itemToRefresh) => {
  return getPath({
    path: itemToRefresh.objectId ? itemToRefresh.path : getPathString(itemToRefresh.path),
    pathNames: itemToRefresh.pathNames || [
      {
        name: itemToRefresh.name,
        nodeId: itemToRefresh.id // intended
      }
    ]
  });
};

const refreshItem = (oneOrMany, items = []) => {
  const itemsToRefresh = [].concat(oneOrMany);
  return items.map((n) => {
    const itemToRefresh = findItem(itemsToRefresh, n);
    if (itemToRefresh) {
      return {
        ...n,
        path: getItemPath(itemToRefresh)
      };
    }
    return n;
  });
};

const refreshObjects = (state, itemLocations) => {
  return state.objects.map(obj => {
    const objFromServer = itemLocations.find(iloc => iloc.objectId === obj.value.id);
    if (!objFromServer) {
      return obj;
    }
    return {
      ...obj,
      path: getItemPath(objFromServer)
    };
  });
};

export const reducer$ = (actions) => Observable.empty().merge(
  actions.toggleObject$.map((item) => (state) => ({...state, objects: toggleItem(item, state.objects)})),
  actions.toggleMainObject$.map((item) => (state) => ({...state, objects: toggleMainObject(item, state.objects)})),
  actions.removeObject$.map((item) => (state) => ({...state, objects: removeItem(item, state.objects)})),
  actions.addObject$.map((item) => (state) => ({...state, objects: addItem(item, state.objects)})),
  actions.refreshObjects$.map((itemLocations) => (state) => ({...state, objects: refreshObjects(state, itemLocations)})),
  actions.clearObjects$.map(() => (state) => ({...state, objects: []})),
  actions.toggleNode$.map((item) => (state) => ({...state, nodes: toggleItem(item, state.nodes)})),
  actions.removeNode$.map((item) => (state) => ({...state, nodes: removeItem(item, state.nodes)})),
  actions.addNode$.map((item) => (state) => ({...state, nodes: addItem(item, state.nodes)})),
  actions.refreshNode$.map((item) => (state) => ({...state, nodes: refreshItem(item, state.nodes)})),
  actions.clearNodes$.map(() => (state) => ({...state, nodes: []}))
);

export default createStore('pickList', reducer$({
  addNode$,
  removeNode$,
  toggleNode$,
  refreshNode$,
  clearNodes$,
  addObject$,
  removeObject$,
  toggleObject$,
  toggleMainObject$,
  refreshObjects$,
  clearObjects$
}), Observable.of({ nodes: [], objects: []}))
  .map(state => ({
    nodes: orderBy(state.nodes, [(o) => customSortingStorageNodeType(o.value.type), (o) => toLower(o.value.name)]),
    objects: orderBy(state.objects, [(o) => toLower(o.value.museumNo), (o) => toLower(o.value.subNo), (o) => toLower(o.value.term)])
  }));
