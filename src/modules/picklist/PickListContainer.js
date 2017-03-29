import { emitError, emitSuccess } from '../../shared/errors';
import { getPath } from '../../shared/util';
import { loadChildren$, loadNode$, updateMoveDialog } from '../movedialog/moveDialogStore';
import {
  toggleNode$,
  toggleMainObject$,
  toggleObject$,
  removeNode$,
  removeObject$,
  refreshNode$,
  refreshObjects$,
  addNode$,
  addObject$
} from '../app/pickList';
import inject from 'react-rxjs/dist/RxInject';
import { showModal } from '../../shared/modal';
import connectToScanner from '../app/scanner';
import { makeUrlAware } from '../app/appSession';
import flowRight from 'lodash/flowRight';
import { PickListComponent } from './PickListComponent';
import { I18n } from 'react-i18nify';
import { PropTypes } from 'react';
import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';

export const nodeCallback = (
  appSession,
  toName,
  toMoveLength,
  name,
  items,
  onSuccess,
  refreshNode = refreshNode$.next.bind(refreshNode$)
) => {
  return {
    onComplete: () => {
      items.map(item =>
        refreshNode({
          id: item.id,
          museumId: appSession.getMuseumId(),
          token: appSession.getAccessToken()
        })
      );
      onSuccess();
      if (toMoveLength === 1) {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodeMoved', { name, destination: toName })
        });
      } else {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodesMoved', { count: toMoveLength, destination: toName })
        });
      }
    },
    onFailure: (error) => {
      if (toMoveLength === 1) {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorNode', { name, destination: toName })
        });
      } else {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorNodes', { count: toMoveLength, destination: toName })
        });
      }
    }
  };
};

export const objectCallback = (
  appSession,
  toName,
  toMoveLength,
  name,
  items,
  onSuccess,
  refreshObjects = refreshObjects$.next.bind(refreshObjects$)
) => {
  return {
    onComplete: () => {
      refreshObjects({
        objectIds: items.map(item => item.id),
        museumId: appSession.getMuseumId(),
        token: appSession.getAccessToken()
      });
      onSuccess();
      if (toMoveLength === 1) {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', {name, destination: toName})
        });
      } else {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectsMoved', {count: toMoveLength, destination: toName})
        });
      }
    },
    onFailure: (error) => {
      if (toMoveLength === 1) {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObject', {name, destination: toName})
        });
      } else {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObjects', {count: toMoveLength, destination: toName})
        });
      }
    }
  };
};

export const moveItems = (
  appSession,
  items,
  isNode,
  moveNode = MusitNode.moveNode(),
  moveObject = MusitObject.moveObject()
) => {
  return (to, toName, onSuccess): void => {
    const moveFunction = isNode ? moveNode : moveObject;
    const idsToMove = items.map(itemToMove => itemToMove.id);

    const toMoveLength = idsToMove.length;
    const first = items[0];
    const name = isNode ? first.name : first.term;
    let callback;
    if (isNode) {
      callback = nodeCallback(appSession, toName, toMoveLength, name, items, onSuccess);
    } else {
      callback = objectCallback(appSession, toName, toMoveLength, name, items, onSuccess);
    }

    let error = false;
    if (isNode) {
      const itemsWithError = items.filter(fromNode => checkNodeBranchAndType(fromNode, to));
      const errorMessages = itemsWithError.map(fromNode => `${checkNodeBranchAndType(fromNode, to)} (${fromNode.name})` );
      if (errorMessages.length > 0) {
        error = true;
        for (const errorMessage of errorMessages) {
          emitError({
            type: 'errorOnMove',
            message: errorMessage
          });
        }
      }
    }

    if (!error) {
      moveFunction({
        id: idsToMove,
        destination: to.id,
        doneBy: appSession.getActor().getActorId(),
        museumId: appSession.getMuseumId(),
        token: appSession.getAccessToken(),
        callback
      }).toPromise();
    }
  };
};

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  pickList$: { type: PropTypes.object.isRequired }
};

const commands = {
  refreshNode$,
  refreshObjects$,
  toggleObject$,
  toggleNode$,
  toggleMainObject$,
  removeObject$,
  removeNode$,
  addNode$,
  addObject$,
  loadChildren$,
  loadNode$
};

const customProps = {
  updateMoveDialog,
  emitError,
  emitSuccess,
  showModal,
  moveNode: MusitNode.moveNode(),
  moveObject: MusitObject.moveObject(),
  isTypeNode: (props) => 'nodes' === props.route.type,
  moveItems
};

export const processBarcode = (barCode, props) => {
  const isMoveDialogActive = props.classExistsOnDom('moveDialog');
  const museumId = props.appSession.getMuseumId();
  const collectionId = props.appSession.getCollectionId();
  const token = props.appSession.getAccessToken();
  const isNodeView = props.isTypeNode(props);
  if (barCode.uuid) {
    if (isNodeView) {
      props.findNodeByUUID({uuid: barCode.code, museumId, token})
        .do((response) => {
          if (!response) {
            props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode')});
          } else if (isMoveDialogActive) {
            props.updateMoveDialog(response.id, museumId, token);
          } else {
            props.addNode({value: response, path: getPath(response)});
          }
        }).toPromise();
    } else {
      props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingObject')});
    }
  } else if (barCode.number) {
    const findByBarcode = isNodeView ? props.findNodeByBarcode : props.findObjectByBarcode;
    findByBarcode({barcode: barCode.code, museumId, collectionId, token}).do(response => {
      if (!response) {
        props.emitError({message: I18n.t('musit.errorMainMessages.scanner.' + (isNodeView ? 'noMatchingNode' : 'noMatchingObject'))});
      } else {
        if (isMoveDialogActive) {
          if (!response.nodeId) {
            props.emitError({ message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode') });
          } else {
            props.updateMoveDialog(response.id, museumId, token);
          }
        } else if (!isNodeView && Array.isArray(response)) { // objects
          if (response.length === 1) {
            props.addObject({value: response[0], path: getPath(response[0])});
          } else {
            props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingObject')});
          }
        } else if (isNodeView && response.nodeId) { // node
          props.addNode({value: response, path: getPath(response)});
        } else {
          props.emitError({message: I18n.t('musit.errorMainMessages.scanner.' + (isNodeView ? 'noMatchingNode' : 'noMatchingObject'))});
        }
      }
    }).toPromise();
  }
};

export default flowRight([
  inject(data, commands, customProps),
  connectToScanner(processBarcode),
  makeUrlAware
])(PickListComponent);