import { Observable } from 'rxjs';
import { getPath, customSortingStorageNodeType } from '../shared/util';
import MusitObject from '../models/object';
import MusitNode from '../models/node';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';
import { createStore, createAction } from 'react-rxjs/dist/RxStore';
import { KEEP_ALIVE } from './constants';
import { uniqWith } from 'lodash';

export const addObject$ = createAction('addObject$');
export const addObjects$ = createAction('addObjects$');
export const adding$ = createAction('adding$');
export const toggleObject$ = createAction('toggleObject$');
export const removeObject$ = createAction('removeObject$');
export const markObject$ = createAction('markObject$');
export const markMainObject$ = createAction('markMainObject$');
export const clearObjects$ = createAction('clearObjects$');
export const refreshObjects$ = createAction('refreshObject$').flatMap(
  MusitObject.getObjectLocations()
);
export const addNode$ = createAction('addNode$');
export const toggleNode$ = createAction('toggleNode$');
export const removeNode$ = createAction('removeNode$');
export const markNode$ = createAction('markNode$');
export const clearNodes$ = createAction('clearNodes$');
export const refreshNode$ = createAction('refreshNode$').flatMap(MusitNode.getNode());

export const isItemAdded = (item, items = []) => {
  return items.findIndex(node => (item.id || item.objectId) === node.value.id) > -1;
};

const addItem = (item, items = [], toggle) => {
  if (items.findIndex(node => item.value.id === node.value.id) > -1) {
    if (toggle) {
      return items.filter(node => item.value.id !== node.value.id);
    }
    return items;
  }
  return items.concat({ marked: false, value: item.value, path: item.path });
};

const addItems = (itemList, items = []) => {
  return items.concat(itemList.filter(f => !items.some(i => i.value.id===f.value.id) ))
};

const toggleMarked = ({ item, on }, items = []) => {
  const itemsToToggle = [].concat(item);
  return items.map(node => {
    const updatedMark = typeof on !== 'undefined' ? on : !node.marked;
    return {
      ...node,
      marked: itemsToToggle.find(i => i.id === node.value.id) ? updatedMark : node.marked
    };
  });
};

const toggleMainObject = ({ item, on }, items = []) => {
  const mainObjectId = item.mainObjectId;
  const toggle = node => (typeof on !== 'undefined' ? on : !node.marked);
  return items.map(node => ({
    ...node,
    marked: mainObjectId === node.value.mainObjectId ? toggle(node) : node.marked
  }));
};

const removeItem = (item, items = []) => {
  const itemsToRemove = [].concat(item);
  return items.filter(
    node => itemsToRemove.findIndex(i => i.id === node.value.id) === -1
  );
};

export const getPathString = pathStr => {
  const pathStrArr = pathStr.substr(1, pathStr.length - 2).split(',');
  // EX: ,1,2,3,19, will be transformed to ,1,2,3,
  return `,${pathStrArr
    .slice(0, -1)
    .join(',')
    .toString()},`;
};

const findItem = (itemsToRefresh, n) => {
  return itemsToRefresh.find(item => {
    const isMatchingId = n.value.id === item.id;
    const isMatchingObjectId = n.value.id === item.objectId;
    return isMatchingId || isMatchingObjectId;
  });
};

const getItemPath = itemToRefresh => {
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
  return items.map(n => {
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
    const objFromServer = itemLocations.find(iloc => iloc.objectId === obj.value.uuid);
    if (!objFromServer) {
      return obj;
    }
    return {
      ...obj,
      path: getItemPath(objFromServer)
    };
  });
};

export const reducer$ = actions =>
  Observable.empty().merge(
    actions.markObject$.map(item => state => ({
      ...state,
      objects: toggleMarked(item, state.objects)
    })),
    actions.markMainObject$.map(item => state => ({
      ...state,
      objects: toggleMainObject(item, state.objects)
    })),
    actions.removeObject$.map(item => state => ({
      ...state,
      objects: removeItem(item, state.objects)
    })),
    actions.addObject$.map(item => state => ({
      ...state,
      objects: addItem(item, state.objects)
    })),
    actions.addObjects$.map(items => state => ({
      ...state,
      objects: addItems(items, state.objects),
      adding: false
    })),
    actions.adding$.map(() => state => ({
      ...state,
      adding: true
    })),
    actions.toggleObject$.map(item => state => ({
      ...state,
      objects: addItem(item, state.objects, true)
    })),
    actions.refreshObjects$.map(itemLocations => state => ({
      ...state,
      objects: refreshObjects(state, itemLocations)
    })),
    actions.clearObjects$.map(() => state => ({ ...state, objects: [] })),
    actions.markNode$.map(item => state => ({
      ...state,
      nodes: toggleMarked(item, state.nodes)
    })),
    actions.removeNode$.map(item => state => ({
      ...state,
      nodes: removeItem(item, state.nodes)
    })),
    actions.addNode$.map(item => state => ({
      ...state,
      nodes: addItem(item, state.nodes)
    })),
    actions.toggleNode$.map(item => state => ({
      ...state,
      nodes: addItem(item, state.nodes, true)
    })),
    actions.refreshNode$.map(item => state => ({
      ...state,
      nodes: refreshItem(item, state.nodes)
    })),
    actions.clearNodes$.map(() => state => ({ ...state, nodes: [] }))
  );

export const store$ = (
  actions$ = {
    addNode$,
    toggleNode$,
    removeNode$,
    markNode$,
    refreshNode$,
    clearNodes$,
    addObject$,
    addObjects$,
    adding$,
    toggleObject$,
    removeObject$,
    markObject$,
    markMainObject$,
    refreshObjects$,
    clearObjects$
  }
) =>
  createStore(
    'pickList',
    reducer$(actions$),
    { nodes: [], objects: [], adding: false },
    KEEP_ALIVE
  ).map(state => ({
    nodes: orderBy(state.nodes, [
      o => customSortingStorageNodeType(o.value.type),
      o => toLower(o.value.name)
    ]),
    objects: orderBy(state.objects, [
      o => toLower(o.value.museumNo),
      o => toLower(o.value.subNo),
      o => toLower(o.value.term)
    ]),
    adding: state.adding
  }));

export default store$();
