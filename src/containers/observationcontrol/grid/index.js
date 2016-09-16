

/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import React from 'react'
import { ObservationControlGrid } from '../../../components/grid'
import ObservationControlComponent from '../../../components/leftmenu/observationcontrol'
import Language from '../../../components/language'
import { loadControlsForNode, loadControlsAndObservationsForNode,
  loadObservationsForNode, loadActor } from '../../../reducers/grid/observationcontrol'
import Layout from '../../../layout'
import { loadPath } from '../../../reducers/storageunit/grid/index'
import Breadcrumb from '../../../layout/Breadcrumb'
import { connect } from 'react-redux'
import Toolbar from '../../../layout/Toolbar'
import { hashHistory } from 'react-router'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    path: state.storageGridUnit.root.path ?
      state.storageGridUnit.root.path.map((s) => {
        return {
          id: s.id, name: s.name, type: s.storageType, url: `/magasin/${s.id}` } }) :
      null,
    observationControlGridData: state.observationControlGrid.data
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadControls: (id, callback) => {
    dispatch(loadControlsForNode(id, callback))
  },
  loadObservations: (id, callback) => {
    dispatch(loadObservationsForNode(id, callback))
  },
  loadControlAndObservations: (id, callback) => {
    dispatch(loadControlsAndObservationsForNode(id, callback))
  },
  loadActorDetails: (data) => {
    dispatch(loadActor(data))
  },
  loadPath: (id, callback) => {
    dispatch(loadPath(id, callback))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
export default class ObservationControlGridShow extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    observationControlGridData: React.PropTypes.arrayOf(React.PropTypes.object),
    params: React.PropTypes.object,
    route: React.PropTypes.object,
    loadControls: React.PropTypes.func.isRequired,
    loadActorDetails: React.PropTypes.func.isRequired,
    loadPath: React.PropTypes.func.isRequired,
    loadObservations: React.PropTypes.func.isRequired,
    loadControlAndObservations: React.PropTypes.func.isRequired,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  constructor(props) {
    super(props)
    this.props.params.id = this.props.params.id * 1
    this.state = {
      showObservations: this.props.route.showObservations,
      showControls: this.props.route.showControls
    }
  }

  componentWillMount() {
    this.props.loadControlAndObservations(this.props.params.id, {
      onSuccess: (result) => {
        this.props.loadActorDetails({ data: result.filter((r) => r.doneBy).map((r) => r.doneBy) })
        this.props.loadPath(this.props.params.id)
      },
      onFailure: () => true
    })
  }

  makeToolbar() {
    return (<Toolbar
      showRight={this.state.showControls}
      showLeft={this.state.showObservations}
      labelRight="Kontroller"
      labelLeft="Observasjoner"
      placeHolderSearch="Filtrer i liste"
      clickShowRight={() => { this.setState({ ...this.state, showControls: !this.state.showControls }) }}
      clickShowLeft={() => { this.setState({ ...this.state, showObservations: !this.state.showObservations }) }}
    />)
  }

  makeLeftMenu() {
    return (<div style={{ paddingTop: 10 }}>
      <ObservationControlComponent
        id={this.props.params.id}
        translate={this.props.translate}
        selectObservation
        selectControl
        onClickNewObservation={() => hashHistory.push(`/magasin/${this.props.params.id}/observation/add`)}
        onClickNewControl={() => hashHistory.push(`/magasin/${this.props.params.id}/control/add`)}
      />
    </div>)
  }

  makeContent() {
    return (<ObservationControlGrid
      id={this.props.params.id}
      translate={this.props.translate}
      tableData={this.props.observationControlGridData.filter((e) => {
        if (e.eventType && this.state.showControls && this.state.showObservations) {
          return true
        } else if (e.eventType && this.state.showControls) {
          return e.eventType.toLowerCase() === 'control'
        } else if (e.eventType && this.state.showObservations) {
          return e.eventType.toLowerCase() === 'observation'
        }
        return false
      })}
    />)
  }

  makeBreadcrumb(n, nt) {
    return (<Breadcrumb nodes={n} nodeTypes={nt} allActive onClickCrumb={(node) => hashHistory.push(node.url)} />)
  }

  render() {
    const nodes = this.props.path
    const nodeTypes = [{ type: 'Building', iconName: 'folder' },
                       { type: 'Room', iconName: 'folder' },
                       { type: 'StorageUnit', iconName: 'folder' }]
    const breadcrumb = nodes ? this.makeBreadcrumb(nodes, nodeTypes) : null
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContent()}
      />
    )
  }
}
