import { Observable } from 'rxjs';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { toggleNode$, toggleObject$ } from '../../stores/pickList';
import { showConfirm, showModal } from '../../shared/modal';
import {
  loadChildren$,
  loadNode$,
  updateMoveDialog
} from '../movedialog/moveDialogStore';
import { isItemAdded } from '../../stores/pickList';
import connectToScanner from '../../stores/scanner';
import { flowRight } from 'lodash';
import { emitError, emitSuccess } from '../../shared/errors';
import TableComponent from './TableComponent';
import * as PropTypes from 'prop-types';
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
import sampleStore$, { getSampleTypes$, getSamplesForNode$ } from '../sample/sampleStore';
import { TODO } from '../../types/common';

const data = {
  appSession$: { type: PropTypes.instanceOf(Observable).isRequired },
  tableStore$,
  pickList$: { type: PropTypes.object.isRequired },
  sampleStore$
};

const commands = {
  clearRootNode$,
  loadStats$,
  loadRootNode$,
  loadNodes$,
  loadObjects$,
  setLoading$,
  loadNode$,
  loadChildren$,
  getSamplesForNode$,
  getSampleTypes$
};

const customProps = (props: TODO) => ({
  ...props,
  pickNode: MusitNode.pickNode(toggleNode$),
  pickObject: MusitObject.pickObject(toggleObject$),
  deleteNode: MusitNode.deleteNode(),
  goTo: props.history.push,
  history: props.history,
  updateMoveDialog,
  isItemAdded,
  showConfirm,
  showModal,
  emitError,
  emitSuccess
});

export const processBarcode = (barCode: TODO, props: TODO) => {
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
      .do((response: TODO) => {
        if (!response || !response.nodeId) {
          props.emitError({
            message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode')
          });
        } else if (isMoveDialogActive) {
          props.updateMoveDialog(response.nodeId, museumId, token);
        } else {
          props.goTo(
            Config.magasin.urls.client.storagefacility.goToNode(
              response.nodeId,
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
      props
        .findNodeOrObjectByBarcode(ajaxProps)
        .do((response: TODO) => {
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
                response.nodeId,
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
  connectToScanner(processBarcode)
])(TableComponent);
