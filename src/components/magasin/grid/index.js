import React from 'react';
import { hashHistory } from 'react-router';
import NodeGrid from './NodeGrid';
import ObjectGrid from './ObjectGrid';
import Layout from '../../../layout';
import NodeLeftMenuComponent from './LeftMenu';
import Toolbar from '../../../layout/Toolbar';
import { blur, filter } from '../../../util';
import Breadcrumb from '../../../layout/Breadcrumb';
import MusitModal from '../../movedialog';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../../errors/emitter';
import MusitModalHistory from '../../movehistory';
import { checkNodeBranchAndType } from '../../../util/nodeValidator';
import MusitNode from '../../../models/node';
import PagingToolbar from '../../../util/paging';
import Config from '../../../config';

const getObjectDescription = (object) => {
  let objStr = object.museumNo ? `${object.museumNo}` : '';
  objStr = object.subNo ? `${objStr} - ${object.subNo}` : objStr;
  objStr = object.term ? `${objStr} - ${object.term}` : objStr;
  return objStr;
};

export default class StorageUnitsContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.object),
    objects: React.PropTypes.arrayOf(React.PropTypes.object),
    rootNode: React.PropTypes.object,
    loadStorageUnits: React.PropTypes.func.isRequired,
    loadStorageObjects: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onAction: React.PropTypes.func.isRequired,
    props: React.PropTypes.object,
    params: React.PropTypes.object,
    history: React.PropTypes.object,
    routerState: React.PropTypes.object,
    loadChildren: React.PropTypes.func,
    moves: React.PropTypes.arrayOf(React.PropTypes.object),
    moveObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    clearMoveDialog: React.PropTypes.func.isRequired,
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

  componentWillMount() {
    if (this.props.route.showObjects) {
      this.loadObjects();
      if (this.props.params.id && !this.props.rootNode.id) {
        this.props.loadRoot(this.props.params.id, this.props.user.museumId, this.getCurrentPage());
      }
    } else {
      this.loadNodes();
    }
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
        this.props.loadChildren(nodeId, museumId, currentPage);
      } else {
        this.props.loadStorageUnits(museumId, currentPage);
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
      this.props.loadChildren(this.props.params.id, this.props.user.museumId, this.getCurrentPage());
    } else {
      this.props.loadStorageUnits(this.props.user.museumId, this.getCurrentPage());
    }
  }

  loadObjects(
    currentPage = this.getCurrentPage()
  ) {
    if (this.props.params.id) {
      this.props.loadStorageObjects(this.props.params.id, this.props.user.museumId, this.props.user.collectionId, currentPage);
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
    userId = this.props.user.actor.getActorId(),
    museumId = this.props.user.museumId,
    nodeId = this.props.rootNode.id,
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
    museumId = this.props.user.museumId,
    nodeId = this.props.rootNode.id,
    moveObject = this.props.moveObject,
    loadRoot = this.props.loadRoot,
    loadObjects = this.loadObjects
  ) => (toNode, toName, onSuccess) => {
    const description = getObjectDescription(objectToMove);
    moveObject(objectToMove.id, toNode.id, userId, museumId, {
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
    onEdit = this.props.onEdit,
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
          onClickProperties={(id) => onEdit({ id })}
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
    rootNode = this.props.rootNode,
    children = this.props.children,
    objects = this.props.objects,
    showObjects = this.props.route.showObjects,
    onAction = this.props.onAction,
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
            onAction={(action, unit) =>
              onAction(
                action,
                unit,
                rootNode.breadcrumb,
                this.props.user.museumId,
                this.props.user.collectionId
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
          tableData={filter(children, ['name'], searchPattern)}
          onAction={(action, unit) =>
            onAction(
              action,
              unit,
              rootNode.breadcrumb,
              this.props.user.museumId,
              this.props.user.collectionId
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