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

const nodesSelector = createSelector(
  [state => getGridData(state.nodeReducer)],
  (storageGridUnit) => orderBy(storageGridUnit, [
    (o) => customSortingStorageNodeType(o.type),
    (o) => toLower(o.name)
  ])
);

const totalNodesSelector = (state) => state.nodeReducer.data && state.nodeReducer.data.totalMatches;

const objectsSelector = createSelector(
  [state => getGridData(state.objectReducer)],
  (storageObjectGrid) => orderBy(storageObjectGrid, [
    (o) => toLower(o.museumNo),
    (o) => toLower(o.subNo),
    (o) => toLower(o.term)
  ])
);

const totalObjectsSelector = (state) => state.objectReducer.data && state.objectReducer.data.totalMatches;

const statsSelector = (state) => state.statsReducer;

export const rootNodeSelector = (state) => state.nodeReducer.root.data;

export default createStructuredSelector({
  stats: statsSelector,
  nodes: nodesSelector,
  totalNodes: totalNodesSelector,
  objects: objectsSelector,
  totalObjects: totalObjectsSelector,
  rootNode: rootNodeSelector
});