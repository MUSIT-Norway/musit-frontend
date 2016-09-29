import React from 'react'
import { connect } from 'react-redux';
import Language from '../../../components/language'
import { loadRoot, clearRoot, loadChildren, deleteUnit, loadPath } from '../../../reducers/storageunit/grid'
import { loadMoveHistoryForObject, clearMoveHistoryForObject } from '../../../reducers/grid/move'
import { loadObjects } from '../../../reducers/storageobject/grid'
import { addNode, addObject } from '../../../reducers/picklist'
import { moveObject, moveNode } from '../../../reducers/move'
import { hashHistory } from 'react-router'
import { NodeGrid, ObjectGrid } from '../../../components/grid'
import Layout from '../../../layout'
import NodeLeftMenuComponent from '../../../components/leftmenu/node'
import Toolbar from '../../../layout/Toolbar'
import { blur } from '../../../util'
import Breadcrumb from '../../../layout/Breadcrumb'
import MusitModal from '../../../components/formfields/musitModal'
import MusitModalHistory from '../../../components/formfields/musitModalHistory'
const I18n = require('react-i18nify').I18n;

const mapStateToProps = (state) => ({
  user: state.auth.actor,
  translate: (key, markdown) => Language.translate(key, markdown),
  children: state.storageGridUnit.data || [],
  objects: state.storageObjectGrid.data || [],
  rootNode: state.storageGridUnit.root,
  path: state.storageGridUnit.root.path,
  routerState: state.routing,
  moves: state.movehistory.data || []
})

const mapDispatchToProps = (dispatch, props) => {
  const { history } = props

  return ({
    loadRoot: (id) => {
      dispatch(loadRoot(id))
    },
    loadStorageUnits: () => {
      dispatch(clearRoot())
      dispatch(loadRoot())
    },
    loadStorageObjects: (id) => {
      dispatch(loadObjects(id))
    },
    loadChildren: (id, callback) => {
      dispatch(loadChildren(id, callback))
      dispatch(loadRoot(id))
    },
    loadPath: (id) => {
      dispatch(loadPath(id))
    },
    loadMoveHistoryForObject: (objectId) => {
      dispatch(loadMoveHistoryForObject(objectId))
    },
    clearMoveHistoryForObject: (objectId) => {
      dispatch(clearMoveHistoryForObject(objectId))
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
          dispatch(addNode(unit, path))
          break
        case 'pickObject':
          dispatch(addObject(unit, path))
          break
        case 'controlsobservations':
          history.push(`/magasin/${unit.id}/controlsobservations`)
          break
        case 'observation':
          history.push(`/magasin/${unit.id}/observations`)
          break
        case 'control':
          history.push(`/magasin/${unit.id}/controls`)
          break
        default:
          break
      }
    },
    onEdit: (unit) => { hashHistory.push(`/magasin/${unit.id}/view`) },
    onDelete: (id, currentNode) => { // TODO: Problems with delete slower than callback (async)
      if (id === currentNode.id) {
        const name = currentNode.name
        if (window.confirm(`Vil du virkelig slette node med navn ${name}`)) {
          dispatch(deleteUnit(id, {
            onSuccess: () => {
              dispatch(clearRoot())
              if (currentNode.isPartOf) {
                hashHistory.replace(`/magasin/${currentNode.isPartOf}`)
              } else {
                dispatch(loadRoot())
              }
              window.alert(`Du har slettet noden med navn ${name}`)
            }
          }))
        }
      }
    }
  })
}


