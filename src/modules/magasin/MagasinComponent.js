import React from 'react';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';

import NodeGrid from './MagasinNodeGrid';
import ObjectGrid from './MagasinObjectGrid';
import SideBar from './MagasinSideBar';

import Layout from '../../layout';
import Toolbar from '../../layout/Toolbar';
import Breadcrumb from '../../layout/Breadcrumb';

import { blur, filter } from '../../util';
import { checkNodeBranchAndType } from '../../util/nodeValidator';
import { emitError, emitSuccess } from '../../util/errors/emitter';
import PagingToolbar from '../../util/paging';

import MusitObject from '../../models/object';
import MusitNode from '../../models/node';

import MoveDialog from '../moveDialog/index';
import MoveHistory from '../moveHistory/index';

import Config from '../../config';

export default class StorageGrid extends React.Component {
  static propTypes = {
    nodes: React.PropTypes.arrayOf(React.PropTypes.object),
    objects: React.PropTypes.arrayOf(React.PropTypes.object),
    rootNode: React.PropTypes.object,
    props: React.PropTypes.object,
    params: React.PropTypes.object,
    history: React.PropTypes.object,
    moves: React.PropTypes.arrayOf(React.PropTypes.object),
    moveObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    addNode: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    loadRoot: React.PropTypes.func.isRequired,
    stats: React.PropTypes.shape({
      numNodes: React.PropTypes.number,
      numObjects: React.PropTypes.number,
      totalObjects: React.PropTypes.number
    })
  };

