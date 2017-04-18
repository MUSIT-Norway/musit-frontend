import { Observable } from 'rxjs';
import inject from 'react-rxjs/dist/RxInject';
import { toggleNode$, toggleObject$ } from '../app/pickList';
import { showConfirm, showModal } from '../../shared/modal';
import { makeUrlAware } from '../app/appSession';
import {
  loadChildren$,
  loadNode$,
  updateMoveDialog
} from '../movedialog/moveDialogStore';
import { isItemAdded } from '../app/pickList';
import connectToScanner from '../app/scanner';
import flowRight from 'lodash/flowRight';
import { emitError, emitSuccess } from '../../shared/errors';
import TableComponent from './TableComponent';
import React from 'react';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import Config from '../../config';
import tableStore$, {
  loadNodes$,
  loadStats$,
  loadRootNode$,
  loadObjects$,
  setLoading$,
  clearRootNode$
} from './tableStore';

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  tableStore$,
  pickList$: { type: React.PropTypes.object.isRequired }
};

const commands = {
  clearRootNode$,
  loadStats$,
  loadRootNode$,
  loadNodes$,
  loadObjects$,
  setLoading$,
  loadNode$,
  loadChildren$
};

const customProps = {
  pickNode: MusitNode.pickNode(toggleNode$),
  pickObject: MusitObject.pickObject(toggleObject$),
  deleteNode: MusitNode.deleteNode(),
  goTo: hashHistory.push,
  updateMoveDialog,
  isItemAdded,
  showConfirm,
  showModal,
  emitError,
  emitSuccess
};

export const processBarcode = (barCode, props) => {
  if (props.classExistsOnDom('moveHistory')) {
    return;
  }
  const isMoveDialogActive = props.classExistsOnDom('moveDialog');
  const museumId = props.appSession.museumId;
  const collectionId = props.appSession.collectionId;
  const token = props.appSession.accessToken;
  if (barCode.uuid) {
    props
      .findNodeByUUID({ uuid: barCode.code, museumId, token })
      .do(response => {
        if (!response || !response.nodeId) {
          props.emitError({
            message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode')
          });
        } else if (isMoveDialogActive) {
          props.updateMoveDialog(response.id, museumId, token);
        } else {
          props.goTo(
            Config.magasin.urls.client.storagefacility.goToNode(
              response.id,
              props.appSession
            )
          );
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
            props.updateMoveDialog(response.id, museumId, token);
          }
        })
        .toPromise();
    } else {
      props
        .findNodeOrObjectByBarcode(ajaxProps)
        .do(response => {
          if (response && Array.isArray(response)) {
            if (response.length === 1) {
              if (!response[0].currentLocationId) {
                props.emitError({
                  message: I18n.t('musit.errorMainMessages.scanner.noCurrentLocation')
                });
              } else {
                props.goTo(
                  Config.magasin.urls.client.storagefacility.goToObjects(
                    response[0].currentLocationId,
                    props.appSession
                  )
                );
              }
            } else {
              props.emitError({
                message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject')
              });
            }
          } else if (response && response.nodeId) {
            props.goTo(
              Config.magasin.urls.client.storagefacility.goToNode(
                response.id,
                props.appSession
              )
            );
          } else {
            props.emitError({
              message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject')
            });
          }
        })
        .toPromise();
    }
  }
};

export default flowRight([
  inject(data, commands, customProps),
  connectToScanner(processBarcode),
  makeUrlAware
])(TableComponent);
