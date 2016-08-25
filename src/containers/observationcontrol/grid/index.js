

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
import { loadControlsForNode, loadObservationsForNode } from '../../../reducers/grid/observationcontrol'
import Layout from '../../../layout'
import { blur } from '../../../util'
import { connect } from 'react-redux'
import Toolbar from '../../../layout/Toolbar'
import { hashHistory } from 'react-router'

const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  unit: state.storageGridUnit.root.data,
  observationControlGridData: state.observationControlGrid.data.map((e) => {
    if (e.eventType === 'Control') {
      return { ...e,
                 type: e.eventType,
                 types: e['subEvents-parts'] ? e['subEvents-parts'].reduce((p, c) => {
                   switch (c.eventType) {
                     case 'ControlLightingCondition': return { ...p, ControlLightingCondition: true }
                     case 'ControlTemperature': return { ...p, ControlTemperature: true }
                     case 'ControlWaterDamageAssessment': return { ...p, ControlWaterDamageAssessment: true }
                     case 'ControlHypoxicAir': return { ControlHypoxicAir: true }
                     case 'ControlRelativeHumidity': return { ...p, ControlRelativeHumidity: true }
                     case 'ControlCleaning': return { ...p, ControlCleaning: true }
                     case 'ControlMold': return { ...p, ControlMold: true }
                     case 'ControlPest': return { ...p, ControlPest: true }
                     case 'ControlAlcohol': return { ...p, ControlAlcohol: true }
                     case 'ControlFireProtection': return { ...p, ControlFireProtection: true }
                     case 'ControlTheftProtection': return { ...p, ControlTheftProtection: true }
                     case 'ControlPerimetersecurity': return { ...p, ControlPerimetersecurity: true }
                     case 'ControlGas': return { ControlGas: true }
                     default: return null
                   } }, {}) : [] }
    }
    return { ...e,
              type: e.eventType,
              types: e['subEvents-parts'] ? e['subEvents-parts'].reduce((p, c) => {
                switch (c.eventType) {
                  case 'ObservationLightingCondition': return { ...p, ControlLightingCondition: true }
                  case 'ObservationTemperature': return { ...p, ControlTemperature: true }
                  case 'ObservationWaterDamageAssessment': return { ...p, ControlWaterDamageAssessment: true }
                  case 'ObservationHypoxicAir': return { ControlHypoxicAir: true }
                  case 'ObservationRelativeHumidity': return { ...p, ControlRelativeHumidity: true }
                  case 'ObservationCleaning': return { ...p, ControlCleaning: true }
                  case 'ObservationMold': return { ...p, ControlMold: true }
                  case 'ObservationPest': return { ...p, ControlPest: true }
                  case 'ObservationAlcohol': return { ...p, ControlAlcohol: true }
                  case 'ObservationFireProtection': return { ...p, ControlFireProtection: true }
                  case 'ObservationTheftProtection': return { ...p, ControlTheftProtection: true }
                  case 'ObservationPerimeterSecurity': return { ...p, ControlPerimetersecurity: true }
                  case 'ObservationGas': return { ControlGas: true }
                  default: return null
                } }, {}) : [] } })
})

const mapDispatchToProps = (dispatch) => ({
  loadControls: (id) => {
    dispatch(loadControlsForNode(id))
  },
  loadObservations: (id) => {
    dispatch(loadObservationsForNode(id))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
export default class ObservationControlGridShow extends React.Component {
  static propTypes = {
    unit: React.PropTypes.object.isRequired,
    translate: React.PropTypes.func.isRequired,
    observationControlGridData: React.PropTypes.arrayOf(React.PropTypes.object),
    params: React.PropTypes.object,
    route: React.PropTypes.object,
    loadControls: React.PropTypes.func.isRequired,
    loadObservations: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.props.params.id = this.props.params.id * 1
  }

  componentWillMount() {
    if (this.props.route.showControls) {
      this.props.loadControls(this.props.params.id)
    } else {
      this.props.loadObservations(this.props.params.id)
    }
  }

  makeToolbar() {
    return (<Toolbar
      showRight={this.props.route.showControls}
      showLeft={this.props.route.showObservations}
      labelRight="Kontroller"
      labelLeft="Observasjoner"
      placeHolderSearch="Filtrer i liste"
      clickShowRight={blur}
      clickShowLeft={blur}
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
      tableData={this.props.observationControlGridData}
    />)
  }

  render() {
    return (
      <Layout
        title={`${this.props.unit.name} - ${this.props.translate('musit.grid.observation.header')}`}
        translate={this.props.translate}
        breadcrumb={"Museum / Papirdunken / Esken inni der"}
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContent()}
      />
    )
  }
}
