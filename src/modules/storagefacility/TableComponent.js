import React from 'react';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import Loader from 'react-loader';
import NodeGrid from './NodeTable';
import ObjectGrid from './ObjectTable';
import NodeLeftMenuComponent from './TableLeftMenu';
import Layout from '../../components/layout';
import Toolbar from '../../components/layout/Toolbar';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { blur, filter } from '../../shared/util';
import MusitNode from '../../models/node';
import MusitObject from '../../models/object';
import Actor from '../../models/actor';
import PagingToolbar from '../../components/PagingToolbar';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import MusitModal from '../movedialog/MoveDialogComponent';
import MusitModalHistory from '../movehistory/MoveHistoryComponent';
import Config from '../../config';
import ScannerButton from '../../components/scanner/ScannerButton';

export default class TableComponent extends React.Component {
  static propTypes = {
    appSession: React.PropTypes.object.isRequired,
    tableStore: React.PropTypes.object.isRequired,
    loadNodes: React.PropTypes.func.isRequired,
    loadObjects: React.PropTypes.func.isRequired,
    loadStats: React.PropTypes.func.isRequired,
    loadRootNode: React.PropTypes.func.isRequired,
    deleteNode: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    pickObject: React.PropTypes.func.isRequired,
    pickNode: React.PropTypes.func.isRequired,
    setLoading: React.PropTypes.func.isRequired,
    clearRootNode: React.PropTypes.func.isRequired,
    emitError: React.PropTypes.func.isRequired,
    emitSuccess: React.PropTypes.func.isRequired,
    refreshSession: React.PropTypes.func.isRequired,
    pickList: React.PropTypes.object.isRequired,
    isItemAdded: React.PropTypes.func.isRequired,
    toggleScanner: React.PropTypes.func.isRequired,
    scannerEnabled: React.PropTypes.bool.isRequired,
    goTo: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { searchPattern: '' };
    this.loadNodes = this.loadNodes.bind(this);
    this.loadRootNode = this.loadRootNode.bind(this);
    this.loadObjects = this.loadObjects.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.moveObject = this.moveObject.bind(this);
    this.showObjectMoveHistory = this.showObjectMoveHistory.bind(this);
    this.showMoveNodeModal = this.showMoveNodeModal.bind(this);
    this.showMoveObjectModal = this.showMoveObjectModal.bind(this);
    this.showNodes = this.showNodes.bind(this);
  }

  getCurrentPage(state = this.props.location.state) {
    return state && state.currentPage;
  }

  loadRootNode(nodeId, museumId, token) {
    this.props.clearRootNode();
    if (!nodeId) {
      return;
    }
    this.props.loadRootNode({
      id: nodeId,
      museumId,
      token,
      callback: {
        onComplete: node => {
          if (node && !MusitNode.isRootNode(node)) {
            this.props.loadStats({ id: nodeId, museumId, token });
          }
        }
      }
    });
  }

  componentWillMount(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken
  ) {
    this.loadRootNode(nodeId, museumId, token);
    if (this.props.route.showObjects) {
      this.loadObjects(nodeId, museumId, collectionId, token);
    } else {
      this.loadNodes(nodeId, museumId, token);
    }
  }

  componentWillReceiveProps(newProps) {
    const museumHasChanged = newProps.appSession.museumId !==
      this.props.appSession.museumId;
    const collectionHasChanged = newProps.appSession.collectionId !==
      this.props.appSession.collectionId;
    const museumId = newProps.appSession.museumId;
    const collectionId = newProps.appSession.collectionId;
    const token = this.props.appSession.accessToken;
    const nodeId = museumHasChanged ? null : newProps.params.id;
    const locationState = newProps.location.state;
    const idHasChanged = newProps.params.id !== this.props.params.id;
    const stateHasChanged = locationState !== this.props.location.state;

    if (idHasChanged || museumHasChanged || collectionHasChanged || stateHasChanged) {
      const currentPage = this.getCurrentPage(locationState);
      this.loadRootNode(nodeId, museumId, token);
      if (newProps.route.showObjects) {
        this.loadObjects(nodeId, museumId, collectionId, token, currentPage);
      } else {
        this.loadNodes(nodeId, museumId, token, currentPage);
      }
    }
  }

