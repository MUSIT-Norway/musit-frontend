import React, { PropTypes } from 'react';
import { PageHeader, Grid, Button, Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import MusitModal from '../movedialog/MoveDialogComponent';
import './PickListComponent.css';
import Config from '../../config';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import PrintTemplate from '../print/PrintTemplateContainer';
import scannerIcon from '../app/scannerIcon.png';

export class PickListComponent extends React.Component {
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
    emitSuccess: PropTypes.func.isRequired,
    toggleScanner: PropTypes.func.isRequired,
    scannerEnabled: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.print = this.print.bind(this);
    this.moveModal = this.moveModal.bind(this);
    this.showMoveNodes = this.showMoveNodes.bind(this);
    this.nodeCallback = this.nodeCallback.bind(this);
  }

  showMoveNodes(items) {
    let title;
    if (this.props.isTypeNode(this.props)) {
      title = I18n.t('musit.moveModal.moveNodes');
    } else {
      title = I18n.t('musit.moveModal.moveObjects');
    }
    this.props.showModal(
      title,
      <MusitModal
        appSession={this.props.appSession}
        onMove={this.moveModal(items)}
      />
    );
  }

  nodeCallback(toName, toMoveLength, name, items, onSuccess) {
    return {
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
      onFailure: (error) => {
        if (toMoveLength === 1) {
          this.props.emitError({
            type: 'errorOnMove',
            error,
            message: I18n.t('musit.moveModal.messages.errorNode', { name, destination: toName })
          });
        } else {
          this.props.emitError({
            type: 'errorOnMove',
            error,
            message: I18n.t('musit.moveModal.messages.errorNodes', { count: toMoveLength, destination: toName })
          });
        }
      }
    };
  }

  objectCallback(toName, toMoveLength, name, items, onSuccess) {
    return {
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
            message: I18n.t('musit.moveModal.messages.objectMoved', {name, destination: toName})
          });
        } else {
          this.props.emitSuccess({
            type: 'movedSuccess',
            message: I18n.t('musit.moveModal.messages.objectsMoved', {count: toMoveLength, destination: toName})
          });
        }
      },
      onFailure: (error) => {
        if (toMoveLength === 1) {
          this.props.emitError({
            type: 'errorOnMove',
            error,
            message: I18n.t('musit.moveModal.messages.errorObject', {name, destination: toName})
          });
        } else {
          this.props.emitError({
            type: 'errorOnMove',
            error,
            message: I18n.t('musit.moveModal.messages.errorObjects', {count: toMoveLength, destination: toName})
          });
        }
      }
    };
  }

  moveModal(items) {
    return (to, toName, onSuccess) => {
      const isNode = this.props.isTypeNode(this.props);
      const moveFunction = isNode ? this.props.moveNode : this.props.moveObject;
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
        moveFunction({
          id: toMove,
          destination: to.id,
          doneBy: this.props.appSession.getActor().getActorId(),
          museumId: this.props.appSession.getMuseumId(),
          token: this.props.appSession.getAccessToken(),
          callback
        }).toPromise();
      }
    };
  }

  print(nodesToPrint) {
    this.props.showModal(
      I18n.t('musit.template.labelTemplates'),
      <PrintTemplate
        appSession={this.props.appSession}
        marked={nodesToPrint}
      />
    );
  }

  toggleObject({item, on}) {
    if (item.mainObjectId && item.isMainObject()) {
      this.props.toggleMainObject({item, on});
    } else {
      this.props.toggleObject({item, on});
    }
  }

  iconRenderer(pick) {
    if (pick.value.name) {
      return <FontAwesome name="folder"/>;
    }
    return <span className='icon icon-musitobject'/>;
  }

  labelRenderer(isNode, pick) {
    return (
      <div>
        {!isNode ? <span style={{ paddingLeft: '1em' }}>{pick.value.museumNo}</span> : null}
        {!isNode ? <span style={{ paddingLeft: '1em' }}>{pick.value.subNo}</span> : null}
        <span style={{ paddingLeft: '1em' }}>
            {pick.value.name ? pick.value.name : pick.value.term}
          </span>
        <div className="labelText">
          <Breadcrumb
            node={pick.path}
            onClickCrumb={node => {
              if(node.id) {
                hashHistory.push(Config.magasin.urls.client.storagefacility.goToNode(node.id, this.props.appSession));
              } else {
                hashHistory.push(Config.magasin.urls.client.storagefacility.goToRoot(this.props.appSession));
              }
            }}
            allActive
          />
        </div>
      </div>
    );
  }

  selectedCount(isNode, count) {
    return (
      <span
        className="normalActionNoPadding"
        style={{ fontSize: '0.8em' }}
        title={I18n.t(`musit.pickList.tooltip.${isNode ? 'selectedNodeCount' : 'selectedObjectCount'}`)}
      >
        {`(${count})`}
      </span>
    );
  }

  render() {
    const type = this.props.route.type;
    const pickList = (this.props.pickList && this.props.pickList[type]) || [];
    const marked = pickList.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);
    const isNode = this.props.isTypeNode(this.props);
    const remove = (item) => {
      if (isNode) {
        this.props.removeNode(item);
      } else {
        this.props.removeObject(item);
      }
    };
    const toggle = (item, on) => {
      if (isNode) {
        this.props.toggleNode({item, on});
      } else {
        this.toggleObject({item, on});
      }
    };
    return (
      <div>
        <main>
          <Grid>
            <PageHeader>
              <div>
                <span>{I18n.t(`musit.pickList.title.${this.props.route.type}`)}</span>
                <div
                  style={{
                    float: 'right',
                    margin: '0 25px 0 0'
                  }}
                >
                  <Button
                    active={this.props.scannerEnabled}
                    onClick={() => this.props.toggleScanner()}
                  >
                    <img src={scannerIcon} height={25} alt="scan" />
                  </Button>
                </div>
              </div>
            </PageHeader>
            <Table responsive striped condensed hover>
              <thead>
              <tr>
                <th style={{ width: '2em', textAlign: 'left' }}>
                  <input
                    className="normalAction"
                    type="checkbox"
                    checked={marked.length === pickList.length && pickList.length !== 0}
                    onChange={(e) => toggle(pickList.map(p => p.value), e.target.checked)}
                    title={I18n.t('musit.pickList.tooltip.checkBoxMarkAll')}
                  />
                </th>
                <th style={{ verticalAlign: 'bottom', textAlign: 'left' }}>
                  { isNode ?
                    <FontAwesome
                      className="normalActionNoPadding"
                      style={{ fontSize: '1.5em' }}
                      name="print"
                      onClick={() => {
                        if (marked.length > 0) {
                          this.print(marked);
                        }
                      }}
                      title={I18n.t('musit.pickList.tooltip.printSelectedNodes')}
                    /> : null
                  }
                  { isNode ? this.selectedCount(isNode, marked.length) : null}
                  <FontAwesome
                    className={isNode ? 'normalAction' : 'normalActionNoPadding'}
                    name="truck"
                    style={{ fontSize: '1.5em' }}
                    onClick={() => {
                      if (marked.length > 0) {
                        this.showMoveNodes(markedValues);
                      }
                    }}
                    title={I18n.t(`musit.pickList.tooltip.${isNode ? 'moveSelectedNodes' : 'moveSelectedObjects'}`)}
                  />
                  {this.selectedCount(isNode, marked.length)}
                  <FontAwesome
                    className="normalAction"
                    style={{ fontSize: '1.5em' }}
                    name="remove"
                    onClick={() => {
                      if (marked.length > 0) {
                        remove(markedValues);
                      }
                    }}
                    title={I18n.t(`musit.pickList.tooltip.${isNode ? 'removeSelectedNodesFromList' : 'removeSelectedObjectsFromList'}`)}
                  />
                  {this.selectedCount(isNode, marked.length)}
                </th>
              </tr>
              </thead>
              <tbody>
              {pickList.map((pick, i) => {
                const item = pick.value;
                const isItemMarked = pick.marked;
                const isMainObject = item.isMainObject && (!item.mainObjectId || item.isMainObject());
                const isChildObject = item.isMainObject && (item.mainObjectId && !item.isMainObject());
                return (
                  <tr key={i} className={isChildObject ? 'childObject' : isMainObject && 'mainObject' }>
                    <td style={{ width: '3em', textAlign: 'left', verticalAlign: 'middle' }}>
                      <span>
                        {!item.mainObjectId || isMainObject ?
                          <input
                            type="checkbox"
                            checked={isItemMarked ? 'checked' : ''}
                            onChange={() => toggle(item)}
                          />
                          :
                          <input
                            type="checkbox"
                            checked={isItemMarked ? 'checked' : ''}
                            disabled
                          />
                        }
                      </span>
                    </td>
                    <td>
                      <span className="pickListIcon">
                        {this.iconRenderer(pick)} {this.labelRenderer(isNode, pick)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
            <div style={{ textAlign: 'left' }}>
              {marked.length}/{pickList.length} &nbsp;
              {isNode ? I18n.t('musit.pickList.footer.nodeSelected')
                : I18n.t('musit.pickList.footer.objectSelected') }
            </div>
          </Grid>
        </main>
      </div>
    );
  }
}