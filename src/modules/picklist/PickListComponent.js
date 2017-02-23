import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import React, { PropTypes } from 'react';
import PickListTable from './PickListTable';
import { PageHeader, Grid } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import MusitModal from '../movedialog/MoveDialogComponent';
import './PickListComponent.css';
import { emitError, emitSuccess } from '../../shared/errors';
import { getPath } from '../../shared/util';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import PrintTemplate from '../print/PrintTemplateComponent';
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
import subscribe, { clear$ } from '../app/scanner';
import { Observable } from 'rxjs';

export class PickListContainer extends React.Component {
  static propTypes = {
    pickList: PropTypes.object.isRequired,
    toggleNode: PropTypes.func.isRequired,
    toggleObject: PropTypes.func.isRequired,
    toggleMainObject: PropTypes.func.isRequired,
    removeNode: PropTypes.func.isRequired,
    removeObject: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired,
    refreshNode: PropTypes.func.isRequired,
    refreshObjects: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.moveModal = this.moveModal.bind(this);
    this.print = this.print.bind(this);
    this.showMoveNodes = this.showMoveNodes.bind(this);
  }

  componentWillMount() {
    this.scanner = subscribe((barCode) => {
      this.props.clear();
      const museumId = this.props.appSession.getMuseumId();
      const collectionId = this.props.appSession.getCollectionId();
      const token = this.props.appSession.getAccessToken();
      if (barCode.uuid) {
        const props = {uuid: barCode.code, museumId, token};
        MusitNode.findByUUID()(props)
          .do((response) => {
            if (!response) {
              this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNode', {uuid: barCode.code})});
              return;
            }
            this.props.addNode({value: response, path: getPath(response)});
          })
          .toPromise();
      } else {
        const props = {barcode: barCode.code, museumId, collectionId, token};
        MusitNode.findByBarcode()(props)
          .flatMap((nodeResponse) => {
            if (!nodeResponse) {
              return MusitObject.findByBarcode()(props);
            }
            return Observable.of(nodeResponse);
          }).do(response => {
            if (!response) {
              this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject', {barcode: barCode.code})});
            } else if(Array.isArray(response)) {
              if (response.length === 1) {
                const isMoveDialogActive = document.getElementsByClassName('moveDialog').length > 0;
                if (!isMoveDialogActive) {
                  this.props.addObject({value: response[0], path: getPath(response[0])});
                } else {
                  this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.cannotActOnObject')});
                }
              } else {
                this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.noMatchingNodeOrObject', {barcode: barCode.code})});
              }
            } else if (response.nodeId) {
              const isMoveDialogActive = document.getElementsByClassName('moveDialog').length > 0;
              if (!isMoveDialogActive) {
                this.props.addNode({value: response, path: getPath(response)});
              } else {
                this.props.emitError({message: I18n.t('musit.errorMainMessages.scanner.cannotActOnNode')});
              }
            }
          }).toPromise();
      }
    });
  }

  componentWillUnmount() {
    this.scanner.unsubscribe();
  }

  isTypeNode() {
    return 'nodes' === this.props.route.type;
  }