  showNodes(node = this.props.tableStore.rootNode) {
    const appSession = this.props.appSession;
    if (node && node.nodeId) {
      this.props.goTo(
        Config.magasin.urls.client.storagefacility.goToNode(node.nodeId, appSession)
      );
    } else {
      this.props.goTo(Config.magasin.urls.client.storagefacility.goToRoot(appSession));
    }
  }

  showObjects(node = this.props.tableStore.rootNode) {
    const appSession = this.props.appSession;
    if (node && node.nodeId) {
      this.props.goTo(
        Config.magasin.urls.client.storagefacility.goToObjects(node.nodeId, appSession)
      );
    } else {
      this.props.goTo(Config.magasin.urls.client.storagefacility.goToRoot(appSession));
    }
  }

  loadNodes(
    id,
    museumId = this.props.appSession.museumId,
    token = this.props.appSession.accessToken,
    page
  ) {
    this.props.setLoading();
    this.props.loadNodes({
      id,
      museumId,
      page,
      token
    });
  }

  loadObjects(
    id,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    page
  ) {
    if (id) {
      this.props.setLoading();
      this.props.loadObjects({
        id,
        museumId,
        collectionId,
        page,
        token
      });
    }
  }

  showMoveNodeModal(nodeToMove) {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    this.props.showModal(
      title,
      <MusitModal appSession={this.props.appSession} onMove={this.moveNode(nodeToMove)} />
    );
  }

  moveNode = (
    nodeToMove,
    userId = Actor.getActorId(this.props.appSession.actor),
    museumId = this.props.appSession.museumId,
    token = this.props.appSession.accessToken,
    nodeId = this.props.tableStore.rootNode.nodeId,
    moveNode = this.props.moveNode,
    loadNodes = this.loadNodes,
    loadRootNode = this.loadRootNode
  ) =>
    (toNode, toName, onSuccess, onFailure = () => true) => {
      const errorMessage = checkNodeBranchAndType(nodeToMove, toNode);
      if (!errorMessage) {
        MusitNode.moveNode()({
          id: nodeToMove.nodeId,
          destination: toNode.nodeId,
          doneBy: userId,
          museumId,
          token,
          callback: {
            onComplete: () => {
              onSuccess();
              loadRootNode(nodeId, museumId, token);
              loadNodes(nodeId);
              this.props.emitSuccess({
                type: 'movedSuccess',
                message: I18n.t('musit.moveModal.messages.nodeMoved', {
                  name: nodeToMove.name,
                  destination: toName
                })
              });
            },
            onFailure: e => {
              onFailure();
              this.props.emitError({
                type: 'errorOnMove',
                error: e,
                message: I18n.t('musit.moveModal.messages.errorNode', {
                  name: nodeToMove.name,
                  destination: toName
                })
              });
            }
          }
        }).toPromise();
      } else {
        onFailure();
        this.props.emitError({
          type: 'errorOnMove',
          message: errorMessage
        });
      }
    };

  showMoveObjectModal(objectToMove) {
    const objStr = MusitObject.getObjectDescription(objectToMove);
    const title = I18n.t('musit.moveModal.moveObject', { name: objStr });
    this.props.showModal(
      title,
      <MusitModal
        appSession={this.props.appSession}
        onMove={this.moveObject(objectToMove)}
      />,
      this.props.clearMoveDialog
    );
  }