@connect(mapStateToProps, mapDispatchToProps)
export default class StorageUnitsContainer extends React.Component {
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
    loadPath: React.PropTypes.func,
    loadMoveHistoryForObject: React.PropTypes.func.isRequired,
    clearMoveHistoryForObject: React.PropTypes.func.isRequired,
    path: React.PropTypes.arrayOf(React.PropTypes.object),
    moves: React.PropTypes.arrayOf(React.PropTypes.object),
    moveObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    user: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    loadRoot: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      showObjects: false,
      showNodes: true,
      showMoveHistory: false,
      showModal: false,
      showModalFromId: '',
      showModalType: ''
    }

    this.loadNodes = this.loadNodes.bind(this)
    this.loadObjects = this.loadObjects.bind(this)
    this.moveModal = this.moveModal.bind(this)
    this.showObjectMoveHistory = this.showObjectMoveHistory.bind(this)
    this.closeMoveHistory = this.closeMoveHistory.bind(this)
  }

  componentWillMount() {
    this.loadNodes();
  }

  componentWillReceiveProps(newProps) {
    // Issued on every propchange, including local route changes
    if (newProps.params.splat !== this.props.params.splat) {
      if (newProps.params.splat) {
        this.props.loadChildren(this.resolveCurrentId(newProps.params.splat), {
          onSuccess: () => this.props.loadPath(this.resolveCurrentId(newProps.params.splat)),
          onFailure: true
        })
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

  showMoveHistory() {
    this.setState({ ...this.state, showMoveHistory: true })
  }

  closeMoveHistory() {
    this.setState({ ...this.state, showMoveHistory: false })
  }

  loadNodes() {
    if (this.props.params.splat) {
      const currentId = this.resolveCurrentId(this.props.params.splat);
      this.props.loadChildren(currentId, {
        onSuccess: () => this.props.loadPath(currentId),
        onFailure: true
      })
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
    const ids = this.resolveId(splat)
    let retVal = null
    if (ids && ids.length > 0) {
      retVal = ids[ids.length - 1]
    }
    return retVal
  }

  resolveId(splat) {
    let splatList = []
    if (splat) {
      splatList = splat.split('/')
    }
    return splatList
  }

  pathChild(splat, id) {
    let newUri = `${id}`
    if (splat) {
      newUri = `${splat}/${id}`
    }
    return newUri
  }

  showModal = (fromId) => {
    this.setState({ ...this.state, showModal: true, showModalFromId: fromId })
  }

  hideModal = () => {
    this.setState({ ...this.state, showModal: false, showModalFromId: '' })
  }

  moveModal = (toId, toName) => {
    this.props.moveNode(this.state.showModalFromId, toId, this.props.user.id, {
      onSuccess: () => {
        const id = this.state.showModalFromId
        this.setState({ ...this.state, showModal: false, showModalFromId: '' })
        this.props.loadPath(id)
        window.alert(I18n.t('musit.moveModal.messages.nodeMoved', { name, destination: toName }))
      },
      onFailure: () => {
        window.alert(I18n.t('musit.moveModal.messages.errorNode', { name, destination: toName }))
      }
    })
  }

  showObjectMoveHistory = (id) => {
    this.props.clearMoveHistoryForObject()
    this.props.loadMoveHistoryForObject(id)
    this.setState({ ...this.state, showMoveHistory: true })
  }

  makeToolbar() {
    return (<Toolbar
      showRight={this.state.showObjects}
      showLeft={this.state.showNodes}
      labelRight="Objekter"
      labelLeft="Noder"
      placeHolderSearch="Filtrer i liste"
      searchValue={this.state.searchPattern}
      onSearchChanged={(newPattern) => this.setState({ ...this.state, searchPattern: newPattern })}
      clickShowRight={() => {
        this.showObjects()
        this.loadObjects();
        blur()
      }}
      clickShowLeft={() => {
        this.showNodes()
        this.loadNodes()
        blur()
      }}
    />)
  }

  makeLeftMenu(rootNode, statistics) {
    const { onEdit, onDelete } = this.props
    const showButtons = (this.props.routerState.locationBeforeTransitions.pathname !== '/magasin/root')
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
          objectsOnNode={statistics ? statistics.objectsOnNode : Number.NaN}
          totalObjectCount={statistics ? statistics.totalObjectCount : Number.NaN}
          underNodeCount={statistics ? statistics.underNodeCount : Number.NaN}
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
      return (<NodeGrid
        id={nodeId}
        translate={this.props.translate}
        tableData={children.filter((row) => row.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)}
        onAction={(action, unit) => this.props.onAction(action, unit, this.props.path)}
        showMoveHistory={this.showNodeMoveHistory}
        onMove={(moveFrom, moveTo, callback) => this.props.moveNode(moveFrom, moveTo, this.props.user.id, callback)}
        refresh={() => {
          this.loadNodes()
          this.props.loadRoot(nodeId)
        }}
        onClick={(row) =>
          hashHistory.push(
            `/magasin/${this.pathChild(this.props.params.splat, row.id)}`
          )
        }
        rootNode={this.props.rootNode}
        MusitModal={MusitModal}
      />)
    }
    return (<ObjectGrid
      id={nodeId}
      translate={this.props.translate}
      tableData={this.props.objects}
      showMoveHistory={this.showObjectMoveHistory}
      onAction={(action, unit) => this.props.onAction(action, unit, this.props.path)}
      onMove={(moveFrom, moveTo, callback) => this.props.moveObject(moveFrom, moveTo, this.props.user.id, callback)}
      refresh={() => {
        this.loadObjects()
        this.props.loadRoot(nodeId)
      }}
      rootNode={this.props.rootNode}
      MusitModal={MusitModal}
    />)
  }

  render() {
    const { searchPattern } = this.state
    const { children, translate, path, moves } = this.props
    const { data: rootNodeData, statistics } = this.props.rootNode
    const breadcrumb = <Breadcrumb nodes={path} onClickCrumb={node => this.onClickCrumb(node)} />
    return (
      <div>
        <MusitModalHistory
          show={this.state.showMoveHistory}
          onClose={this.closeMoveHistory}
          translate={translate}
          moves={moves}
          onHide={this.closeMoveHistory}
          headerText={this.props.translate('musit.moveHistory')}
        />
        <MusitModal
          show={this.state.showModal}
          onHide={this.hideModal}
          onMove={this.moveModal}
          headerText={this.props.translate('musit.moveModal.moveNodes')}
        />
        <Layout
          title={'Magasin'}
          translate={translate}
          breadcrumb={breadcrumb}
          toolbar={this.makeToolbar()}
          leftMenu={this.makeLeftMenu(rootNodeData, statistics)}
          content={this.makeContentGrid(searchPattern, rootNodeData, children)}
        />
      </div>
    )
  }
}
