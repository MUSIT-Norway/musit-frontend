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
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
import Options from '../../../../components/storageunits/EnvironmentOptions'
import StorageUnitComponents from '../../../../components/storageunits/StorageUnitComponent'
import { Grid, Row, Col, Form } from 'react-bootstrap'
import EnvironmentRequirementComponent from '../../../../components/storageunits/EnvironmentRequirementComponent'
import SaveCancel from '../../../../components/formfields/saveCancel/SaveCancel'
import Layout from '../../../../layout'
import { validateString, validateNumber } from '../../../../components/formfields/common/validators'
import Breadcrumb from '../../../../layout/Breadcrumb'
import Language from '../../../../components/language'
import { suggestAddress, clearSuggest } from '../../../../reducers/suggest'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    suggest: state.suggest,
    path: state.storageGridUnit.root.path ?
            state.storageGridUnit.root.path.map((s) => {
              return { id: s.id, name: s.name, type: s.type, url: `/magasin/${s.id}` };
            }) : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddressSuggestionsUpdateRequested: ({ value, reason }) => {
      if (reason && (reason === 'type') && value && value.length >= 3) {
        dispatch(suggestAddress('addressField', value))
      } else {
        dispatch(clearSuggest('addressField'))
      }
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class StorageUnitContainer extends Component {
  static propTypes = {
    unit: PropTypes.object.isRequired,
    onAddressSuggestionsUpdateRequested: PropTypes.func.isRequired,
    suggest: React.PropTypes.object.isRequired,
    params: PropTypes.object,
    onLagreClick: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    isAdd: React.PropTypes.bool,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  static defaultProps = {
    unit: {
      environmentRequirement: {},
      environmentAssessment: {},
      securityAssessment: {}
    }
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      unit: this.props.unit
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, unit: nextProps.unit })
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
    if (formProps && formProps.unit) {
      if (!formProps.unit.type || formProps.unit.type.trim().length === 0) {
        errors.type = this.props.translate('musit.storageUnits.type.required')
      }
      if (!formProps.unit.name || formProps.unit.name.trim().length === 0) {
        errors.name = this.props.translate('musit.storageUnits.name.required')
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
        ...this.validateNumberField('environmentRequirement.temperature',
                    formProps.unit.temperature, 0, 10, 3)(formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateNumberField('environmentRequirement.temperatureTolerance',
                    formProps.unit.temperatureTolerance, 0, 10, 0)(formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateNumberField('environmentRequirement.relativeHumidity',
                    formProps.unit.relativeHumidity, 0, 10, 3)(formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateNumberField('environmentRequirement.relativeHumidityTolerance',
                    formProps.unit.relativeHumidityTolerance, 0, 10, 0)(formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateNumberField('environmentRequirement.hypoxicAir',
                    formProps.unit.hypoxicAir, 0, 10, 3)(formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateNumberField('environmentRequirement.hypoxicAirTolerance',
                    formProps.unit.hypoxicAirTolerance, 0, 10, 0)(formProps.unit)
      }
      errors = { ...errors, ...this.validateStringField('environmentRequirement.cleaning', formProps.unit.cleaning, 100)() }
      errors = {
        ...errors,
        ...this.validateStringField('environmentRequirement.lightingCondition', formProps.unit.lightningConditions, 100)()
      }
      errors = { ...errors, ...this.validateStringField('environmentRequirement.comments', formProps.unit.comments, 250)() }
    } else {
      errors.type = this.props.translate('musit.storageUnits.type.required')
      errors.name = this.props.translate('musit.storageUnits.name.required')
    }
    return errors
  }

  handleSubmit(e) {
    e.preventDefault()
    const errors = this.validateForm(this.state)
    this.setState({ ...this.state, errors })
    if (Object.keys(errors).length === 0) {
      this.props.onLagreClick(this.state.unit)
    }
  }

  updateStorageUnit(data, key, value) {
    const newData = Object.assign({}, data);
    newData[key] = value
    this.setState({ unit: newData })
  }

  updateEnvRequirements(data, key, value) {
    const newData = Object.assign({}, data);
    if (!newData.environmentRequirement) {
      newData.environmentRequirement = {}
    }
    newData.environmentRequirement[key] = value
    this.setState({ unit: newData })
  }

  updateEnvAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    if (!newData.environmentAssessment) {
      newData.environmentAssessment = {}
    }
    newData.environmentAssessment[key] = value
    this.setState({ unit: newData })
  }

  updateSecAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    if (!newData.securityAssessment) {
      newData.securityAssessment = {}
    }
    newData.securityAssessment[key] = value
    this.setState({ unit: newData })
  }

  nodeTypes = [
    { type: 'Organisation', iconName: 'folder' },
    { type: 'Building', iconName: 'folder' },
    { type: 'Room', iconName: 'folder' },
    { type: 'StorageUnit', iconName: 'folder' }
  ]

  makeBreadcrumb(nodes, nodeTypes) {
    return nodes ? <Breadcrumb nodes={nodes} nodeTypes={nodeTypes} passive /> : null
  }

  render() {
    const data = this.state.unit
    const breadcrumb = this.makeBreadcrumb(this.props.path, this.nodeTypes)
    const completePage = (
      <div>
        <h4 style={{ textAlign: 'center' }}>
          {this.props.isAdd ? `${this.props.translate('musit.storageUnits.newNode')} - ` : ''}
          {this.props.translate('musit.storageUnits.header')}
        </h4>
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
          environmentRequirement={data.environmentRequirement}
          translate={this.props.translate}
          updateEnvRequirements={(k, v) => { this.updateEnvRequirements(data, k, v) }}
        />
        {data.type === 'Room' ?
          <Options
            translate={this.props.translate}
            unit={data}
              // Disse må fikses (Mappe verdi av sikring fra bool -> {0,1})
            updateSkallsikring={(perimeterSecurity) =>
                  this.updateSecAssessments(data, 'perimeterSecurity', perimeterSecurity)}
            updateTyverisikring={(theftProtection) =>
                  this.updateSecAssessments(data, 'theftProtection', theftProtection)}
            updateBrannsikring={(fireProtection) =>
                  this.updateSecAssessments(data, 'fireProtection', fireProtection)}
            updateVannskaderisiko={(waterDamageAssessment) =>
                  this.updateSecAssessments(data, 'waterDamageAssessment', waterDamageAssessment)}
            updateRutinerBeredskap={(routinesAndContingencyPlan) =>
                  this.updateSecAssessments(data, 'routinesAndContingencyPlan', routinesAndContingencyPlan)}
            updateLuftfuktighet={(relativeHumidity) =>
                  this.updateEnvAssessments(data, 'relativeHumidity', relativeHumidity)}
            updateLysforhold={(lightingCondition) =>
                  this.updateEnvAssessments(data, 'lightingCondition', lightingCondition)}
            updateTemperatur={(temperatureAssessment) =>
                  this.updateEnvAssessments(data, 'temperatureAssessment', temperatureAssessment)}
            updatePreventivKonservering={(preventiveConservation) =>
                  this.updateEnvAssessments(data, 'preventiveConservation', preventiveConservation)}
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
            />
          </Row>
        </Grid>
      </div>
    )

    return (
      <Layout
        title={this.props.translate('musit.storageUnits.title')}
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <Grid>
            <Row>
              <Col md={9}>
                <Form onSubmit={this.handleSubmit}>
                  {completePage}
                </Form>
              </Col>
            </Row>
          </Grid>
        }
      />
    );
  }
}
