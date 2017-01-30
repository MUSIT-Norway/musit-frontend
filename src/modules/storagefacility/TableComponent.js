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
import MusitObject from '../../models/object';
import MusitNode from '../../models/node';
import PagingToolbar from '../../shared/paging';
import { emitError, emitSuccess } from '../../shared/errors';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';

import MusitModal from '../movedialog/MoveDialogComponent';
import MusitModalHistory from '../movehistory/MoveHistoryComponent';

import Config from '../../config';

import { Observable } from 'rxjs';

import inject from 'react-rxjs/dist/RxInject';

import tableStore$, {
  loadNodes$,
  loadStats$,
  loadRootNode$,
  loadObjects$,
  setLoading$,
  clearRootNode$
} from './tableStore';

export class StorageUnitsContainer extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired,
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
    emitSuccess: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    showModal: React.PropTypes.func,
    showConfirm: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { searchPattern: '' };
    this.loadNodes = this.loadNodes.bind(this);
    this.loadObjects = this.loadObjects.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.moveObject = this.moveObject.bind(this);
    this.showObjectMoveHistory = this.showObjectMoveHistory.bind(this);
    this.onClickCrumb = this.onClickCrumb.bind(this);
    this.showMoveNodeModal = this.showMoveNodeModal.bind(this);
    this.showMoveObjectModal = this.showMoveObjectModal.bind(this);
  }

  getCurrentPage(
    state = this.props.location.state
  ) {
    return state && state.currentPage;
  }

  loadRootNode(nodeId, museumId, token) {
    this.props.clearRootNode();
    if (!nodeId) {
      return;
    }
    this.props.loadRootNode({
      nodeId,
      museumId,
      token,
      onComplete: node => {
        if (node && !new MusitNode(node).isRootNode()) {
          this.props.loadStats({nodeId, museumId, token});
        }
      }
    });
  }

  componentWillMount(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken()
  ) {
    this.loadRootNode(nodeId, museumId, token);
    if (this.props.route.showObjects) {
      this.loadObjects(nodeId, museumId, collectionId, token);
    } else {
      this.loadNodes(nodeId, museumId, token);
    }
  }

  componentWillReceiveProps(newProps) {
    const museumHasChanged = newProps.appSession.getMuseumId() !== this.props.appSession.getMuseumId();
    const collectionHasChanged = newProps.appSession.getCollectionId() !== this.props.appSession.getCollectionId();
    const museumId = newProps.appSession.getMuseumId();
    const collectionId = newProps.appSession.getCollectionId();
    const token = this.props.appSession.getAccessToken();
    const nodeId = museumHasChanged ? null : newProps.params.id;
    const locationState = newProps.location.state;
    const idHasChanged = newProps.params.id !== this.props.params.id;
    const stateHasChanged = locationState !== this.props.location.state;
    if (idHasChanged || museumHasChanged || collectionHasChanged || stateHasChanged) {
      const currentPage = this.getCurrentPage(locationState);
      this.loadRootNode(nodeId, museumId, token);
      if (newProps.route.showObjects) {
        this.loadObjects(nodeId, museumId, collectionId, token, currentPage);
      } else {
        this.loadNodes(nodeId, museumId, token, currentPage);
      }
    }
  }

  onClickCrumb(node) {
    hashHistory.push(node.url);
  }

  showNodes(
    node = this.props.store.rootNode
  ) {
    if (node && node.id) {
      hashHistory.push(`/magasin/${node.id}`);
    } else {
      hashHistory.push('/magasin');
    }
  }

  showObjects(
    node = this.props.store.rootNode
  ) {
    if (node) {
      hashHistory.push(`/magasin/${node.id}/objects`);
    } else {
      hashHistory.push('/magasin');
    }
  }

  loadNodes(nodeId, museumId, token, page) {
    this.props.setLoading();
    this.props.loadNodes({
      nodeId,
      museumId,
      page,
      token
    });
  }

  loadObjects(nodeId, museumId, collectionId, token, page) {
    if (nodeId) {
      this.props.setLoading();
      this.props.loadObjects({
        nodeId,
        museumId,
        collectionId,
        page,
        token
      });
    }
  }

  showMoveNodeModal(
    nodeToMove,
    showModal = this.context.showModal
  ) {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveNode(nodeToMove)} />);
  }

  moveNode = (
    nodeToMove,
    userId = this.props.appSession.getActor().getActorId(),
    museumId = this.props.appSession.getMuseumId(),
    token = this.props.appSession.getAccessToken(),
    nodeId = this.props.store.rootNode.id,
    moveNode = this.props.moveNode,
    loadNodes = this.loadNodes
  ) => (toNode, toName, onSuccess) => {
    const errorMessage = checkNodeBranchAndType(nodeToMove, toNode);
    if (!errorMessage) {
      nodeToMove.moveNode(toNode.id, userId, museumId, token, {
        onComplete: () => {
          onSuccess();
          loadNodes();
          this.props.emitSuccess({
            type: 'movedSuccess',
            message: I18n.t('musit.moveModal.messages.nodeMoved', {name: nodeToMove.name, destination: toName})
          });
        },
        onFailure: (e) => {
          this.props.emitError({
            type: 'errorOnMove',
            error: e,
            message: I18n.t('musit.moveModal.messages.errorNode', {name: nodeToMove.name, destination: toName})
          });
        }
      });
    } else {
      this.props.emitError({
        type: 'errorOnMove',
        message: errorMessage
      });
    }
  };

  showMoveObjectModal(
    objectToMove,
    showModal = this.context.showModal
  ) {
    const objStr = objectToMove.getObjectDescription();
    const title = I18n.t('musit.moveModal.moveObject', { name: objStr });
    showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveObject(objectToMove)} />, this.props.clearMoveDialog);
  }

  moveObject = (
    objectToMove,
    userId = this.props.appSession.getActor().getActorId(),
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    nodeId = this.props.store.rootNode.id,
    moveObject = this.props.moveObject,
    loadObjects = this.loadObjects
  ) => (toNode, toName, onSuccess) => {
    const description = objectToMove.getObjectDescription();
    objectToMove.moveObject(toNode.id, userId, museumId, collectionId, token, {
      onComplete: () => {
        onSuccess();
        loadObjects();
        this.props.emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', {name: description, destination: toName})
        });
      },
      onFailure: (e) => {
        this.props.emitError({
          type: 'errorOnMove',
          error: e,
          message: I18n.t('musit.moveModal.messages.errorObject', {name: description.name, destination: toName})
        });
      }
    });
  };

  showObjectMoveHistory(
    objectToShowHistoryFor,
    showModal = this.context.showModal
  ) {
    const objStr = objectToShowHistoryFor.getObjectDescription();
    const componentToRender = <MusitModalHistory appSession={this.props.appSession} objectId={objectToShowHistoryFor.id} />;
    const title = `${I18n.t('musit.moveHistory.title')} ${objStr}`;
    showModal(title, componentToRender);
  }

  makeToolbar(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    showObjects = this.props.route.showObjects,
    searchPattern = this.state.searchPattern
  ) {
    return <Toolbar
      showRight={!!showObjects}
      showLeft={!showObjects}
      labelRight={I18n.t('mmusit.grid.button.objects')}
      labelLeft={I18n.t('musit.grid.button.nodes')}
      placeHolderSearch={I18n.t('musit.grid.search.placeHolder')}
      searchValue={searchPattern}
      onSearchChanged={(newPattern) => this.setState({ ...this.state, searchPattern: newPattern })}
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
    />;
  }

  makeLeftMenu(
    museumId = this.props.appSession.getMuseumId(),
    token = this.props.appSession.getAccessToken(),
    rootNode = this.props.store.rootNode,
    stats = this.props.store.stats,
    deleteNode = this.props.deleteNode,
    moveNode = this.showMoveNodeModal,
    confirm = this.context.showConfirm
  ) {
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
          showNewNode={!!rootNode}
          showButtons={rootNode && !rootNode.isRootNode()}
          onClickNewNode={() => {
            if (rootNode.id) {
              hashHistory.push(`/magasin/${rootNode.id}/add`);
            } else {
              hashHistory.push('/magasin/add');
            }
          }}
          stats={stats}
          onClickProperties={() => {
            hashHistory.push({
              pathname: `/magasin/${rootNode.id}/view`,
              state: rootNode
            });
          }}
          onClickControlObservations={() => hashHistory.push(`/magasin/${rootNode.id}/controlsobservations`)}
          onClickObservations={() => hashHistory.push(`/magasin/${rootNode.id}/observations`)}
          onClickController={() => hashHistory.push(`/magasin/${rootNode.id}/controls`)}
          onClickMoveNode={() => moveNode(rootNode)}
          onClickDelete={() => {
            const message = I18n.t('musit.leftMenu.node.deleteMessages.askForDeleteConfirmation', {
              name: rootNode.name
            });
            confirm(message, () => {
              deleteNode(rootNode.id, museumId, token, {
                onComplete: () => {
                  if (rootNode.isPartOf) {
                    hashHistory.replace(`/magasin/${rootNode.isPartOf}`);
                  }
                  this.props.emitSuccess({
                    type: 'deleteSuccess',
                    message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name: rootNode.name})
                  });
                },
                onFailure: (e) => {
                  if (e.status===403) {
                    this.props.emitError({
                      type: 'deleteError',
                      message: I18n.t('musit.errorMainMessages.notAllowed')
                    });
                  } else if (e.status===400) {
                    this.props.emitError({
                      type: 'deleteError',
                      message: I18n.t('musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild')
                    });
                  } else {
                    this.props.emitError({
                      type: 'deleteError',
                      message: e.message
                    });
                  }
                }
              });
            });
          }}
        />
      </div>
    );
  }

  makeContentGrid(
    searchPattern = this.state.searchPattern,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    rootNode = this.props.store.rootNode,
    children = this.props.store.children,
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
            tableData={matches && matches[0] && !!matches[0].museumNo ?
              filter(matches, ['museumNo', 'subNo', 'term'], searchPattern) : []}
            showMoveHistory={showHistory}
            pickObject={(object) =>
              this.props.pickObject(
                object,
                rootNode.breadcrumb,
                museumId,
                collectionId,
                token
              )
            }
            onMove={moveObject}
          />
          {showPaging &&
            <PagingToolbar
              numItems={totalMatches}
              currentPage={currentPage}
              perPage={Config.magasin.limit}
              onClick={(cp) => {
                hashHistory.replace({
                  pathname: `/magasin/${rootNode.id}/objects`,
                  state: {
                    currentPage: cp
                  }
                });
              }}
            />
          }
        </Loader>
      );
    }
    return (
      <Loader loaded={!isLoading}>
        <NodeGrid
          tableData={matches && matches[0] && !!matches[0].name ?
            filter(matches, ['name'], searchPattern) : []}
          goToEvents={(node) => hashHistory.push(`/magasin/${node.id}/controlsobservations`)}
          onMove={moveNode}
          pickNode={(node) => this.props.pickNode(node, rootNode.breadcrumb)}
          onClick={(node) => hashHistory.push(`/magasin/${node.id}`)}
        />
        {showPaging &&
          <PagingToolbar
            numItems={totalMatches}
            currentPage={currentPage}
            perPage={Config.magasin.limit}
            onClick={(cp) => {
              hashHistory.replace({
                pathname: `/magasin/${rootNode.id}`,
                state: {
                  currentPage: cp
                }
              });
            }}
          />
        }
      </Loader>
    );
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={<Breadcrumb node={this.props.store.rootNode} onClickCrumb={this.onClickCrumb} />}
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContentGrid()}
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.instanceOf(Observable).isRequired },
  store$: tableStore$
};

const commands = {
  clearRootNode$,
  loadStats$,
  loadRootNode$,
  loadNodes$,
  loadObjects$,
  setLoading$
};

const props = {
  pickNode: MusitNode.pickNode,
  pickObject: MusitObject.pickObject,
  deleteNode: MusitNode.deleteNode,
  emitError,
  emitSuccess
};

export default inject(data, commands, props)(StorageUnitsContainer);
