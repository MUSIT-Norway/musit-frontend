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
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { showModal } from '../../shared/modal';
import connectToScanner from '../../stores/scanner';
import { flowRight } from 'lodash';
import { PickListComponent } from './PickListComponent';
import { I18n } from 'react-i18nify';
import * as PropTypes from 'prop-types';
import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import MusitActor from '../../models/actor';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import { MovableObject } from '../../models/types/movableObject';
import Config from '../../config';
import { TODO } from '../../types/common';
import { AppSession } from '../../types/appSession';

export const nodeCallback = (
  appSession: AppSession,
  toName: TODO,
  toMoveLength: TODO,
  name: TODO,
  items: TODO,
  onSuccess: Function,
  onFailure: Function,
  refreshNode = (refreshNode$ as TODO).next.bind(refreshNode$)
) => {
  return {
    onComplete: () => {
      items.map((item: TODO) =>
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
    onFailure: (error: TODO) => {
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
  appSession: AppSession,
  toName: TODO,
  toMoveLength: TODO,
  name: TODO,
  items: Array<MovableObject>,
  onSuccess: Function,
  onFailure: Function,
  refreshObjects = (refreshObjects$ as TODO).next.bind(refreshObjects$)
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
    onFailure: (error: TODO) => {
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
  appSession: AppSession,
  items: TODO,
  isNode: boolean,
  moveNode = MusitNode.moveNode(),
  moveObject = MusitObject.moveSingleObject()
) => {
  return (to: TODO, toName: TODO, onSuccess: Function, onFailure = () => true): void => {
    const idsToMove = items.map(
      (itemToMove: TODO) => (isNode ? itemToMove.nodeId : itemToMove.uuid)
    );

    const objectTypeAndId =
      !isNode && items
        ? items.map((itemToMove: TODO) => ({
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
      const movableObject: Array<MovableObject> = items.map((item: TODO) => ({
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
      const itemsWithError = items.filter((fromNode: TODO) =>
        checkNodeBranchAndType(fromNode, to)
      );
      const errorMessages = itemsWithError.map(
        (fromNode: TODO) => `${checkNodeBranchAndType(fromNode, to)} (${fromNode.name})`
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
      if (isNode) {
        moveNode({
          id: idsToMove,
          destination: to.nodeId,
          doneBy: MusitActor.getActorId(appSession.actor) as TODO,
          museumId: appSession.museumId,
          token: appSession.accessToken,
          callback
        }).toPromise();
      } else {
        moveObject({
          objectTypeAndId: objectTypeAndId,
          destination: to.nodeId,
          doneBy: MusitActor.getActorId(appSession.actor) as TODO,
          museumId: appSession.museumId,
          token: appSession.accessToken,
          callback
        }).toPromise();
      }
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

const customProps = (props: TODO) => ({
  ...props,
  updateMoveDialog,
  emitError,
  emitSuccess,
  showModal,
  moveNode: MusitNode.moveNode(),
  moveObject: MusitObject.moveSingleObject(),
  isTypeNode: 'nodes' === props.type,
  moveItems,
  createSample: (items: TODO) => {
    if (items[0].objectType === 'sample') {
      props.history.push({
        pathname: Config.magasin.urls.client.analysis.addFromSample(
          props.appSession,
          items[0].sampleObject ? items[0].sampleObject.objectId : items[0].objectId
        )
      });
    } else if (items[0].objectType === 'collection') {
      props.history.push({
        pathname: Config.magasin.urls.client.analysis.addSample(
          props.appSession,
          items[0].uuid
        )
      });
    }
  },
  createMultipleSamples: () => {
    props.history.push({
      pathname: Config.magasin.urls.client.analysis.addMultipleSamples(props.appSession)
    });
  },
  createAnalysis: (items: TODO, appSession: AppSession) => {
    props.history.push({
      pathname: Config.magasin.urls.client.analysis.addAnalysis(appSession),
      state: items
    });
  },
  createConservation: (items: TODO[], appSession: AppSession) => {
    props.history.push({
      pathname: Config.magasin.urls.client.conservation.addConservation(appSession),
      state: items
    });
  }
});

export const processBarcode = (barCode: TODO, props: TODO) => {
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
      .do((response: TODO) => {
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
        .do((response: TODO) => {
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
        .do((response: TODO) => {
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
