import { Observable } from 'rxjs';
import { getPath, customSortingStorageNodeType } from '../shared/util';
import MusitObject from '../models/object';
import MusitNode from '../models/node';
import { orderBy } from 'lodash';
import { toLower } from 'lodash';
import { createStore } from 'react-rxjs';
import { createAction } from '../shared/react-rxjs-patch';
import { KEEP_ALIVE } from './constants';
import { MUSTFIX, TODO } from '../types/common';

export const addObject$ = createAction('addObject$');
export const addObjects$ = createAction('addObjects$');
export const toggleObject$ = createAction('toggleObject$');
export const removeObject$ = createAction('removeObject$');
export const markObject$ = createAction('markObject$');
export const markMainObject$ = createAction('markMainObject$');
export const clearObjects$ = createAction('clearObjects$');
export const refreshObjects$ = createAction(
  'refreshObject$'
).flatMap(MusitObject.getObjectLocations() as MUSTFIX);
export const addNode$ = createAction('addNode$');
export const toggleNode$ = createAction('toggleNode$');
export const removeNode$ = createAction('removeNode$');
export const markNode$ = createAction('markNode$');
export const clearNodes$ = createAction('clearNodes$');
export const refreshNode$ = createAction(
  'refreshNode$'
).flatMap(MusitNode.getNode() as MUSTFIX);

export const isItemAdded = (item: TODO, items = []) => {
  return (
    items.findIndex((node: TODO) => (item.id || item.objectId) === node.value.id) > -1
  );
};

const addItem = (item: TODO, items: TODO[] = [], toggle?: TODO) => {
  if (items.findIndex((node: TODO) => item.value.id === node.value.id) > -1) {
    if (toggle) {
      return items.filter((node: TODO) => item.value.id !== node.value.id);
    }
    return items;
  }
  return items.concat({ marked: false, value: item.value, path: item.path });
};

const addItems = (itemList: TODO, items = []) => {
  return items.concat(
    itemList.filter((f: TODO) => !items.some((i: TODO) => i.value.id === f.value.id))
  );
};

type ToggleMarkedArgs = {
  item: any;
  on?: boolean;
};

const toggleMarked = ({ item, on }: ToggleMarkedArgs, items = []) => {
  const itemsToToggle = [].concat(item);
  return items.map((node: TODO) => {
    const updatedMark = typeof on !== 'undefined' ? on : !node.marked;
    return {
      ...node,
      marked: itemsToToggle.find((i: TODO) => i.id === node.value.id)
        ? updatedMark
        : node.marked
    };
  });
};

const toggleMainObject = ({ item, on }: ToggleMarkedArgs, items = []) => {
  const mainObjectId = item.mainObjectId;
  const toggle = (node: TODO) => (typeof on !== 'undefined' ? on : !node.marked);
  return items.map((node: Object) => ({
    ...node,
    marked:
      mainObjectId === (node as TODO).value.mainObjectId
        ? toggle(node)
        : (node as TODO).marked
  }));
};

const removeItem = (item: TODO, items = []) => {
  const itemsToRemove = [].concat(item);
  return items.filter(
    (node: TODO) => itemsToRemove.findIndex((i: TODO) => i.id === node.value.id) === -1
  );
};

export const getPathString = (pathStr: string) => {
  const pathStrArr = pathStr.substr(1, pathStr.length - 2).split(',');
  // EX: ,1,2,3,19, will be transformed to ,1,2,3,
  return `,${pathStrArr
    .slice(0, -1)
    .join(',')
    .toString()},`;
};

const findItem = (itemsToRefresh: TODO[], n: TODO) => {
  return itemsToRefresh.find(item => {
    const isMatchingId = n.value.id === item.id;
    const isMatchingObjectId = n.value.id === item.objectId;
    return isMatchingId || isMatchingObjectId;
  });
};

const getItemPath = (itemToRefresh: TODO) => {
  return getPath({
    path: itemToRefresh.objectId ? itemToRefresh.path : getPathString(itemToRefresh.path),
    pathNames: itemToRefresh.pathNames || [
      {
        name: itemToRefresh.name,
        nodeId: itemToRefresh.id // intended
      }
    ]
  } as MUSTFIX);
};

const refreshItem = (oneOrMany: TODO, items = []) => {
  const itemsToRefresh = [].concat(oneOrMany);
  return items.map((n: TODO) => {
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

const refreshObjects = (state: TODO, itemLocations: TODO[]) => {
  return state.objects.map((obj: TODO) => {
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

export const reducer$ = (actions: TODO) =>
  Observable.empty().merge(
    actions.markObject$.map((item: TODO) => (state: TODO) => ({
      ...state,
      objects: toggleMarked(item, state.objects)
    })),
    actions.markMainObject$.map((item: TODO) => (state: TODO) => ({
      ...state,
      objects: toggleMainObject(item, state.objects)
    })),
    actions.removeObject$.map((item: TODO) => (state: TODO) => ({
      ...state,
      objects: removeItem(item, state.objects)
    })),
    actions.addObject$.map((item: TODO) => (state: TODO) => ({
      ...state,
      objects: addItem(item, state.objects)
    })),
    actions.addObjects$.map((items: TODO) => (state: TODO) => ({
      ...state,
      objects: addItems(items, state.objects)
    })),
    actions.toggleObject$.map((item: TODO) => (state: TODO) => ({
      ...state,
      objects: addItem(item, state.objects, true)
    })),
    actions.refreshObjects$.map((itemLocations: TODO) => (state: TODO) => ({
      ...state,
      objects: refreshObjects(state, itemLocations)
    })),
    actions.clearObjects$.map(() => (state: TODO) => ({ ...state, objects: [] })),
    actions.markNode$.map((item: TODO) => (state: TODO) => ({
      ...state,
      nodes: toggleMarked(item, state.nodes)
    })),
    actions.removeNode$.map((item: TODO) => (state: TODO) => ({
      ...state,
      nodes: removeItem(item, state.nodes)
    })),
    actions.addNode$.map((item: TODO) => (state: TODO) => ({
      ...state,
      nodes: addItem(item, state.nodes)
    })),
    actions.toggleNode$.map((item: TODO) => (state: TODO) => ({
      ...state,
      nodes: addItem(item, state.nodes, true)
    })),
    actions.refreshNode$.map((item: TODO) => (state: TODO) => ({
      ...state,
      nodes: refreshItem(item, state.nodes)
    })),
    actions.clearNodes$.map(() => (state: TODO) => ({ ...state, nodes: [] }))
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
    reducer$(actions$) as TODO,
    { nodes: [], objects: [] },
    KEEP_ALIVE
  ).map((state: TODO) => ({
    nodes: orderBy(state.nodes, [
      o => customSortingStorageNodeType(o.value.type),
      o => toLower(o.value.name)
    ]),
    objects: orderBy(state.objects, [
      o => toLower(o.value.museumNo),
      o => toLower(o.value.subNo),
      o => toLower(o.value.term)
    ])
  }));

export default store$();
