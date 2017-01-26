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
import MusitObject from '../../shared/models/object';
import MusitNode from '../../shared/models/node';
import PagingToolbar from '../../shared/paging';
import { emitError, emitSuccess } from '../../shared/errors';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';

import MusitModal from '../movedialog/MusitModalContainer';
import MusitModalHistory from '../movehistory/MoveHistoryContainer';

import Config from '../../config';
import inject from '../../rxjs/inject';

import {connect} from 'react-redux';
import { clear } from './reducers/modal';

import { Observable } from 'rxjs';

import tableStore$, {
  loadNodes$,
  loadStats$,
  loadRootNode$,
  loadObjects$,
  deleteNode$,
  setLoading$,
  clearRootNode$
} from './tableStore';

import { addNode$ as pickNode$, addObject$ as pickObject$ } from '../app/pickList';

const getObjectDescription = (object) => {
  let objStr = object.museumNo ? `${object.museumNo}` : '';
  objStr = object.subNo ? `${objStr} - ${object.subNo}` : objStr;
  objStr = object.term ? `${objStr} - ${object.term}` : objStr;
  return objStr;
};

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
    pickMainObject: React.PropTypes.func.isRequired,
    pickNode: React.PropTypes.func.isRequired,
    clearMoveDialog: React.PropTypes.func.isRequired,
    setLoading: React.PropTypes.func.isRequired,
    clearRootNode: React.PropTypes.func.isRequired
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

  componentWillMount() {
    this.props.clearRootNode();
    this.props.setLoading();
    if (this.props.route.showObjects) {
      this.loadObjects();
      const nodeId = this.props.params.id;
      if (nodeId) {
        const museumId = this.props.appSession.getMuseumId();
        const token = this.props.appSession.getAccessToken();
        this.loadRootNode(nodeId, museumId, token);
      }
    } else {
      this.loadNodes();
    }
  }

  componentWillReceiveProps(newProps) {
    const museumHasChanged = newProps.appSession.getMuseumId() !== this.props.appSession.getMuseumId();
    const museumId = museumHasChanged ? newProps.appSession.getMuseumId() : this.props.appSession.getMuseumId();
    const collectionId = museumHasChanged ? newProps.appSession.getCollectionId() : this.props.appSession.getCollectionId();
    const nodeId = museumHasChanged ? null : (newProps.params.id || null);
    const locationState = newProps.location.state;
    const idHasChanged = newProps.params.id !== this.props.params.id;
    const stateHasChanged = locationState !== this.props.location.state;
    const token = this.props.appSession.getAccessToken();
    if (idHasChanged || museumHasChanged || stateHasChanged) {
      const currentPage = this.getCurrentPage(locationState);
      this.props.clearRootNode();
      this.props.setLoading();
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

  loadNodes(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.getMuseumId(),
    token = this.props.appSession.getAccessToken(),
    currentPage = this.getCurrentPage()
  ) {
    this.props.setLoading();
    if (nodeId) {
      this.loadRootNode(nodeId, museumId, token);
    }
    this.props.loadNodes({
      nodeId,
      museumId,
      page: currentPage,
      token
    });
  }

  loadObjects(
    nodeId = this.props.params.id,
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    token = this.props.appSession.getAccessToken(),
    currentPage = this.getCurrentPage(),
  ) {
    if (nodeId) {
      this.props.setLoading();
      this.props.loadObjects({
        nodeId,
        museumId,
        collectionId,
        page: currentPage,
        token
      });
    }
  }

  showMoveNodeModal(
    nodeToMove,
    showModal = this.context.showModal
  ) {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveNode(nodeToMove)} />, this.props.clearMoveDialog);
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
          emitSuccess({
            type: 'movedSuccess',
            message: I18n.t('musit.moveModal.messages.nodeMoved', {name: nodeToMove.name, destination: toName})
          });
        },
        onFailure: (e) => {
          emitError({
            type: 'errorOnMove',
            error: e,
            message: I18n.t('musit.moveModal.messages.errorNode', {name: nodeToMove.name, destination: toName})
          });
        }
      });
    } else {
      emitError({
        type: 'errorOnMove',
        message: errorMessage
      });
    }
  };

  showMoveObjectModal(
    objectToMove,
    showModal = this.context.showModal
  ) {
    const objStr = getObjectDescription(objectToMove);
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
    const description = getObjectDescription(objectToMove);
    objectToMove.moveObject(toNode.id, userId, museumId, collectionId, token, {
      onComplete: () => {
        onSuccess();
        loadObjects();
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', {name: description, destination: toName})
        });
      },
      onFailure: (e) => {
        emitError({
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
    const objStr = getObjectDescription(objectToShowHistoryFor);
    const componentToRender = <MusitModalHistory appSession={this.props.appSession} objectId={objectToShowHistoryFor.id} />;
    const title = `${I18n.t('musit.moveHistory.title')} ${objStr}`;
    showModal(title, componentToRender);
  }

  makeToolbar(
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
        this.loadObjects();
        blur();
      }}
      clickShowLeft={() => {
        this.showNodes();
        this.loadNodes();
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
              deleteNode({nodeId: rootNode.id, museumId, token,
                onComplete: () => {
                  if (rootNode.isPartOf) {
                    hashHistory.replace(`/magasin/${rootNode.isPartOf}`);
                  }
                  emitSuccess({
                    type: 'deleteSuccess',
                    message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name: rootNode.name})
                  });
                },
                onFailure: (e) => {
                  if (e.status===403) {
                    emitError({
                      type: 'deleteError',
                      message: I18n.t('musit.errorMainMessages.notAllowed')
                    });
                  } else if (e.status===400) {
                    emitError({
                      type: 'deleteError',
                      message: I18n.t('musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild')
                    });
                  } else {
                    emitError({
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
    if (showObjects) {
      return (
        <Loader loaded={!isLoading}>
          <ObjectGrid
            tableData={matches && matches[0] && !!matches[0].museumNo ?
              filter(matches, ['museumNo', 'subNo', 'term'], searchPattern) : []}
            showMoveHistory={showHistory}
            pickObject={(object) =>
              this.props.pickObject({
                value: object,
                path: rootNode.breadcrumb
              })
            }
            pickMainObject={(object) =>
              this.props.pickMainObject({
                id: object.id,
                path: rootNode.breadcrumb,
                museumId,
                collectionId,
                token
              })
            }
            onMove={moveObject}
          />
          {totalMatches > 0 &&
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
          pickNode={(node) =>
            this.props.pickNode({
              value: node,
              path: rootNode.breadcrumb
            })
          }
          onClick={(node) => hashHistory.push(`/magasin/${node.id}`)}
        />
        {totalMatches > 0 &&
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

const mapDispatchToProps = (dispatch) => {
  return {
    clearMoveDialog: () => dispatch(clear())
  };
};

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
  deleteNode$,
  setLoading$,
  pickObject$,
  pickNode$
};

const props = {
  pickMainObject: (cmd) =>
    MusitObject.getMainObject(cmd.id, cmd.museumId, cmd.collectionId, cmd.token, cmd.callback)
      .toPromise()
      .then(objects =>
        objects.forEach(obj => pickObject$.next({value: obj, path: cmd.path}))
      )
};

export default connect(null, mapDispatchToProps)(inject(data, commands, props)(StorageUnitsContainer));
