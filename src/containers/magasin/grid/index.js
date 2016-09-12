import React from 'react'
import { connect } from 'react-redux';
import Language from '../../../components/language'
import { loadRoot, clearRoot, loadChildren, deleteUnit, loadPath } from '../../../reducers/storageunit/grid'
import { add } from '../../../reducers/picklist'
import { hashHistory } from 'react-router'
import { NodeGrid, ObjectGrid } from '../../../components/grid'
import Layout from '../../../layout'
import NodeLeftMenuComponent from '../../../components/leftmenu/node'
import Toolbar from '../../../layout/Toolbar'
import { blur } from '../../../util'
import Breadcrumb from '../../../layout/Breadcrumb'

const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  children: state.storageGridUnit.data || [],
  rootNode: state.storageGridUnit.root,
  path: state.storageGridUnit.root.path ?
    state.storageGridUnit.root.path.map((s) => {
      return {
        id: s.id, name: s.name, type: s.type, url: `/magasin/${s.id}` } }) :
    null,
  routerState: state.routing
})

const mapDispatchToProps = (dispatch, props) => {
  const { history } = props

  return ({
    loadStorageUnits: () => {
      dispatch(clearRoot())
      dispatch(loadRoot())
    },
    loadChildren: (id, callback) => {
      dispatch(loadChildren(id, callback))
      dispatch(loadRoot(id))
    },
    loadPath: (id) => {
      dispatch(loadPath(id))
    },
    onAction: (actionName, unit) => {
      switch (actionName) {
        case 'pick':
          dispatch(add('default', unit))
          break
        case 'observation':
          history.push(`/magasin/${unit.id}/observations`)
          break
        case 'control':
          history.push(`/magasin/${unit.id}/controls`)
          break
        case 'move':
          /* TODO: Add move route or action */
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
    rootNode: React.PropTypes.object,
    translate: React.PropTypes.func.isRequired,
    loadStorageUnits: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onAction: React.PropTypes.func.isRequired,
    props: React.PropTypes.object,
    params: React.PropTypes.object,
    history: React.PropTypes.object,
    routerState: React.PropTypes.object,
    loadChildren: React.PropTypes.func,
    loadPath: React.PropTypes.func,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  constructor(props) {
    super(props)
    this.state = {
      searchPattern: '',
      showObjects: false,
      showNodes: true,
      showDeleteModal: false
    }
  }

  componentWillMount() {
    // Issued on initial render of the component
    if (this.props.params.splat) {
      this.props.loadChildren(this.resolveCurrentId(this.props.params.splat), {
        onSuccess: () => this.props.loadPath(this.resolveCurrentId(this.props.params.splat)),
        onFailure: true
      })
    } else {
      this.props.loadStorageUnits()
    }
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
        this.setState({ ...this.state, showObjects: true, showNodes: false })
        blur()
      }}
      clickShowLeft={() => {
        this.setState({ ...this.state, showObjects: false, showNodes: true })
        blur()
      }}
    />)
  }

  makeLeftMenu(rootNode, statistics) {
    const { onEdit, onDelete, history } = this.props
    const showButtons = (this.props.routerState.locationBeforeTransitions.pathname !== '/magasin/root')
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
          id={rootNode ? rootNode.id : 0}
          showButtons={showButtons}
          translate={this.props.translate}
          onClickNewNode={(parentId) => {
            if (parentId) {
              history.push(`/magasin/${parentId}/add?t=${new Date().getTime()}`)
            } else {
              history.push('/magasin/add')
            }
          }}
          objectsOnNode={statistics ? statistics.objectsOnNode : Number.NaN}
          totalObjectCount={statistics ? statistics.totalObjectCount : Number.NaN}
          underNodeCount={statistics ? statistics.underNodeCount : Number.NaN}
          onClickProperties={(id) => onEdit({ id })}
          onClickControlObservations={(id) => history.push(`/magasin/${id}/controlsobservations`)}
          onClickObservations={(id) => history.push(`/magasin/${id}/observations`)}
          onClickController={(id) => history.push(`/magasin/${id}/controls`)}
          onClickMoveNode={(id) => id/* TODO: Add move action for rootnode*/}
          onClickDelete={(id) => onDelete(id, rootNode)}
        />
      </div>
    )
  }

  makeContentGrid(filter, rootNode, children) {
    if (this.state.showNodes) {
      return (<NodeGrid
        id={rootNode ? rootNode.id : null}
        translate={this.props.translate}
        tableData={children.filter((row) => row.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)}
        onAction={this.props.onAction}
        onClick={(row) =>
            this.props.history.push(
                `/magasin/${this.pathChild(this.props.params.splat, row.id)}`
            )
        }
      />)
    }
    return (<ObjectGrid
      id={rootNode ? rootNode.id : 0}
      translate={this.props.translate}
      tableData={[]}
    />)
  }


  makeBreadcrumb(n, nt) {
    return (<Breadcrumb nodes={n} nodeTypes={nt} onClickCrumb={(node) => this.props.history.push(node.url)} />)
  }

  render() {
    const { searchPattern } = this.state
    const { children, translate, path } = this.props
    const { data: rootNodeData, statistics } = this.props.rootNode
    const nodes = path
    const nodeTypes = [{ type: 'Building', iconName: 'folder' },
                       { type: 'Room', iconName: 'folder' },
                       { type: 'StorageUnit', iconName: 'folder' }]
    const breadcrumb = nodes ? this.makeBreadcrumb(nodes, nodeTypes) : null
    return (
      <Layout
        title={"Magasin"}
        translate={translate}
        breadcrumb={breadcrumb}
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu(rootNodeData, statistics)}
        content={this.makeContentGrid(searchPattern, rootNodeData, children)}
      />
    )
  }
}