  showMoveNodes = (items) => {
    let title;
    if (this.isTypeNode()) {
      title = I18n.t('musit.moveModal.moveNodes');
    } else {
      title = I18n.t('musit.moveModal.moveObjects');
    }
    this.props.showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveModal(items)}/>);
  }

  nodeCallback = (toName, toMoveLength, name, items, onSuccess) => ({
    onComplete: () => {
      items.map(item =>
        this.props.refreshNode({
          id: item.id,
          museumId: this.props.appSession.getMuseumId(),
          token: this.props.appSession.getAccessToken()
        })
      );
      onSuccess();
      if (toMoveLength === 1) {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodeMoved', { name, destination: toName })
        });
      } else {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodesMoved', { count: toMoveLength, destination: toName })
        });
      }
    },
    onFailure: (e) => {
      if (toMoveLength === 1) {
        this.props.emitError({type: 'errorOnMove', error: e, message: I18n.t('musit.moveModal.messages.errorNode', { name, destination: toName })});
      } else {
        this.props.emitError({type: 'errorOnMove', error: e,
          message: I18n.t('musit.moveModal.messages.errorNodes', { count: toMoveLength, destination: toName })});
      }
    }
  })

  objectCallback = (toName, toMoveLength, name, items, onSuccess) => ({
    onComplete: () => {
      this.props.refreshObjects({
        objectIds: items.map(item => item.id),
        museumId: this.props.appSession.getMuseumId(),
        token: this.props.appSession.getAccessToken()
      });
      onSuccess();
      if (toMoveLength === 1) {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', { name, destination: toName })
        });
      } else {
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectsMoved', { count: toMoveLength, destination: toName })
        });
      }
    },
    onFailure: (error) => {
      if (toMoveLength === 1) {
        this.props.emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObject', { name, destination: toName })
        });
      } else {
        this.props.emitError({
          type: 'errorOnMove',
          error,
          message: I18n.t('musit.moveModal.messages.errorObjects', { count: toMoveLength, destination: toName })
        });
      }
    }
  })

  moveModal = (items) => (to, toName, onSuccess) => {
    const isNode = this.isTypeNode();
    const moveFn = isNode ? MusitNode.moveNode : MusitObject.moveObject;
    const toMove = items.map(itemToMove => itemToMove.id);
    const toMoveLength = toMove.length;
    const first = items[0];
    const name = isNode ? first.name : first.term;
    let callback;
    if (isNode) {
      callback = this.nodeCallback(toName, toMoveLength, name, items, onSuccess);
    } else {
      callback = this.objectCallback(toName, toMoveLength, name, items, onSuccess);
    }

    let error = false;
    if (isNode) {
      const itemsWithError = items.filter(fromNode => checkNodeBranchAndType(fromNode, to));
      const errorMessages = itemsWithError.map(fromNode => `${checkNodeBranchAndType(fromNode, to)} (${fromNode.value.name})` );
      if (errorMessages.length > 0) {
        error = true;
        for (const errorMessage of errorMessages) {
          this.props.emitError({
            type: 'errorOnMove',
            message: errorMessage
          });
        }
      }
    }

    if (!error) {
      moveFn()({
        id: toMove,
        destination: to.id,
        doneBy: this.props.appSession.getActor().getActorId(),
        museumId: this.props.appSession.getMuseumId(),
        token: this.props.appSession.getAccessToken(),
        callback
      }).toPromise();
    }
  }

  print(nodesToPrint) {
    this.props.showModal(I18n.t('musit.template.labelTemplates'), <PrintTemplate appSession={this.props.appSession} marked={nodesToPrint} />);
  }

  toggleObject({item, on}) {
    if (item.mainObjectId && item.isMainObject()) {
      this.props.toggleMainObject({item, on});
    } else {
      this.props.toggleObject({item, on});
    }
  }

  render() {
    const type = this.props.route.type;
    const pickList = (this.props.pickList && this.props.pickList[type]) || [];
    const marked = pickList.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);

    return (
      <div>
        <main>
          <Grid>
            <PageHeader>
              {I18n.t(`musit.pickList.title.${this.props.route.type}`)}
            </PageHeader>
            <PickListTable
              picks={pickList}
              marked={markedValues}
              isnode={this.isTypeNode()}
              iconRendrer={(pick) => (pick.value.name ? <FontAwesome name="folder"/> :
                <span className='icon icon-musitobject'/>)
              }
              labelRendrer={(pick) => {
                return (
                  <div>
                    {!this.isTypeNode() ? <span style={{ paddingLeft: '1em' }}>{pick.value.museumNo}</span> : null}
                    {!this.isTypeNode() ? <span style={{ paddingLeft: '1em' }}>{pick.value.subNo}</span> : null}
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.term}</span>
                    <div className="labelText">
                      <Breadcrumb
                        node={pick.path}
                        onClickCrumb={node => hashHistory.push(`/magasin/${!node.id || node.id === -1 ? '' : node.id}`)}
                        allActive
                      />
                    </div>
                  </div>
                );
              }}
              toggle={(item, on) => this.isTypeNode() ? this.props.toggleNode({item, on}) : this.toggleObject({item, on})}
              remove={item => this.isTypeNode() ?  this.props.removeNode(item) :  this.props.removeObject(item)}
              move={this.showMoveNodes}
              print={this.print}
            />
            <div style={{ textAlign: 'left' }}>
              {marked.length}/{pickList.length} &nbsp;
              {this.isTypeNode() ? I18n.t('musit.pickList.footer.nodeSelected')
                : I18n.t('musit.pickList.footer.objectSelected') }
            </div>
          </Grid>
        </main>
      </div>
    );
  }
}

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
  clear$
};

const props = {
  emitError,
  emitSuccess,
  showModal
};

export default inject(data, commands, props)(PickListContainer);
