
import React from 'react'
import { connect } from 'react-redux';
import Language from '../../components/language'
import { loadRoot, clearRoot, loadChildren, loadPath } from '../../reducers/storageunit/grid'
// import { loadObjects } from '../../reducers/storageobject/grid'
import { add } from '../../reducers/picklist'
import { hashHistory } from 'react-router'
import { NodeGrid } from '../../components/grid'
// import Breadcrumb from '../../layout/Breadcrumb'
import MusitModal from '../../components/formfields'
const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  children: state.storageUnitModal.data || [],
  // objects: state.storageObjectGrid.data || [],
  rootNode: state.storageUnitModal.root,
  path: state.storageUnitModal.root.path,
  routerState: state.routing
})

const mapDispatchToProps = (dispatch, props) => {
  const { history } = props

  return ({
    loadStorageUnits: () => {
      dispatch(clearRoot())
      dispatch(loadRoot())
    },
  //  loadStorageObjects: (id) => {
  //    dispatch(loadObjects(id))
  //  },
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
        case 'controlsobservations':
          history.push(`/magasin/${unit.id}/controlsobservations`)
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
  })
}


@connect(mapStateToProps, mapDispatchToProps)
export default class StoringUnitModal extends React.Component {
  static propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.object),
    // objects: React.PropTypes.arrayOf(React.PropTypes.object),
    rootNode: React.PropTypes.object,
    translate: React.PropTypes.func,
    loadStorageUnits: React.PropTypes.func,
    // loadStorageObjects: React.PropTypes.func.isRequired,
    onAction: React.PropTypes.func,
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
      showDeleteModal: false,
      showModal: true,
    }
  }

  componentWillMount() {
    this.loadNodes();
  }

/*
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
*/
  onClickCrumb(node) {
    this.showNodes();
    hashHistory.push(node.url)
  }

  showNodes() {
    this.setState({ ...this.state, showNodes: true, showObjects: false })
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

  showModal= () => {
    this.setState({ ...this.state, showModal: true })
  }

  randerModal(a, b) {
    const lv = (this.state.showModal ?
      <MusitModal
        valueHeader="Hi"
        valueBody={b}
        valueFooter={a}
        show={this.state.showModal}
        onHide={this.hideModal}
      />
      : '')
    return lv
  }

  hideModal= () => {
    this.setState({ ...this.state, showModal: false })
  }

  makeContentGrid(filter, rootNode, children) {
    return (<NodeGrid
      id={rootNode ? rootNode.id : null}
      translate={this.props.translate}
      tableData={children.filter((row) => row.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)}
      onAction={this.props.onAction}
      onClick={(row) =>
        hashHistory.push(
          `/magasin/${this.pathChild(this.props.params.splat, row.id)}`
        )
      }
    />)
  }

  render() {
    return (
      <span>
        <MusitModal
          valueHeader="Hi"
          valueBody="dfsdf"
          valueFooter="dfsdfsd"
          show={this.state.showModal}
          onHide={this.hideModal}
        />
      </span>
    )
  }
}
