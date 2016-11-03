import { connect } from 'react-redux';
import { loadRoot, clearRoot, loadChildren, deleteUnit } from '../../../reducers/storageunit/grid';
import { loadObjects } from '../../../reducers/storageobject/grid';
import { addNode, addObject } from '../../../reducers/picklist';
import { moveObject, moveNode } from '../../../reducers/move';
import { loadStats, clearStats } from '../../../reducers/storageunit/stats';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../../errors/emitter';
import StorageUnitsContainer from '../../../components/magasin/grid';
import { createSelector } from 'reselect';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';

const getStorageGridUnit = (state) => state.storageGridUnit.data || [];

const getSortedStorageGridUnit = createSelector(
    [ getStorageGridUnit ],
    (storageGridUnit) => orderBy(storageGridUnit, ['type', (o) => toLower(o.name)])
);

const getStorageObjectGrid = (state) => state.storageObjectGrid.data || [];

const getSortedStorageObjectGrid = createSelector(
    [ getStorageObjectGrid ],
    (storageObjectGrid) => orderBy(storageObjectGrid, [(o) => toLower(o.museumNo), (o) => toLower(o.subNo), (o) => toLower(o.term)])
);

const mapStateToProps = (state) => ({
  user: state.auth.actor,
  stats: state.storageUnitStats.stats,
  children: getSortedStorageGridUnit(state),
  objects: getSortedStorageObjectGrid(state),
  rootNode: state.storageGridUnit.root.data,
  routerState: state.routing
});

const mapDispatchToProps = (dispatch, props) => {
  const { history } = props;

  return {
    loadRoot: (id) => {
      dispatch(loadRoot(id));
      dispatch(clearStats());
      dispatch(loadStats(id));
    },
    loadStorageUnits: () => {
      dispatch(clearRoot());
      dispatch(loadRoot());
      dispatch(clearStats());
    },
    loadStorageObjects: (id) => {
      dispatch(loadObjects(id));
    },
    loadChildren: (id, callback) => {
      dispatch(loadChildren(id, callback));
      dispatch(loadRoot(id));
      dispatch(clearStats());
      dispatch(loadStats(id));
    },
    moveObject: (objectId, destinationId, doneBy, callback) => {
      dispatch(moveObject(objectId, destinationId, doneBy, callback));
    },
    moveNode: (nodeId, destinationId, doneBy, callback) => {
      dispatch(moveNode(nodeId, destinationId, doneBy, callback));
    },
    onAction: (actionName, unit, path) => {
      switch (actionName) {
      case 'pickNode':
        dispatch(addNode(unit, path));
        break;
      case 'pickObject':
        dispatch(addObject(unit, path));
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
    onDelete: (id, currentNode) => {
      if (id === currentNode.id) {
        dispatch(deleteUnit(id, {
          onSuccess: () => {
            dispatch(clearRoot());
            if (currentNode.isPartOf) {
              hashHistory.replace(`/magasin/${currentNode.isPartOf}`);
            } else {
              dispatch(loadRoot());
              dispatch(clearStats());
            }
            emitSuccess({
              type: 'deleteSuccess',
              message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name: currentNode.name})
            });
          },
          onFailure: (e) => {
            if (e.status === 400) {
              emitError({ type: 'errorOnDelete', message: I18n.t('musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild')} );
            } else {
              emitError({ type: 'errorOnDelete', message: I18n.t('musit.leftMenu.node.deleteMessages.errorCommon')} );
            }
          }
        }));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitsContainer);