  moveObject = (
    objectToMove,
    userId = Actor.getActorId(this.props.appSession.actor),
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    nodeId = this.props.tableStore.rootNode.nodeId,
    loadObjects = this.loadObjects
  ) =>
    (toNode, toName, onSuccess, onFailure = () => true) => {
      const description = MusitObject.getObjectDescription(objectToMove);
      MusitObject.moveObjects({
        object: objectToMove,
        destination: toNode.nodeId,
        doneBy: userId,
        museumId,
        collectionId,
        token,
        callback: {
          onComplete: () => {
            onSuccess();
            loadObjects(nodeId);
            this.props.emitSuccess({
              type: 'movedSuccess',
              message: I18n.t('musit.moveModal.messages.objectMoved', {
                name: description,
                destination: toName
              })
            });
          },
          onFailure: e => {
            onFailure();
            this.props.emitError({
              type: 'errorOnMove',
              error: e,
              message: I18n.t('musit.moveModal.messages.errorObject', {
                name: description,
                destination: toName
              })
            });
          }
        }
      });
    };

  showObjectMoveHistory(objectToShowHistoryFor) {
    const objStr = MusitObject.getObjectDescription(objectToShowHistoryFor);
    const componentToRender = (
      <MusitModalHistory
        appSession={this.props.appSession}
        objectId={objectToShowHistoryFor.uuid}
      />
    );
    const title = `${I18n.t('musit.moveHistory.title')} ${objStr}`;
    this.props.showModal(title, componentToRender);
  }

  makeToolbar(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    showObjects = this.props.route.showObjects,
    searchPattern = this.state.searchPattern
  ) {
    return (
      <Toolbar
        showRight={!!showObjects}
        showLeft={!showObjects}
        labelRight={I18n.t('musit.grid.button.objects')}
        labelLeft={I18n.t('musit.grid.button.nodes')}
        placeHolderSearch={I18n.t('musit.grid.search.placeHolder')}
        searchValue={searchPattern}
        onSearchChanged={newPattern =>
          this.setState({ ...this.state, searchPattern: newPattern })}
        clickShowRight={() => {
          this.showObjects();
          this.loadObjects(nodeId, museumId, collectionId, token);
          blur();
        }}
        clickShowLeft={() => {
          this.showNodes();
          this.loadNodes(nodeId, museumId, token);
          blur();
        }}
      />
    );
  }

