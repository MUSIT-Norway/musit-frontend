
import React from 'react'
import { connect } from 'react-redux';
import { loadRoot, clearRoot, loadChildren, deleteUnit } from '../../../reducers/storageunit/grid'
import { loadObjects } from '../../../reducers/storageobject/grid'
import { addNode, addObject } from '../../../reducers/picklist'
import { moveObject, moveNode } from '../../../reducers/move'
import { loadStats, clearStats } from '../../../reducers/storageunit/stats'
import { hashHistory } from 'react-router'
import NodeGrid from '../../../components/grid/NodeGrid'
import ObjectGrid from '../../../components/grid/ObjectGrid'
import Layout from '../../../layout'
import NodeLeftMenuComponent from '../../../components/leftmenu/node'
import Toolbar from '../../../layout/Toolbar'
import { blur } from '../../../util'
import Breadcrumb from '../../../layout/Breadcrumb'
import MusitModal from '../../../components/formfields/musitModal'
import { I18n } from 'react-i18nify'
import { emitError, emitSuccess } from '../../../errors/emitter'
import MusitModalHistory from '../../../components/formfields/musitModalHistory/index'

const mapStateToProps = (state) => ({
  user: state.auth.actor,
  stats: state.storageUnitStats.stats,
  translate: (key, markdown) => I18n.t(key, markdown),
  children: state.storageGridUnit.data || [],
  objects: state.storageObjectGrid.data || [],
  rootNode: state.storageGridUnit.root.data,
  routerState: state.routing
});

const mapDispatchToProps = (dispatch, props) => {
  const { history } = props;

  return {
    loadRoot: (id) => {
      dispatch(loadRoot(id));
      dispatch(clearStats());
      dispatch(loadStats(id))
    },
    loadStorageUnits: () => {
      dispatch(clearRoot());
      dispatch(loadRoot());
      dispatch(clearStats())
    },
    loadStorageObjects: (id) => {
      dispatch(loadObjects(id))
    },
    loadChildren: (id, callback) => {
      dispatch(loadChildren(id, callback));
      dispatch(loadRoot(id));
      dispatch(clearStats());
      dispatch(loadStats(id))
    },
    moveObject: (objectId, destinationId, doneBy, callback) => {
      dispatch(moveObject(objectId, destinationId, doneBy, callback))
    },
    moveNode: (nodeId, destinationId, doneBy, callback) => {
      dispatch(moveNode(nodeId, destinationId, doneBy, callback))
    },
    onAction: (actionName, unit, path) => {
      switch (actionName) {
        case 'pickNode':
          dispatch(addNode(unit, path));
          break;
        case 'pickObject':
          dispatch(addObject(unit, path));
          break;
        case 'controlsobservations':
          history.push(`/magasin/${unit.id}/controlsobservations`);
          break;
        case 'observation':
          history.push(`/magasin/${unit.id}/observations`);
          break;
        case 'control':
          history.push(`/magasin/${unit.id}/controls`);
          break;
        default:
          break
      }
    },
    onEdit: (unit) => {
      hashHistory.push(`/magasin/${unit.id}/view`)
    },
    onDelete: (id, currentNode) => { // TODO: Problems with delete slower than callback (async)
      if (id === currentNode.id) {
        const name = currentNode.name;
        if (window.confirm(I18n.t('musit.leftMenu.node.deleteMessages.askForDeleteConfirmation', {name}))) {
          dispatch(deleteUnit(id, {
            onSuccess: () => {
              dispatch(clearRoot());
              if (currentNode.isPartOf) {
                hashHistory.replace(`/magasin/${currentNode.isPartOf}`)
              } else {
                dispatch(loadRoot());
                dispatch(clearStats())
              }
              emitSuccess({ type: 'deleteSuccess', message: I18n.t('musit.leftMenu.node.deleteMessages.confirmDelete', {name})})
            },
            onFailure: (e) => {
              if (e.status === 400) {
                emitError({ type: 'errorOnDelete', message: I18n.t('musit.leftMenu.node.deleteMessages.errorNotAllowedHadChild')} )
              } else {
                emitError({ type: 'errorOnDelete', message: I18n.t('musit.leftMenu.node.deleteMessages.errorCommon')} )
              }
            }
          }))
        }
      }
    }
  }
};

class StorageUnitsContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.object),
    objects: React.PropTypes.arrayOf(React.PropTypes.object),
    rootNode: React.PropTypes.object,
    translate: React.PropTypes.func.isRequired,
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
    loadMoveHistoryForObject: React.PropTypes.func.isRequired,
    clearMoveHistoryForObject: React.PropTypes.func.isRequired,
    moves: React.PropTypes.arrayOf(React.PropTypes.object),
    moveObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    user: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    loadRoot: React.PropTypes.func.isRequired,
    stats: React.PropTypes.shape({
      nodes: React.PropTypes.number,
      objects: React.PropTypes.number,
      totalObjects: React.PropTypes.number
    })
  };

  static contextTypes = {
    showModal: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      searchPattern: '',
      showObjects: false,
      showNodes: true,
      showMoveHistory: false,
      showModal: false,
      showModalFromId: '',
      showModalType: ''
    };

    this.loadNodes = this.loadNodes.bind(this);
    this.loadObjects = this.loadObjects.bind(this);
    this.moveModal = this.moveModal.bind(this);
    this.showObjectMoveHistory = this.showObjectMoveHistory.bind(this);
    this.closeMoveHistory = this.closeMoveHistory.bind(this)
    this.onClickCrumb = this.onClickCrumb.bind(this)
  }

  componentWillMount() {
    this.loadNodes();
  }

  componentWillReceiveProps(newProps) {
    // Issued on every propchange, including local route changes
    if (newProps.params.splat !== this.props.params.splat) {
      if (newProps.params.splat) {
        this.props.loadChildren(this.resolveCurrentId(newProps.params.splat))
      } else {
        this.props.loadStorageUnits()
      }
    }
  }

  onClickCrumb(node) {
    this.showNodes();
    hashHistory.push(node.url)
  }

  showNodes() {
    this.setState({ ...this.state, showNodes: true, showObjects: false })
  }

  showObjects() {
    this.setState({ ...this.state, showNodes: false, showObjects: true })
  }

  closeMoveHistory() {
    this.setState({ ...this.state, showMoveHistory: false })
  }

  loadNodes() {
    if (this.props.params.splat) {
      const currentId = this.resolveCurrentId(this.props.params.splat);
      this.props.loadChildren(currentId)
    } else {
      this.props.loadStorageUnits()
    }
  }

  loadObjects() {
    if (this.props.params.splat) {
      const currentId = this.resolveCurrentId(this.props.params.splat);
      this.props.loadStorageObjects(currentId)
    }
  }

  resolveCurrentId(splat) {
    const ids = this.resolveId(splat);
    let retVal = null;
    if (ids && ids.length > 0) {
      retVal = ids[ids.length - 1]
    }
    return retVal
  }

  resolveId(splat) {
    let splatList = [];
    if (splat) {
      splatList = splat.split('/')
    }
    return splatList
  }

  pathChild(splat, id) {
    let newUri = `${id}`;
    if (splat) {
      newUri = `${splat}/${id}`
    }
    return newUri
  }

  showModal() {
    const title = this.props.translate('musit.moveModal.moveNodes');
    this.context.showModal(title, 700, <MusitModal onMove={this.moveModal} />)
  }

  moveModal = (toId, toName, onSuccess) => {
    this.props.moveNode(this.props.rootNode.id, toId, this.props.user.id, {
      onSuccess: () => {
        onSuccess()
        this.loadNodes();
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodeMoved', { name: this.props.rootNode.name, destination: toName })
        })
      },
      onFailure: () => {
        emitError({
          type: 'errorOnMove',
          message: I18n.t('musit.moveModal.messages.errorNode', { name: this.props.rootNode.name, destination: toName })
        })
      }
    })
  };

  showObjectMoveHistory = (id) => {
    const componentToRender =
      <MusitModalHistory
        objectId={id}
        show={this.state.showMoveHistory}
        onClose={this.closeMoveHistory}
        moves={this.props.moves}
      />
    const title = this.props.translate('musit.moveHistory.title');
    this.context.showModal(title, 700, componentToRender)
  }

  makeToolbar() {
    return <Toolbar
      showRight={this.state.showObjects}
      showLeft={this.state.showNodes}
      labelRight="Objekter"
      labelLeft="Noder"
      placeHolderSearch="Filtrer i liste"
      searchValue={this.state.searchPattern}
      onSearchChanged={(newPattern) => this.setState({ ...this.state, searchPattern: newPattern })}
      clickShowRight={() => {
        this.showObjects();
        this.loadObjects();
        blur()
      }}
      clickShowLeft={() => {
        this.showNodes();
        this.loadNodes();
        blur()
      }}
    />
  }

  makeLeftMenu(rootNode, statistics) {
    const { onEdit, onDelete } = this.props;
    const showButtons = this.props.routerState.locationBeforeTransitions.pathname !== '/magasin/root';
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
          id={rootNode ? rootNode.id : null}
          showButtons={showButtons}
          translate={this.props.translate}
          onClickNewNode={(parentId) => {
            if (parentId) {
              hashHistory.push(`/magasin/${parentId}/add`)
            } else {
              hashHistory.push('/magasin/add')
            }
          }}
          objectsOnNode={statistics ? statistics.numObjects : Number.NaN}
          totalObjectCount={statistics ? statistics.totalObjects : Number.NaN}
          underNodeCount={statistics ? statistics.numNodes : Number.NaN}
          onClickProperties={(id) => onEdit({ id })}
          onClickControlObservations={(id) => hashHistory.push(`/magasin/${id}/controlsobservations`)}
          onClickObservations={(id) => hashHistory.push(`/magasin/${id}/observations`)}
          onClickController={(id) => hashHistory.push(`/magasin/${id}/controls`)}
          onClickMoveNode={() => this.showModal(rootNode.id)}
          onClickDelete={(id) => onDelete(id, rootNode)}
        />
      </div>
    )
  }

  makeContentGrid(filter, rootNode, children) {
    const nodeId = rootNode ? rootNode.id : null;
    if (this.state.showNodes) {
      return <NodeGrid
        id={nodeId}
        translate={this.props.translate}
        tableData={children.filter((row) => row.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)}
        onAction={(action, unit) => this.props.onAction(action, unit, this.props.rootNode.path)}
        onMove={(moveFrom, moveTo, callback) => this.props.moveNode(moveFrom, moveTo, this.props.user.id, callback)}
        refresh={() => {
          this.loadNodes();
          this.props.loadRoot(nodeId)
        }}
        onClick={(row) =>
          hashHistory.push(
            `/magasin/${this.pathChild(this.props.params.splat, row.id)}`
          )
        }
        rootNode={this.props.rootNode}
      />
    }
    return <ObjectGrid
      id={nodeId}
      translate={this.props.translate}
      tableData={this.props.objects}
      showMoveHistory={this.showObjectMoveHistory}
      onAction={(action, unit) => this.props.onAction(action, unit, this.props.rootNode.path)}
      onMove={(moveFrom, moveTo, callback) => this.props.moveObject(moveFrom, moveTo, this.props.user.id, callback)}
      refresh={() => {
        this.loadObjects();
        this.props.loadRoot(nodeId)
      }}
      rootNode={this.props.rootNode}
    />
  }

  render() {
    const { searchPattern } = this.state;
    const { children, translate, rootNode } = this.props;
    return (
      <div>
        <Layout
          title={'Magasin'}
          translate={translate}
          breadcrumb={<Breadcrumb node={rootNode} onClickCrumb={this.onClickCrumb} />}
          toolbar={this.makeToolbar()}
          leftMenu={this.makeLeftMenu(rootNode, this.props.stats)}
          content={this.makeContentGrid(searchPattern, rootNode, children)}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageUnitsContainer)
