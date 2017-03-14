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
  isTypeNode: (props) => 'nodes' === props.route.type
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
            props.updateMoveDialog(response, museumId, token);
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
      } else if (!isNodeView && Array.isArray(response)) { // objects
        if (response.length === 1) {
          if (isMoveDialogActive) {
            props.updateMoveDialog(response[0], museumId, token);
          } else {
            props.addObject({value: response[0], path: getPath(response[0])});
          }
        } else {
          props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingObject')});
        }
      } else if (isNodeView && response.nodeId) { // node
        if (isMoveDialogActive) {
          props.updateMoveDialog(response, museumId, token);
        } else {
          props.addNode({value: response, path: getPath(response)});
        }
      } else {
        props.emitError({message: I18n.t('musit.errorMainMessages.scanner.' + (isNodeView ? 'noMatchingNode' : 'noMatchingObject'))});
      }
    }).toPromise();
  }
};

export default flowRight([
  inject(data, commands, customProps),
  connectToScanner(processBarcode),
  makeUrlAware
])(PickListComponent);