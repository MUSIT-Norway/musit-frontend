import { createStructuredSelector } from 'reselect';
import { customSortingStorageNodeType } from '../../util';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';

/**
 * A private helper method for retrieving:
 *
 * 1. The data as array
 * or
 * 2. The matches array on the data object
 *
 * TODO NB! this method is copy pasted inside the events module
 *
 * @param state
 * @returns {Array}
 */
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

export const totalNodesSelector = (state) => state.nodeReducer.data && state.nodeReducer.data.totalMatches;

export const objectsSelector = createSelector(
  [state => getGridData(state.objectReducer)],
  (storageObjectGrid) => orderBy(storageObjectGrid, [
    (o) => toLower(o.museumNo),
    (o) => toLower(o.subNo),
    (o) => toLower(o.term)
  ])
);

export const totalObjectsSelector = (state) => state.objectReducer.data && state.objectReducer.data.totalMatches;

export const statsSelector = (state) => state.statsReducer;

export const rootNodeSelector = (state) => state.nodeReducer.root.data;

export default createStructuredSelector({
  stats: statsSelector,
  nodes: nodesSelector,
  totalNodes: totalNodesSelector,
  objects: objectsSelector,
  totalObjects: totalObjectsSelector,
  rootNode: rootNodeSelector
});