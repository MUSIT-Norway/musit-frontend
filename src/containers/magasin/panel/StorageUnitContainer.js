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
import { validateString, validateNumber } from '../../../components/formfields/common/validators'

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

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    if (this.props.params.id) {
      this.props.loadStorageUnit(this.props.params.id)
    }
  }

  errorAddMessage = (errors, field) => {
    errors[`${field}`] = this.props.translate(`musit.storageUnits.${field}.incorrect`)
  }

  validateStringField(field, value, maxLength = 100) {
    return () => {
      const errors = {}
      if (validateString(value, 0, maxLength) === 'error') {
        this.errorAddMessage(errors, field)
      }
      return errors
    }
  }
  validateNumberField(field, value = '', minimumLength = 0, maximumLength = 10, precision = 3) {
    return (unit) => {
      const errors = {}
      if (unit) {
        if (validateNumber(value, minimumLength, maximumLength, precision) === 'error') {
          this.errorAddMessage(errors, field)
        }
      }
      return errors
    }
  }
  validateForm(formProps) {
    let errors = {}
    if (!formProps.unit.type || formProps.unit.type.trim().length === 0) {
      errors.type = this.props.translate('musit.storageUnits.message.type')
    }
    if (!formProps.unit.name || formProps.unit.name.trim().length === 0) {
      errors.name = this.props.translate('musit.storageUnits.message.name')
    }
    errors = { ...errors, ...this.validateStringField('type', formProps.unit.type, 100)() }
    errors = { ...errors, ...this.validateStringField('name', formProps.unit.name, 100)() }
    errors = { ...errors, ...this.validateStringField('address', formProps.unit.address, 100)() }
    errors = { ...errors, ...this.validateNumberField('area', formProps.unit.area, 0, 10, 3)(formProps.unit) }
    errors = { ...errors, ...this.validateNumberField('areaTo', formProps.unit.areaTo, 0, 10, 3)(formProps.unit) }
    errors = { ...errors, ...this.validateNumberField('height', formProps.unit.height, 0, 10, 3)(formProps.unit) }
    errors = { ...errors, ...this.validateNumberField('heightTo', formProps.unit.heightTo, 0, 10, 3)(formProps.unit) }

    errors = {
      ...errors,
      ...this.validateNumberField('environmentRequirements.temperature',
      formProps.unit.temperature, 0, 10, 3)(formProps.unit)
    }
    errors = {
      ...errors,
      ...this.validateNumberField('environmentRequirements.temperatureTolerance',
      formProps.unit.temperatureTolerance, 0, 10, 0)(formProps.unit)
    }
    errors = {
      ...errors,
      ...this.validateNumberField('environmentRequirements.relativeHumidity',
      formProps.unit.relativeHumidity, 0, 10, 3)(formProps.unit)
    }
    errors = {
      ...errors,
      ...this.validateNumberField('environmentRequirements.relativeHumidityTolerance',
      formProps.unit.relativeHumidityTolerance, 0, 10, 0)(formProps.unit)
    }
    errors = {
      ...errors,
      ...this.validateNumberField('environmentRequirements.hypoxicAir',
      formProps.unit.hypoxicAir, 0, 10, 3)(formProps.unit)
    }
    errors = {
      ...errors,
      ...this.validateNumberField('environmentRequirements.hypoxicAirTolerance',
      formProps.unit.hypoxicAirTolerance, 0, 10, 0)(formProps.unit)
    }
    errors = { ...errors, ...this.validateStringField('environmentRequirements.cleaning', formProps.unit.cleaning, 100)() }
    errors = {
      ...errors,
      ...this.validateStringField('environmentRequirements.lightningConditions', formProps.unit.lightningConditions, 100)()
    }
    errors = { ...errors, ...this.validateStringField('environmentRequirements.comments', formProps.unit.comments, 250)() }
    return errors
  }

  handleSubmit(e) {
    e.preventDefault()
    const errors = this.state ? this.validateForm(this.state) : ''
    this.setState({ ...this.state, errors })
    if (Object.keys(errors).length === 0) {
      this.props.onLagreClick((this.state && this.state.unit) ? this.state.unit : this.props.unit)
    }
  }

  updateStorageUnit(data, key, value) {
    const newData = Object.assign({}, data);
    newData[key] = value
    this.setState({ unit: newData })
  }

  updateEnvironmentalData(environmentalData) {
    const newData = Object.assign((this.state && this.state.unit) ? this.state.unit : this.props.unit, environmentalData)
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
        updateStorageUnit={(e) => this.updateEnvironmentalData(e)}
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
          <br />
            {this.state && this.state.errors && Object.values(this.state.errors).map((error, index) => {
              return <p style={{ color: 'red' }} key={index}>{error}</p>
            })}
          <br />
          <SaveCancel
            translate={this.props.translate}
            onClickSave={this.handleSubmit}
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
                <form onSubmit={this.handleSubmit}>
                  {completePage}
                </form>
              </Col>
            </Row>
          </Grid>
        }
      />

    );
  }
}
