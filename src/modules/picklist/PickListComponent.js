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
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import PrintTemplate from '../print/PrintTemplateComponent';
import {
  toggleNode$,
  toggleMainObject$,
  toggleObject$,
  removeNode$,
  removeObject$,
  refreshNode$,
  refreshObject$,
  refreshObjects$
} from '../app/pickList';
import inject from 'react-rxjs/dist/RxInject';

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
    refreshObject: PropTypes.func.isRequired,
    refreshObjects: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired
  }

  static contextTypes = {
    showModal: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.moveModal = this.moveModal.bind(this);
    this.print = this.print.bind(this);
  }

  isTypeNode() {
    return 'nodes' === this.props.route.type;
  }

  showModal = (items) => {
    let title;
    if (this.isTypeNode()) {
      title = I18n.t('musit.moveModal.moveNodes');
    } else {
      title = I18n.t('musit.moveModal.moveObjects');
    }
    this.context.showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveModal(items)}/>);
  }

  nodeCallback = (toName, toMoveLength, name, items, onSuccess) => ({
    onComplete: () => {
      items.map(p => p.value).map(item =>
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
        objectIds: items.map(item => item.value.id),
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
    const toMove = items.map(itemToMove => itemToMove.value.id);
    const toMoveLength = toMove.length;
    const first = items[0].value;
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
    this.context.showModal('Choose template', <PrintTemplate appSession={this.props.appSession} marked={nodesToPrint} />);
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
              move={() => this.showModal(marked)}
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
  refreshObject$,
  refreshObjects$,
  toggleObject$,
  toggleNode$,
  toggleMainObject$,
  removeObject$,
  removeNode$
};

const props = {
  emitError,
  emitSuccess
};

export default inject(data, commands, props)(PickListContainer);
