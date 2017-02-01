import { Observable, Subject } from 'rxjs';
import { getPath, customSortingStorageNodeType } from '../../shared/util';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';
import { createStore } from 'react-rxjs/dist/RxStore';
import { simpleGet } from '../../shared/RxAjax';

export const addObject$ = new Subject();
export const removeObject$ = new Subject();
export const toggleObject$ = new Subject();
export const toggleMainObject$ = new Subject();
export const clearObjects$ = new Subject();
export const refreshObject$ = new Subject().flatMap((cmd) =>
  MusitObject.getObjectLocation(cmd.id, cmd.museumId, cmd.token, cmd)
    .map(location => ({...location, objectId: cmd.id}))
);
export const addNode$ = new Subject();
export const removeNode$ = new Subject();
export const toggleNode$ = new Subject();
export const clearNodes$ = new Subject();
export const refreshNode$ = new Subject().flatMap((cmd) =>
  MusitNode.getNode(simpleGet)(cmd.id, cmd.museumId, cmd.token, cmd)
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

export const getPathString = (pathStr) => {
  const pathStrArr = pathStr.substr(1, pathStr.length - 2).split(',');
  // EX: ,1,2,3,19, will be transformed to ,1,2,3,
  return `,${pathStrArr.slice(0, -1).join(',').toString()},`;
};

const refreshItem = (oneOrMany, items = []) => {
  const itemsToRefresh = [].concat(oneOrMany);
  return items.map((n) => {
    const itemToRefresh = itemsToRefresh.find(item => {
      const isMatchingId = n.value.id === item.id;
      const isMatchingObjectId = n.value.id === item.objectId;
      return isMatchingId || isMatchingObjectId;
    });
    if (itemToRefresh) {
      const node = {
        path: itemToRefresh.objectId ? itemToRefresh.path : getPathString(itemToRefresh.path),
        pathNames: itemToRefresh.pathNames || [
          {
            name: itemToRefresh.name,
            nodeId: itemToRefresh.id // intended
          }
        ]
      };
      return { ...n, path: getPath(node) };
    }
    return n;
  });
};

export const reducer$ = (actions) => Observable.empty().merge(
  actions.toggleObject$.map((item) => (state) => ({...state, objects: toggleItem(item, state.objects)})),
  actions.toggleMainObject$.map((item) => (state) => ({...state, objects: toggleMainObject(item, state.objects)})),
  actions.removeObject$.map((item) => (state) => ({...state, objects: removeItem(item, state.objects)})),
  actions.addObject$.map((item) => (state) => ({...state, objects: addItem(item, state.objects)})),
  actions.refreshObject$.map((item) => (state) => ({...state, objects: refreshItem(item, state.objects)})),
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
  refreshObject$,
  clearObjects$
}), Observable.of({ nodes: [], objects: []}))
  .map(state => ({
    nodes: orderBy(state.nodes, [(o) => customSortingStorageNodeType(o.value.type), (o) => toLower(o.value.name)]),
    objects: orderBy(state.objects, [(o) => toLower(o.value.museumNo), (o) => toLower(o.value.subNo), (o) => toLower(o.value.term)])
  }));
