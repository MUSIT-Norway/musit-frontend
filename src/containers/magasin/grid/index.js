import {connect} from 'react-redux';
import {loadRoot as loadRootNodes, clearRoot, loadChildren as loadChildNodes, deleteUnit} from '../../../reducers/storageunit/grid';
import {loadObjects} from '../../../reducers/storageobject/grid';
import {addNode, addObject, loadMainObject} from '../../../reducers/picklist';
import {moveObject, moveNode} from '../../../reducers/move';
import {loadStats, clearStats} from '../../../reducers/storageunit/stats';
import {hashHistory} from 'react-router';
import {I18n} from 'react-i18nify';
import {emitError, emitSuccess} from '../../../errors/emitter';
import StorageUnitsContainer from '../../../components/magasin/grid';
import {createSelector} from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';
import {customSortingStorageNodeType} from '../../../util/';
import MusitNode from '../../../models/node';
import { clear } from '../../../reducers/storageunit/modal';

const getGridData = (field) => (state) => {
  if (!state[field].data) {
    return [];
  }
  return state[field].data.length ? state[field].data : state[field].data.matches || [];
};

const getSortedStorageGridUnit = createSelector(
  [getGridData('storageGridUnit')],
  (storageGridUnit) => orderBy(storageGridUnit, [(o) => customSortingStorageNodeType(o.type),
    (o) => toLower(o.name)
  ])
  );

const getSortedStorageObjectGrid = createSelector(
  [getGridData('storageObjectGrid')],
  (storageObjectGrid) => orderBy(storageObjectGrid, [(o) => toLower(o.museumNo), (o) => toLower(o.subNo), (o) => toLower(o.term)])
);

const mapStateToProps = (state) => ({
  user: state.auth.user,
  stats: state.storageUnitStats.stats,
  children: getSortedStorageGridUnit(state),
  totalNodes: state.storageGridUnit.data && state.storageGridUnit.data.totalMatches,
  loadingNodes: state.storageGridUnit.loading,
  objects: getSortedStorageObjectGrid(state),
  totalObjects: state.storageObjectGrid.data && state.storageObjectGrid.data.totalMatches,
  loadingObjects: state.storageObjectGrid.loading,
  rootNode: state.storageGridUnit.root.data,
  routerState: state.routing
});

const mapDispatchToProps = (dispatch, props) => {
  const {history} = props;

  return {
    loadRoot: (id, museumId, currentPage) => {
      dispatch(clearStats());
      dispatch(loadRootNodes(id, museumId, currentPage, {
        onSuccess: (result) => {
          if (!MusitNode.isRootNode(result.type)) {
            dispatch(loadStats(id, museumId));
          }
        }
      }));
    },
    loadStorageUnits: (museumId, currentPage) => {
      dispatch(clearRoot());
      dispatch(loadRootNodes(null, museumId, currentPage));
      dispatch(clearStats());
    },
    loadStorageObjects: (id, museumId, collectionId, currentPage) => {
      dispatch(loadObjects(id, museumId, collectionId, currentPage));
    },
    loadChildren: (id, museumId, currentPage) => {
      dispatch(loadChildNodes(id, museumId, currentPage));
      dispatch(clearRoot());
      dispatch(clearStats());
      dispatch(loadRootNodes(id, museumId, null, {
        onSuccess: (result) => {
          if (!MusitNode.isRootNode(result.type)) {
            dispatch(loadStats(id, museumId));
          }
        }
      }));
    },
    moveObject: (
      objectToMove,
      destinationId,
      doneBy,
      museumId,
      collectionId,
      callback
    ) => {
      if (objectToMove.isMainObject()) {
        dispatch(loadMainObject(objectToMove, museumId, collectionId, {
          onSuccess: (children) => {
            const objectIds = children.map(c => c.id);
            dispatch(moveObject(objectIds, destinationId, doneBy, museumId, callback));
          }
        }));
      } else {
        dispatch(moveObject(objectToMove.id, destinationId, doneBy, museumId, callback));
      }
    },
    moveNode: (nodeId, destinationId, doneBy, museumId, callback) => {
      dispatch(moveNode(nodeId, destinationId, doneBy, museumId, callback));
    },
    onAction: (actionName, unit, path, museumId, collectionId) => {
      switch (actionName) {
      case 'pickNode':
        dispatch(addNode(unit, path));
        break;
      case 'pickObject':
        if (unit.isMainObject()) {
          dispatch(loadMainObject(unit, museumId, collectionId, {
            onSuccess: (children) => {
              children.forEach(child => dispatch(addObject(child, path)));
            }
          }));
        } else {
          dispatch(addObject(unit, path));
        }
        break;
      case 'controlsobservations':
        history.push(`/magasin/${unit.id}/controlsobservations`);
        break;
      default:
        break;
      }
    },
    onDelete: (id, museumId, currentNode) => {
      if (id === currentNode.id) {
        dispatch(deleteUnit(id, museumId, {
          onSuccess: () => {
            dispatch(clearRoot());
            if (currentNode.isPartOf) {
              hashHistory.replace(`/magasin/${currentNode.isPartOf}`);
            } else {
              dispatch(loadRootNodes(null, museumId));
              dispatch(clearStats());
            }
            emitSuccess({
              type: 'deleteSuccess',
              message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name: currentNode.name})
            });
          },
          onFailure: (error) => {
            if (error.response.status === 400) {
              emitError({
                type: 'errorOnDelete',
                message: I18n.t('musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild')
              });
            } else {
              emitError(error);
            }
          }
        }));
      }
    },
    clearMoveDialog: () => dispatch(clear())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitsContainer);
