import { createStructuredSelector } from 'reselect';
import { customSortingStorageNodeType } from '../../util';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';

const getGridData = (state) => {
  if (!state.data) {
    return [];
  }
  return state.data.length ? state.data : state.data.matches || [];
};

export const nodesSelector = createSelector(
  [state => getGridData(state.nodeReducer)],
  (storageGridUnit) => orderBy(storageGridUnit, [
    (o) => customSortingStorageNodeType(o.type),
    (o) => toLower(o.name)
  ])
);

export const objectsSelector = createSelector(
  [state => getGridData(state.objectReducer)],
  (storageObjectGrid) => orderBy(storageObjectGrid, [
    (o) => toLower(o.museumNo),
    (o) => toLower(o.subNo),
    (o) => toLower(o.term)
  ])
);

export const rootNodeSelector = (state) => state.nodeReducer.root.data;

export default createStructuredSelector({
  stats: (state) => state.statsReducer,
  nodes: nodesSelector,
  totalNodes: (state) => state.nodeReducer.data && state.nodeReducer.data.totalMatches,
  loadingNodes: (state) => state.nodeReducer.loading,
  objects: objectsSelector,
  totalObjects: (state) => state.objectReducer.data && state.objectReducer.data.totalMatches,
  loadingObjects: (state) => state.objectReducer.loading,
  rootNode: rootNodeSelector
});