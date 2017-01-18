import React from 'react';
import { hashHistory } from 'react-router';
import NodeGrid from './NodeGridTable';
import ObjectGrid from './ObjectGridTable';
import Layout from '../../components/layout';
import NodeLeftMenuComponent from './NodeGridLeftMenu';
import Toolbar from '../../components/layout/Toolbar';
import { blur, filter } from '../../shared/util';
import Breadcrumb from '../../components/layout/Breadcrumb';
import MusitModal from '../movedialog/MusitModalContainer';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../shared/errors/emitter';
import MusitModalHistory from '../movehistory/MoveHistoryContainer';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';
import MusitNode from '../../shared/models/node';
import PagingToolbar from '../../shared/paging';
import Config from '../../config';
import Loader from 'react-loader';
import inject from '../../state/inject';
import nodes$, {
  loadChildren$,
  loadStats$,
  loadNode$,
  init$
} from './nodeGridStore';

const getObjectDescription = (object) => {
  let objStr = object.museumNo ? `${object.museumNo}` : '';
  objStr = object.subNo ? `${objStr} - ${object.subNo}` : objStr;
  objStr = object.term ? `${objStr} - ${object.term}` : objStr;
  return objStr;
};

export class StorageUnitsContainer extends React.Component {
  static propTypes = {
    nodes: React.PropTypes.object,
    objects: React.PropTypes.arrayOf(React.PropTypes.object),
    rootNode: React.PropTypes.object,
    onDelete: React.PropTypes.func,
    onAction: React.PropTypes.func,
    props: React.PropTypes.object,
    params: React.PropTypes.object,
    history: React.PropTypes.object,
    routerState: React.PropTypes.object,
    loadChildren: React.PropTypes.func,
    moves: React.PropTypes.arrayOf(React.PropTypes.object),
    moveObject: React.PropTypes.func,
    moveNode: React.PropTypes.func,
    clearMoveDialog: React.PropTypes.func,
    user: React.PropTypes.object,
    loadRoot: React.PropTypes.func,
    stats: React.PropTypes.shape({
      numNodes: React.PropTypes.number,
      numObjects: React.PropTypes.number,
      totalObjects: React.PropTypes.number
    })
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

  componentWillMount() {
    if (this.props.route.showObjects) {
      this.loadObjects();
      if (this.props.params.id && !this.props.rootNode.id) {
        this.props.loadRoot(this.props.params.id, this.props.appSession.getMuseumId(), this.getCurrentPage());
      }
    } else {
      this.loadNodes();
    }
  }

  componentWillReceiveProps(newProps) {
    const museumHasChanged = newProps.appSession.getMuseumId() !== this.props.appSession.getMuseumId();
    const museumId = museumHasChanged ? newProps.appSession.getMuseumId() : this.props.appSession.getMuseumId();
    const nodeId = museumHasChanged ? null : newProps.params.id;
    const locationState = newProps.location.state;
    const idHasChanged = newProps.params.id !== this.props.params.id;
    const stateHasChanged = locationState !== this.props.location.state;
    const token = this.props.appSession.getAccessToken();
    if (idHasChanged || museumHasChanged || stateHasChanged) {
      const currentPage = this.getCurrentPage(locationState);
      if (newProps.route.showObjects) {
        this.loadObjects(currentPage);
      } else {
        this.props.init();
        if (nodeId) {
          this.props.loadNode({nodeId, museumId, token});
          this.props.loadStats({nodeId, museumId, token});
        }
        this.props.loadChildren({nodeId, museumId, currentPage, token});
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
    const nodeId = this.props.params.id;
    const museumId = this.props.appSession.getMuseumId();
    const token = this.props.appSession.getAccessToken();
    this.props.init();
    if (nodeId) {
      this.props.loadNode({nodeId, museumId, token});
      this.props.loadStats({nodeId, museumId, token});
    }
    this.props.loadChildren({
      nodeId,
      museumId,
      page: this.getCurrentPage(),
      token
    });
  }

  loadObjects(
    currentPage = this.getCurrentPage()
  ) {
    if (this.props.params.id) {
      this.props.loadStorageObjects(
        this.props.params.id,
        this.props.appSession.getMuseumId(),
        this.props.appSession.getCollectionId(),
        currentPage
      );
    }
  }

  showMoveNodeModal(
    nodeToMove,
    showModal = this.context.showModal
  ) {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    showModal(title, <MusitModal onMove={this.moveNode(nodeToMove)} />, this.props.clearMoveDialog);
  }

  moveNode = (
    nodeToMove,
    userId = this.props.appSession.getActor().getActorId(),
    museumId = this.props.appSession.getMuseumId(),
    nodeId = this.props.nodes.node.id,
    moveNode = this.props.moveNode,
    loadRoot = this.props.loadRoot,
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
    const objStr = getObjectDescription(objectToMove);
    const title = I18n.t('musit.moveModal.moveObject', { name: objStr });
    showModal(title, <MusitModal onMove={this.moveObject(objectToMove)} />, this.props.clearMoveDialog);
  }

  moveObject = (
    objectToMove,
    userId = this.props.user.actor.getActorId(),
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    nodeId = this.props.nodes.node.id,
    moveObject = this.props.moveObject,
    loadRoot = this.props.loadRoot,
    loadObjects = this.loadObjects
  ) => (toNode, toName, onSuccess) => {
    const description = getObjectDescription(objectToMove);
    moveObject(objectToMove, toNode.id, userId, museumId, collectionId, {
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
    });
  };

  showObjectMoveHistory(
    objectToShowHistoryFor,
    showModal = this.context.showModal
  ) {
    const objStr = getObjectDescription(objectToShowHistoryFor);
    const componentToRender = <MusitModalHistory objectId={objectToShowHistoryFor.id} />;
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
    museumId = this.props.appSession.getCollectionId(),
    rootNode = this.props.nodes.node,
    stats = this.props.nodes.stats,
    onDelete = this.props.onDelete,
    moveNode = this.showMoveNodeModal,
    confirm = this.context.showConfirm
  ) {
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
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
          onClickControlObservations={(id) => hashHistory.push(`/magasin/${id}/controlsobservations`)}
          onClickObservations={(id) => hashHistory.push(`/magasin/${id}/observations`)}
          onClickController={(id) => hashHistory.push(`/magasin/${id}/controls`)}
          onClickMoveNode={moveNode}
          onClickDelete={(id) => {
            const message = I18n.t('musit.leftMenu.node.deleteMessages.askForDeleteConfirmation', {
              name: rootNode.name
            });
            confirm(message, () => onDelete(id, museumId, rootNode));
          }}
        />
      </div>
    );
  }

  makeContentGrid(
    searchPattern = this.state.searchPattern,
    rootNode = this.props.nodes.node,
    nodes = this.props.nodes,
    objects = this.props.objects,
    showObjects = this.props.route.showObjects,
    onAction = this.props.onAction,
    moveNode = this.showMoveNodeModal,
    moveObject = this.showMoveObjectModal,
    showHistory = this.showObjectMoveHistory
  ) {
    if (showObjects) {
      return (
        <Loader loaded={!this.props.loadingObjects}>
          <ObjectGrid
            tableData={objects ? filter(objects, ['museumNo', 'subNo', 'term'], searchPattern) : []}
            showMoveHistory={showHistory}
            onAction={(action, unit) =>
              onAction(
                action,
                unit,
                rootNode.breadcrumb,
                this.props.appSession.getMuseumId(),
                this.props.appSession.getCollectionId()
              )
            }
            onMove={moveObject}
          />
          {this.props.totalObjects > 0 &&
            <PagingToolbar
              numItems={this.props.totalObjects}
              currentPage={this.getCurrentPage() || 1}
              perPage={Config.magasin.limit}
              onClick={(currentPage) => {
                hashHistory.replace({
                  pathname: `/magasin/${this.props.nodes.node.id}/objects`,
                  state: {
                    currentPage
                  }
                });
              }}
            />
          }
        </Loader>
      );
    }
    const nodeData = nodes && ((Array.isArray(nodes.data) && nodes.data) || (nodes.data && nodes.data.matches));
    return (
      <Loader loaded={!this.props.nodes.loading}>
        <NodeGrid
          tableData={nodeData ? filter(nodeData, ['name'], searchPattern) : []}
          onAction={(action, unit) =>
            onAction(
              action,
              unit,
              rootNode.breadcrumb,
              this.props.appSession.getMuseumId(),
              this.props.appSession.getCollectionId()
            )
          }
          onMove={moveNode}
          onClick={(row) => {
            hashHistory.push(`/magasin/${row.id}`);
          }}
        />
        {this.props.totalNodes > 0 &&
          <PagingToolbar
            numItems={this.props.totalNodes}
            currentPage={this.getCurrentPage() || 1}
            perPage={Config.magasin.limit}
            onClick={(currentPage) => {
              hashHistory.replace({
                pathname: `/magasin/${this.props.nodes.node.id}`,
                state: {
                  currentPage
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
        breadcrumb={<Breadcrumb node={this.props.nodes.node} onClickCrumb={this.onClickCrumb} />}
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContentGrid()}
      />
    );
  }
}

export default inject({
  provided: { appSession: { type: React.PropTypes.object.isRequired } },
  state: { nodes$ },
  actions: { loadChildren$, loadStats$, loadNode$, init$ }
})(StorageUnitsContainer);
