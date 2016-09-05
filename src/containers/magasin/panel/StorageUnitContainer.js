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
import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
import Options from '../../../components/storageunits/EnvironmentOptions'
import StorageUnitComponents from '../../../components/storageunits/StorageUnitComponent'
import { Grid, Row, Col } from 'react-bootstrap'
import EnvironmentRequirementComponent from '../../../components/storageunits/EnvironmentRequirementComponent'
import SaveCancel from '../../../components/formfields/saveCancel/SaveCancel'
import Layout from '../../../layout'

export default class StorageUnitContainer extends Component {
  static propTypes = {
    unit: PropTypes.object.isRequired,
    id: PropTypes.number,
    loadStorageUnit: PropTypes.func.isRequired,
    onAddressSuggestionsUpdateRequested: PropTypes.func.isRequired,
    suggest: React.PropTypes.array.isRequired,
    params: PropTypes.object,
    onLagreClick: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    route: React.PropTypes.object,
  }


  componentWillMount() {
    this.props.loadStorageUnit(this.props.params.id)
  }

  updateStorageUnit(data, key, value) {
    const newData = Object.assign({}, data);
    newData[key] = value
    this.setState({ unit: newData })
  }

  render() {
    const data = (this.state && this.state.unit) ? this.state.unit : this.props.unit;

    const completePage = (<div>
      <Row style={{ textAlign: 'center' }}>
        <h2>{this.props.route.add ?
        this.props.translate('musit.storageUnits.newNode') : this.props.params.id }
        - {this.props.translate('musit.storageUnits.header')}
        </h2>
      </Row>
      <StorageUnitComponents
        unit={data}
        translate={this.props.translate}
        updateType={(type) => this.updateStorageUnit(data, 'type', type)}
        updateName={(name) => this.updateStorageUnit(data, 'name', name)}
        updateAreal1={(area) => this.updateStorageUnit(data, 'area', area)}
        updateAreal2={(areaTo) => this.updateStorageUnit(data, 'areaTo', areaTo)}
        updateHeight1={(height) => this.updateStorageUnit(data, 'height', height)}
        updateHeight2={(heightTo) => this.updateStorageUnit(data, 'heightTo', heightTo)}
        updateAddress={(address) => this.updateStorageUnit(data, 'address', address)}
        onAddressSuggestionsUpdateRequested={this.props.onAddressSuggestionsUpdateRequested}
        suggest={this.props.suggest}
      />
      <Row>
        <Col style={{ textAlign: 'center' }}>
          <h3>{this.props.translate('musit.storageUnits.environmentalData')} </h3>
        </Col>
      </Row>
      <EnvironmentRequirementComponent
        translate={this.props.translate}
      />
      {data.type === 'Room' ?
        <Options
          translate={this.props.translate}
          unit={data}
          // Disse må fikses (Mappe verdi av sikring fra bool -> {0,1})
          updateSkallsikring={(sikringSkallsikring) =>
            this.updateStorageUnit(data, 'sikringSkallsikring', sikringSkallsikring)}
          updateTyverisikring={(sikringTyverisikring) =>
            this.updateStorageUnit(data, 'sikringTyverisikring', sikringTyverisikring)}
          updateBrannsikring={(sikringBrannsikring) =>
            this.updateStorageUnit(data, 'sikringBrannsikring', sikringBrannsikring)}
          updateVannskaderisiko={(sikringVannskaderisiko) =>
            this.updateStorageUnit(data, 'sikringVannskaderisiko', sikringVannskaderisiko)}
          updateRutinerBeredskap={(sikringRutineOgBeredskap) =>
            this.updateStorageUnit(data, 'sikringRutineOgBeredskap', sikringRutineOgBeredskap)}
          updateLuftfuktighet={(bevarLuftfuktOgTemp) =>
            this.updateStorageUnit(data, 'bevarLuftfuktOgTemp', bevarLuftfuktOgTemp)}
          updateLysforhold={(bevarLysforhold) =>
            this.updateStorageUnit(data, 'bevarLysforhold', bevarLysforhold)}
          updateTemperatur={(temperatur) =>
            this.updateStorageUnit(data, 'temperatur', temperatur)}
          updatePreventivKonservering={(bevarPrevantKons) =>
            this.updateStorageUnit(data, 'bevarPrevantKons', bevarPrevantKons)}
        />
        : null}
      <Grid>
        <Row>
          <SaveCancel
            translate={this.props.translate}
            onClickSave={() => this.props.onLagreClick(data)}
            onClickCancel={() => hashHistory.goBack()}
            saveDisabled={this.displayExisting}
            cancelDisabled={this.displayExisting}
          />
        </Row>
      </Grid>
    </div>)

    return (
      <Layout
        title={this.props.translate('musit.storageUnits.title')}
        translate={this.props.translate}
        breadcrumb={<span>"Museum / Papirdunken / Esken inni der"</span>}
        content={
          <Grid>
            <Row>
              <Col md={9}>
                {completePage}
              </Col>
            </Row>
          </Grid>
        }
      />

    );
  }
}