  makeLeftMenu(
    museumId = this.props.appSession.museumId,
    token = this.props.appSession.accessToken,
    rootNode = this.props.tableStore.rootNode,
    stats = this.props.tableStore.stats,
    deleteNode = this.props.deleteNode,
    moveNode = this.showMoveNodeModal,
    confirm = this.props.showConfirm
  ) {
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
          showNewNode={!!rootNode}
          showButtons={rootNode && !MusitNode.isRootNode(rootNode)}
          onClickNewNode={() =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.addNode(
                rootNode.nodeId,
                this.props.appSession
              )
            )}
          stats={stats}
          onClickProperties={() => {
            this.props.goTo({
              pathname: Config.magasin.urls.client.storagefacility.editNode(
                rootNode.nodeId,
                this.props.appSession
              ),
              state: rootNode
            });
          }}
          onClickControlObservations={() =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.viewControlsObservations(
                rootNode.nodeId,
                this.props.appSession
              )
            )}
          onClickMoveNode={() => moveNode(rootNode)}
          onClickDelete={() => {
            const message = I18n.t(
              'musit.leftMenu.node.deleteMessages.askForDeleteConfirmation',
              {
                name: rootNode.name
              }
            );
            confirm(message, () => {
              deleteNode({
                id: rootNode.nodeId,
                museumId,
                token,
                callback: {
                  onComplete: () => {
                    if (rootNode.isPartOf) {
                      hashHistory.replace(
                        Config.magasin.urls.client.storagefacility.goToNode(
                          rootNode.pathNames.filter(
                            path => path.nodeId === rootNode.isPartOf
                          )[0].nodeUuid,
                          this.props.appSession
                        )
                      );
                    }
                    this.props.emitSuccess({
                      type: 'deleteSuccess',
                      message: I18n.t(
                        'musit.leftMenu.node.deleteMessages.confirmDelete',
                        { name: rootNode.name }
                      )
                    });
                  },
                  onFailure: e => {
                    if (e.status === 403) {
                      this.props.emitError({
                        type: 'deleteError',
                        message: I18n.t('musit.errorMainMessages.notAllowed')
                      });
                    } else if (e.status === 400) {
                      this.props.emitError({
                        type: 'deleteError',
                        message: I18n.t(
                          'musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild'
                        )
                      });
                    } else {
                      this.props.emitError({
                        type: 'deleteError',
                        message: e.message
                      });
                    }
                  }
                }
              }).toPromise();
            });
          }}
        />
      </div>
    );
  }

  makeContentGrid(
    searchPattern = this.state.searchPattern,
    museumId = this.props.appSession.museumId,
    collectionId = this.props.appSession.collectionId,
    token = this.props.appSession.accessToken,
    rootNode = this.props.tableStore.rootNode,
    children = this.props.tableStore.children,
    showObjects = this.props.route.showObjects,
    moveNode = this.showMoveNodeModal,
    moveObject = this.showMoveObjectModal,
    showHistory = this.showObjectMoveHistory
  ) {
    const currentPage = this.getCurrentPage() || 1;
    const matches = children && children.data && children.data.matches;
    const totalMatches = children && children.data && children.data.totalMatches;
    const isLoading = children && children.loading;
    const showPaging = totalMatches > 0 && totalMatches > Config.magasin.limit;
    if (showObjects) {
      return (
        <Loader loaded={!isLoading}>
          <ObjectGrid
            tableData={
              matches ? filter(matches, ['museumNo', 'subNo', 'term'], searchPattern) : []
            }
            showMoveHistory={showHistory}
            pickObject={object =>
              this.props.pickObject({
                object,
                breadcrumb: rootNode.breadcrumb,
                museumId,
                collectionId,
                token
              })}
            isObjectAdded={object =>
              this.props.isItemAdded(object, this.props.pickList.objects)}
            onMove={moveObject}
          />
          {showPaging &&
            <PagingToolbar
              numItems={totalMatches}
              currentPage={currentPage}
              perPage={Config.magasin.limit}
              onClick={cp => {
                hashHistory.replace({
                  pathname: Config.magasin.urls.client.storagefacility.goToObjects(
                    rootNode.nodeId,
                    this.props.appSession
                  ),
                  state: {
                    currentPage: cp
                  }
                });
              }}
            />}
        </Loader>
      );
    }
    return (
      <Loader loaded={!isLoading}>
        <NodeGrid
          tableData={matches ? filter(matches, ['name'], searchPattern) : []}
          goToEvents={node =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.viewControlsObservations(
                node.nodeId,
                this.props.appSession
              )
            )}
          onMove={moveNode}
          pickNode={node =>
            this.props.pickNode({ node, breadcrumb: rootNode.breadcrumb })}
          onClick={node =>
            this.props.goTo(
              Config.magasin.urls.client.storagefacility.goToNode(
                node.nodeId,
                this.props.appSession
              )
            )}
          isNodeAdded={node => this.props.isItemAdded(node, this.props.pickList.nodes)}
        />
        {showPaging &&
          <PagingToolbar
            numItems={totalMatches}
            currentPage={currentPage}
            perPage={Config.magasin.limit}
            onClick={cp => {
              hashHistory.replace({
                pathname: Config.magasin.urls.client.storagefacility.goToNode(
                  rootNode.nodeId,
                  this.props.appSession
                ),
                state: {
                  currentPage: cp
                }
              });
            }}
          />}
      </Loader>
    );
  }

  render() {
    const title = (
      <div>
        <span>{I18n.t('musit.storageUnits.title')}</span>
        <div
          style={{
            float: 'right',
            margin: '0 25px 0 0'
          }}
        >
          <ScannerButton
            enabled={this.props.scannerEnabled}
            onClick={this.props.toggleScanner}
          />
        </div>
      </div>
    );
    return (
      <Layout
        title={title}
        breadcrumb={
          <Breadcrumb
            node={this.props.tableStore.rootNode}
            onClickCrumb={this.showNodes}
          />
        }
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContentGrid()}
      />
    );
  }
}
