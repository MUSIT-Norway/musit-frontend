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
import MusitNode from '../../shared/models/node';
import PagingToolbar from '../../shared/paging';
import { emitError, emitSuccess } from '../../shared/errors/emitter';
import { checkNodeBranchAndType } from '../../shared/nodeValidator';

import MusitModal from '../movedialog/MusitModalContainer';
import MusitModalHistory from '../movehistory/MoveHistoryContainer';

import Config from '../../config';
import inject from '../../state/inject';

import {connect} from 'react-redux';
import {addNode, addObject, loadMainObject} from '../picklist/picklistReducer';
import {moveObject as moveObjectAction, moveNode as moveNodeAction} from '../movedialog/moveActions';
import { clear } from './reducers/modal';

import store$, {
  loadNodes$,
  loadStats$,
  loadRootNode$,
  loadObjects$,
  deleteNode$,
  setLoading$,
  clearRootNode$
} from './tableStore';

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
    moveObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    pickObject: React.PropTypes.func.isRequired,
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

  componentWillMount() {
    this.props.clearRootNode();
    this.props.setLoading();
    if (this.props.route.showObjects) {
      this.loadObjects();
      if (this.props.params.id && !this.props.store.rootNode) {
        this.props.loadRootNode({
          nodeId: this.props.params.id,
          museumId: this.props.appSession.getMuseumId(),
          page: this.getCurrentPage(),
          token: this.props.appSession.getAccessToken()
        });
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
      this.props.loadRootNode({nodeId, museumId, token, onComplete: node => {
        if(node && !MusitNode.isRootNode(node.type)) {
          this.props.loadStats({nodeId, museumId, token});
        }
      }});
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
    currentPage = this.getCurrentPage(),
    token = this.props.appSession.getAccessToken()
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
    nodeId = this.props.store.rootNode.id,
    moveNode = this.props.moveNode,
    loadNodes = this.loadNodes
  ) => (toNode, toName, onSuccess) => {
    const errorMessage = checkNodeBranchAndType(nodeToMove, toNode);

    if (!errorMessage) {
      moveNode(nodeToMove.id, toNode.id, userId, museumId, {
        onSuccess: () => {
          onSuccess();
          loadNodes();
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
    showModal(title, <MusitModal appSession={this.props.appSession} onMove={this.moveObject(objectToMove)} />, this.props.clearMoveDialog);
  }

  moveObject = (
    objectToMove,
    userId = this.props.appSession.getActor().getActorId(),
    museumId = this.props.appSession.getMuseumId(),
    collectionId = this.props.appSession.getCollectionId(),
    nodeId = this.props.store.rootNode.id,
    moveObject = this.props.moveObject,
    loadObjects = this.loadObjects
  ) => (toNode, toName, onSuccess) => {
    const description = getObjectDescription(objectToMove);
    moveObject(objectToMove, toNode.id, userId, museumId, collectionId, {
      onSuccess: () => {
        onSuccess();
        loadObjects();
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
          onClickProperties={(id) => {
            hashHistory.push({
              pathname: `/magasin/${id}/view`,
              state: rootNode
            });
          }}
          onClickControlObservations={(id) => hashHistory.push(`/magasin/${id}/controlsobservations`)}
          onClickObservations={(id) => hashHistory.push(`/magasin/${id}/observations`)}
          onClickController={(id) => hashHistory.push(`/magasin/${id}/controls`)}
          onClickMoveNode={moveNode}
          onClickDelete={(nodeId) => {
            const message = I18n.t('musit.leftMenu.node.deleteMessages.askForDeleteConfirmation', {
              name: rootNode.name
            });
            confirm(message, () => {
              deleteNode({nodeId, museumId, token,
                onComplete: () => {
                  if (rootNode.isPartOf) {
                    hashHistory.replace(`/magasin/${rootNode.isPartOf}`);
                  }
                  emitSuccess({
                    type: 'deleteSuccess',
                    message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name: rootNode.name})
                  });
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
              this.props.pickObject(
                object,
                rootNode.breadcrumb,
                museumId,
                collectionId
              )
            }
            pickObjects={(objectArr) =>
              this.props.pickObjects(
                objectArr,
                rootNode.breadcrumb,
                museumId,
                collectionId
              )
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
            this.props.pickNode(
              node,
              rootNode.breadcrumb,
              museumId
            )
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

const pickObject = (dispatch) => (unit, path, museumId, collectionId) => {
  if (unit.isMainObject()) {
    dispatch(loadMainObject(unit, museumId, collectionId, {
      onSuccess: (children) => {
        children.forEach(child => dispatch(addObject(child, path)));
      }
    }));
  } else {
    dispatch(addObject(unit, path));
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    moveObject: (
      objectToMove,
      destinationId,
      doneBy,
      museumId,
      collectionId,
      callback
    ) => {
      if (objectToMove.isMainObject()) {
        dispatch(loadMainObject(objectToMove, museumId, collectionId, {
          onSuccess: (children) => {
            const objectIds = children.map(c => c.id);
            dispatch(moveObjectAction(objectIds, destinationId, doneBy, museumId, callback));
          }
        }));
      } else {
        dispatch(moveObjectAction(objectToMove.id, destinationId, doneBy, museumId, callback));
      }
    },
    moveNode: (nodeId, destinationId, doneBy, museumId, callback) => {
      dispatch(moveNodeAction(nodeId, destinationId, doneBy, museumId, callback));
    },
    pickNode: (unit, path) => dispatch(addNode(unit, path)),
    pickObjects: (unit, path, museumId, collectionId) => {
      unit.forEach(object => {
        pickObject(dispatch)(object, path, museumId, collectionId);
      });
    },
    pickObject: (unit, path, museumId, collectionId) => {
      pickObject(dispatch)(unit, path, museumId, collectionId);
    },
    clearMoveDialog: () => dispatch(clear())
  };
};

const provided = {
  appSession: { type: React.PropTypes.object.isRequired },
  store$
};

const actions = {
  clearRootNode$,
  loadStats$,
  loadRootNode$,
  loadNodes$,
  loadObjects$,
  deleteNode$,
  setLoading$
};

export default connect(null, mapDispatchToProps)(inject(
  provided,
  actions
)(StorageUnitsContainer));
