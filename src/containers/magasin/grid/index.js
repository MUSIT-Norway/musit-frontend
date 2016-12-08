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

const getStorageGridUnit = (state) => state.storageGridUnit.data || [];

const getSortedStorageGridUnit = createSelector(
  [getStorageGridUnit],
  (storageGridUnit) => orderBy(storageGridUnit, [(o) => customSortingStorageNodeType(o.type),
    (o) => toLower(o.name)
  ])
  );

const getStorageObjectGrid = (state) => state.storageObjectGrid.data || [];

const getSortedStorageObjectGrid = createSelector(
  [getStorageObjectGrid],
  (storageObjectGrid) => orderBy(storageObjectGrid, [(o) => toLower(o.museumNo), (o) => toLower(o.subNo), (o) => toLower(o.term)])
);

const mapStateToProps = (state) => ({
  user: state.auth.user,
  stats: state.storageUnitStats.stats,
  children: getSortedStorageGridUnit(state),
  objects: getSortedStorageObjectGrid(state),
  rootNode: state.storageGridUnit.root.data,
  routerState: state.routing
});

const mapDispatchToProps = (dispatch, props) => {
  const {history} = props;

  return {
    loadRoot: (id, museumId) => {
      dispatch(clearStats());
      dispatch(loadRootNodes(id, museumId, {
        onSuccess: (result) => {
          if (!MusitNode.isRootNode(result.type)) {
            dispatch(loadStats(id, museumId));
          }
        }
      }));
    },
    loadStorageUnits: (museumId) => {
      dispatch(clearRoot());
      dispatch(loadRootNodes(null, museumId));
      dispatch(clearStats());
    },
    loadStorageObjects: (id, museumId, collectionId) => {
      dispatch(loadObjects(id, museumId, collectionId));
    },
    loadChildren: (id, museumId) => {
      dispatch(loadChildNodes(id, museumId));
      dispatch(clearRoot());
      dispatch(clearStats());
      dispatch(loadRootNodes(id, museumId, {
        onSuccess: (result) => {
          if (!MusitNode.isRootNode(result.type)) {
            dispatch(loadStats(id, museumId));
          }
        }
      }));
    },
    moveObject: (objectId, destinationId, doneBy, museumId, callback) => {
      dispatch(moveObject(objectId, destinationId, doneBy, museumId, callback));
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
        if (unit.mainObjectId) {
          dispatch(loadMainObject(unit, path, museumId, collectionId, {
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
      case 'observation':
        history.push(`/magasin/${unit.id}/observations`);
        break;
      case 'control':
        history.push(`/magasin/${unit.id}/controls`);
        break;
      default:
        break;
      }
    },
    onEdit: (unit) => {
      hashHistory.push(`/magasin/${unit.id}/view`);
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
              emitError({type: 'errorOnDelete', message: I18n.t('musit.leftMenu.node.deleteMessages.errorCommon')});
            }
          }
        }));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitsContainer);
