import { emitError, emitSuccess } from '../../shared/errors';
import { getPath } from '../../shared/util';
import {
  loadChildren$,
  loadNode$,
  updateMoveDialog
} from '../movedialog/moveDialogStore';
import {
  markNode$,
  markMainObject$,
  markObject$,
  removeNode$,
  removeObject$,
  refreshNode$,
  refreshObjects$,
  addNode$,
  addObject$
} from '../../stores/pickList';
import inject from 'react-rxjs/dist/RxInject';
import { showModal } from '../../shared/modal';
import connectToScanner from '../../stores/scanner';
import flowRight from 'lodash/flowRight';
import { PickListComponent } from './PickListComponent';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import MusitActor from '../../models/actor';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import type { MovableObject } from '../../models/types/movableObject';
import Config from '../../config';

export const nodeCallback = (
  appSession,
  toName,
  toMoveLength,
  name,
  items,
  onSuccess,
  onFailure,
  refreshNode = refreshNode$.next.bind(refreshNode$)
) => {
  return {
    onComplete: () => {
      items.map(item =>
        refreshNode({
          id: item.nodeId,
          museumId: appSession.museumId,
          token: appSession.accessToken
        })
      );
      onSuccess();
      if (toMoveLength === 1) {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodeMoved', {
            name,
            destination: toName
          })
        });
      } else {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodesMoved', {
            count: toMoveLength,
            destination: toName
          })
        });
      }
    },
    onFailure: error => {
      onFailure();
      if (toMoveLength === 1) {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorNode', {
            name,
            destination: toName
          })
        });
      } else {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorNodes', {
            count: toMoveLength,
            destination: toName
          })
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
  items: Array<MovableObject>,
  onSuccess,
  onFailure,
  refreshObjects = refreshObjects$.next.bind(refreshObjects$)
) => {
  return {
    onComplete: () => {
      refreshObjects({
        movableObjects: items,
        museumId: appSession.museumId,
        token: appSession.accessToken
      });
      onSuccess();
      if (toMoveLength === 1) {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', {
            name,
            destination: toName
          })
        });
      } else {
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectsMoved', {
            count: toMoveLength,
            destination: toName
          })
        });
      }
    },
    onFailure: error => {
      onFailure();
      if (toMoveLength === 1) {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObject', {
            name,
            destination: toName
          })
        });
      } else {
        emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObjects', {
            count: toMoveLength,
            destination: toName
          })
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
  moveObject = MusitObject.moveSingleObject()
) => {
  return (to, toName, onSuccess, onFailure = () => true): void => {
    const moveFunction = isNode ? moveNode : moveObject;
    const idsToMove = items.map(
      itemToMove => (isNode ? itemToMove.nodeId : itemToMove.uuid)
    );

    const objectTypeAndId = !isNode && items
      ? items.map(itemToMove => ({
          id: itemToMove.uuid,
          objectType: itemToMove.objectType
        }))
      : null;

    const toMoveLength = idsToMove.length;
    const first = items[0];
    const name = isNode ? first.name : first.term;
    let callback;
    if (isNode) {
      callback = nodeCallback(
        appSession,
        toName,
        toMoveLength,
        name,
        items,
        onSuccess,
        onFailure
      );
    } else {
      const movableObject: Array<MovableObject> = items.map(item => ({
        id: item.uuid,
        objectType: item.objectType
      }));
      callback = objectCallback(
        appSession,
        toName,
        toMoveLength,
        name,
        movableObject,
        onSuccess,
        onFailure
      );
    }

    let error = false;
    if (isNode) {
      const itemsWithError = items.filter(fromNode =>
        checkNodeBranchAndType(fromNode, to)
      );
      const errorMessages = itemsWithError.map(
        fromNode => `${checkNodeBranchAndType(fromNode, to)} (${fromNode.name})`
      );
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
        objectTypeAndId: objectTypeAndId,
        destination: to.nodeId,
        doneBy: MusitActor.getActorId(appSession.actor),
        museumId: appSession.museumId,
        token: appSession.accessToken,
        callback
      }).toPromise();
    } else {
      onFailure();
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
  markObject$,
  markNode$,
  markMainObject$,
  removeObject$,
  removeNode$,
  addNode$,
  addObject$,
  loadChildren$,
  loadNode$
};

const customProps = props => ({
  ...props,
  updateMoveDialog,
  emitError,
  emitSuccess,
  showModal,
  moveNode: MusitNode.moveNode(),
  moveObject: MusitObject.moveSingleObject(),
  isTypeNode: 'nodes' === props.type,
  moveItems,
  createSample: (items, appSession) => {
    if (items[0].objectType === 'sample') {
      props.history.push({
        pathname: Config.magasin.urls.client.analysis.addFromSample(
          appSession,
          items[0].sampleObject ? items[0].sampleObject.objectId : items[0].objectId
        )
      });
    } else if (items[0].objectType === 'collection') {
      props.history.push({
        pathname: Config.magasin.urls.client.analysis.addSample(appSession, items[0].uuid)
      });
    }
  },
  createAnalysis: (items, appSession) => {
    props.history.push({
      pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
      state: items
    });
  }
});

export const processBarcode = (barCode, props) => {
  const isMoveDialogActive = props.classExistsOnDom('moveDialog');
  const museumId = props.appSession.museumId;
  const collectionId = props.appSession.collectionId;
  const token = props.appSession.accessToken;
  const isNodeView = props.isTypeNode;
  if (barCode.uuid) {
    if (!isNodeView && !isMoveDialogActive) {
      return props.emitError({
        message: I18n.t('musit.errorMainMessages.scanner.noMatchingObject')
      });
    }
    props
      .findNodeByUUID({ uuid: barCode.code, museumId, token })
      .do(response => {
        if (!response) {
          return props.emitError({
            message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode')
          });
        }
        if (isMoveDialogActive) {
          props.updateMoveDialog(response.nodeId, museumId, token);
        } else if (isNodeView) {
          props.addNode({ value: response, path: getPath(response) });
        }
      })
      .toPromise();
  } else if (barCode.number) {
    const ajaxProps = { barcode: barCode.code, museumId, collectionId, token };
    if (isMoveDialogActive) {
      props
        .findNodeByBarcode(ajaxProps)
        .do(response => {
          if (!response || !response.nodeId) {
            props.emitError({
              message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode')
            });
          } else {
            props.updateMoveDialog(response.nodeId, museumId, token);
          }
        })
        .toPromise();
    } else {
      const findByBarcode = isNodeView
        ? props.findNodeByBarcode
        : props.findObjectByBarcode;
      findByBarcode(ajaxProps)
        .do(response => {
          if (!response) {
            props.emitError({
              message: I18n.t(
                'musit.errorMainMessages.scanner.' +
                  (isNodeView ? 'noMatchingNode' : 'noMatchingObject')
              )
            });
          } else if (!isNodeView && Array.isArray(response)) {
            if (response.length === 1) {
              props.addObject({ value: response[0], path: getPath(response[0]) });
            } else {
              props.emitError({
                message: I18n.t('musit.errorMainMessages.scanner.noMatchingObject')
              });
            }
          } else if (isNodeView && !!response.nodeId) {
            props.addNode({ value: response, path: getPath(response) });
          } else {
            props.emitError({
              message: I18n.t(
                'musit.errorMainMessages.scanner.' +
                  (isNodeView ? 'noMatchingNode' : 'noMatchingObject')
              )
            });
          }
        })
        .toPromise();
    }
  }
};

export default flowRight([
  inject(data, commands, customProps),
  connectToScanner(processBarcode)
])(PickListComponent);
