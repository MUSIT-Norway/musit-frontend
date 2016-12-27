import { connect } from 'react-redux';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';
import * as actions from './magasinActions';
import { selector } from './magasinReducers';
import { emitError, emitSuccess } from '../util/errors/emitter';
import { MusitNode } from '../models';
import { moveObject, moveNode } from '../reducers/move';
import { addNode, addObject, loadMainObject } from '../picklist/picklistReducers';
import StorageUnitsContainer from './MagasinComponent';

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    ...selector(state.magasinReducers)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const {history} = props;

  return {
    loadRoot: (id, museumId, currentPage) => {
      dispatch(actions.clearStats());
      dispatch(actions.loadRoot(id, museumId, currentPage, {
        onSuccess: (result) => {
          if (!MusitNode.isRootNode(result.type)) {
            dispatch(actions.loadStats(id, museumId));
          }
        }
      }));
    },
    loadStorageUnits: (museumId, currentPage) => {
      dispatch(actions.clearRoot());
      dispatch(actions.loadRoot(null, museumId, currentPage));
      dispatch(actions.clearStats());
    },
    loadStorageObjects: (id, museumId, collectionId, currentPage) => {
      dispatch(actions.loadObjects(id, museumId, collectionId, currentPage));
    },
    loadChildren: (id, museumId, currentPage) => {
      dispatch(actions.loadChildren(id, museumId, currentPage));
      dispatch(actions.clearRoot());
      dispatch(actions.clearStats());
      dispatch(actions.loadRoot(id, museumId, null, {
        onSuccess: (result) => {
          if (!MusitNode.isRootNode(result.type)) {
            dispatch(actions.loadStats(id, museumId));
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
        dispatch(actions.deleteUnit(id, museumId, {
          onSuccess: () => {
            dispatch(actions.clearRoot());
            if (currentNode.isPartOf) {
              hashHistory.replace(`/magasin/${currentNode.isPartOf}`);
            } else {
              dispatch(actions.loadRoot(null, museumId));
              dispatch(actions.clearStats());
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitsContainer);