  static contextTypes = {
    showModal: React.PropTypes.func.isRequired,
    showConfirm: React.PropTypes.func.isRequired
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

  loadRoot(id, museumId) {
    this.props.clearStats();
    this.props.loadRoot(id, museumId, {
      onSuccess: (result) => {
        if (!MusitNode.isRootNode(result.type)) {
          this.props.loadStats(id, museumId);
        }
      }
    });
  }

  componentWillMount() {
    if (this.props.route.showObjects) {
      this.loadObjects();
      if (this.props.params.id && !this.props.rootNode.id) {
        this.loadRoot(this.props.params.id, this.props.user.museumId);
      }
    } else {
      this.loadNodes();
    }
  }

  loadChildren(id, museumId, currentPage) {
    this.props.loadChildren(id, museumId, currentPage);
    this.props.clearRoot();
    this.props.clearStats();
    this.props.loadRoot(id, museumId, {
      onSuccess: (result) => {
        if (!MusitNode.isRootNode(result.type)) {
          this.props.loadStats(id, museumId);
        }
      }
    });
  }

  loadStorageObjects(id, museumId, collectionId, currentPage) {
    this.props.loadObjects(id, museumId, collectionId, currentPage);
  }

  loadStorageUnits(museumId, currentPage) {
    this.props.clearRoot();
    this.props.loadRoot(null, museumId, currentPage);
    this.props.clearStats();
  }

  componentWillReceiveProps(newProps) {
    const museumHasChanged = newProps.user.museumId !== this.props.user.museumId;
    const museumId = museumHasChanged ? newProps.user.museumId : this.props.user.museumId;
    const nodeId = museumHasChanged ? null : newProps.params.id;
    const locationState = newProps.location.state;
    const idHasChanged = newProps.params.id !== this.props.params.id;
    const stateHasChanged = locationState !== this.props.location.state;
    if (idHasChanged || museumHasChanged || stateHasChanged) {
      const currentPage = this.getCurrentPage(locationState);
      if (newProps.route.showObjects) {
        this.loadObjects(currentPage);
      } else if (nodeId) {
        this.loadChildren(nodeId, museumId, currentPage);
      } else {
        this.loadStorageUnits(museumId, currentPage);
      }
    }
  }

  onClickCrumb(node) {
    this.showNodes();
    hashHistory.push(node.url);
  }

  showNodes() {
    if (this.props.rootNode) {
      hashHistory.push(`/magasin/${this.props.rootNode.id}`);
    } else {
      hashHistory.push('/magasin');
    }
  }

  showObjects() {
    if (this.props.rootNode) {
      hashHistory.push(`/magasin/${this.props.rootNode.id}/objects`);
    } else {
      hashHistory.push('/magasin');
    }
  }

  loadNodes() {
    if (this.props.params.id) {
      this.loadChildren(this.props.params.id, this.props.user.museumId, this.getCurrentPage());
    } else {
      this.loadStorageUnits(this.props.user.museumId, this.getCurrentPage());
    }
  }

  loadObjects(currentPage = this.getCurrentPage()) {
    if (this.props.params.id) {
      this.loadStorageObjects(this.props.params.id, this.props.user.museumId, this.props.user.collectionId, currentPage);
    }
  }

  showMoveNodeModal(
    nodeToMove,
    showModal = this.context.showModal
  ) {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    showModal(title, MoveDialog.getDialog(this.moveNode(nodeToMove)), this.props.clearMoveDialog);
  }

  moveNode = (
    nodeToMove,
    userId = this.props.user.actor.getActorId(),
    museumId = this.props.user.museumId,
    nodeId = this.props.rootNode.id,
    moveNode = this.props.moveNode,
    loadRoot = this.loadRoot,
    loadNodes = this.loadNodes
  ) => (toNode, toName, onSuccess) => {
    const errorMessage = checkNodeBranchAndType(nodeToMove, toNode);

    if (!errorMessage) {
      moveNode(nodeToMove.id, toNode.id, userId, museumId, {
        onSuccess: () => {
          onSuccess();
          loadNodes();
          loadRoot(nodeId, museumId);
          emitSuccess({
            type: 'movedSuccess',
            message: I18n.t('musit.moveModal.messages.nodeMoved', { name: nodeToMove.name, destination: toName })
          });
        },
        onFailure: (e) => {
          emitError({
            type: 'errorOnMove',
            error: e,
            message: I18n.t('musit.moveModal.messages.errorNode', { name: nodeToMove.name, destination: toName })
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
    const objStr = MusitObject.getObjectDescription(objectToMove);
    const title = I18n.t('musit.moveModal.moveObject', { name: objStr });
    showModal(title, MoveDialog.getDialog(this.moveObject(objectToMove)), this.props.clearMoveDialog);
  }

  moveObject = (
    objectToMove,
    userId = this.props.user.actor.getActorId(),
    museumId = this.props.user.museumId,
    collectionId = this.props.user.collectionId,
    nodeId = this.props.rootNode.id,
    moveObject = this.props.moveObject,
    loadRoot = this.loadRoot,
    loadObjects = this.loadObjects
  ) => (toNode, toName, onSuccess) => {
    const description = MusitObject.getObjectDescription(objectToMove);
    const callback = {
      onSuccess: () => {
        onSuccess();
        loadObjects();
        loadRoot(nodeId, museumId);
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', { name: description, destination: toName })
        });
      },
      onFailure: (e) => {
        emitError({
          type: 'errorOnMove',
          error: e,
          message: I18n.t('musit.moveModal.messages.errorNode', { name: description.name, destination: toName })
        });
      }
    };
    if (objectToMove.isMainObject()) {
      this.props.loadMainObject(objectToMove, museumId, collectionId, {
        onSuccess: (children) => {
          const objectIds = children.map(c => c.id);
          this.props.moveObject(objectIds, toNode.id, userId, museumId, callback);
        }
      });
    } else {
      this.props.moveObject(objectToMove.id, toNode.id, userId, museumId, callback);
    }
  };

  showObjectMoveHistory(
    objectToShowHistoryFor,
    showModal = this.context.showModal
  ) {
    const objStr = MusitObject.getObjectDescription(objectToShowHistoryFor);
    const componentToRender = MoveHistory.getDialog(objectToShowHistoryFor.id);
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
      labelRight="Objekter"
      labelLeft="Noder"
      placeHolderSearch="Filtrer i liste"
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
    museumId = this.props.user.museumId,
    rootNode = this.props.rootNode,
    stats = this.props.stats,
    moveNode = this.showMoveNodeModal,
    confirm = this.context.showConfirm
  ) {
    return (
      <div style={{ paddingTop: 10 }}>
        <SideBar
          rootNode={rootNode}
          showButtons={rootNode && !MusitNode.isRootNode(rootNode.type)}
          onClickNewNode={(parentId) => {
            if (parentId) {
              hashHistory.push(`/magasin/${parentId}/add`);
            } else {
              hashHistory.push('/magasin/add');
            }
          }}
          stats={stats}
          onClickProperties={(id) => hashHistory.push(`/magasin/${id}/view`)}
          onClickControlObservations={(id) => hashHistory.push(`/magasin/${id}/events`)}
          onClickObservations={(id) => hashHistory.push(`/magasin/${id}/observations`)}
          onClickController={(id) => hashHistory.push(`/magasin/${id}/controls`)}
          onClickMoveNode={moveNode}
          onClickDelete={() => {
            confirm(I18n.t('musit.leftMenu.node.deleteMessages.askForDeleteConfirmation', { name: rootNode.name }), () => {
              this.props.deleteUnit(rootNode.id, museumId, {
                onSuccess: () => {
                  this.props.clearRoot();
                  if (rootNode.isPartOf) {
                    hashHistory.replace(`/magasin/${rootNode.isPartOf}`);
                  } else {
                    this.loadRoot(null, museumId);
                    this.props.clearStats();
                  }
                  emitSuccess({
                    type: 'deleteSuccess',
                    message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name: rootNode.name})
                  });
                },
                onFailure: (error) => {
                  if (error.response.status === 400) {
                    emitError({
                      type: 'errorOnDelete',
                      message: I18n.t('musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild')
                    });
                  } else {
                    emitError(error);
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
    museumId = this.props.user.museumId,
    collectionId = this.props.user.collectionId,
    searchPattern = this.state.searchPattern,
    rootNode = this.props.rootNode,
    nodes = this.props.nodes,
    objects = this.props.objects,
    showObjects = this.props.route.showObjects,
    moveNode = this.showMoveNodeModal,
    moveObject = this.showMoveObjectModal,
    showHistory = this.showObjectMoveHistory
  ) {
    if (showObjects) {
      return (
        <div>
          <ObjectGrid
            tableData={filter(objects, ['museumNo', 'subNo', 'term'], searchPattern)}
            showMoveHistory={showHistory}
            onMoveObject={moveObject}
            pickObject={(unit) => {
              if (unit.isMainObject()) {
                this.props.loadMainObject(unit, museumId, collectionId, {
                  onSuccess: (children) => {
                    children.forEach(child => this.props.addObject(child, rootNode.breadcrumb));
                  }
                });
              } else {
                this.props.addObject(unit, rootNode.breadcrumb);
              }
            }}
          />
          {this.props.totalObjects > 0 &&
            <PagingToolbar
              numItems={this.props.totalObjects}
              currentPage={this.getCurrentPage() || 1}
              perPage={Config.magasin.limit}
              onClick={(currentPage) => {
                hashHistory.replace({
                  pathname: `/magasin/${this.props.rootNode.id}/objects`,
                  state: {
                    currentPage
                  }
                });
              }}
            />
          }
        </div>
      );
    }
    return (
      <div>
        <NodeGrid
          tableData={filter(nodes, ['name'], searchPattern)}
          onShowEvents={unit => hashHistory.push(`/magasin/${unit.id}/events`)}
          onPickNode={unit => this.props.addNode(unit, rootNode.breadcrumb)}
          onMoveNode={moveNode}
          onClick={(row) => hashHistory.push(`/magasin/${row.id}`)}
        />
        {this.props.totalNodes > 0 &&
          <PagingToolbar
            numItems={this.props.totalNodes}
            currentPage={this.getCurrentPage() || 1}
            perPage={Config.magasin.limit}
            onClick={(currentPage) => {
              hashHistory.replace({
                pathname: `/magasin/${this.props.rootNode.id}`,
                state: {
                  currentPage
                }
              });
            }}
          />
        }
      </div>
    );
  }

  render() {
    return (
      <Layout
        title={'Magasin'}
        breadcrumb={<Breadcrumb node={this.props.rootNode} onClickCrumb={this.onClickCrumb} />}
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContentGrid()}
      />
    );
  }
}