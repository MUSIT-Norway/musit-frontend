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
import { Grid, Row, Col, Form, FormGroup } from 'react-bootstrap'
import EnvironmentRequirementComponent from '../../../../components/storageunits/EnvironmentRequirementComponent'
import SaveCancel from '../../../../components/formfields/saveCancel/SaveCancel'
import Layout from '../../../../layout'
import { validateString, validateNumber } from '../../../../components/formfields/common/validators'
import Breadcrumb from '../../../../layout/Breadcrumb'
import Language from '../../../../components/language'
import { MusitDropDownField, MusitField } from '../../../../components/formfields'
import AddressSuggest from '../../../../components/address'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    path: state.storageGridUnit.root.path ?
            state.storageGridUnit.root.path.map((s) => {
              return { id: s.id, name: s.name, type: s.type, url: `/magasin/${s.id}` };
            }) : null
  }
}

@connect(mapStateToProps)
export default class StorageUnitContainer extends Component {
  static propTypes = {
    unit: PropTypes.object.isRequired,
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
    if (nextProps.unit && this.props.unit && nextProps.unit.id !== this.props.unit.id) {
      this.setState({ ...this.state, unit: nextProps.unit })
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
    this.setState({ ...this.state, unit: newData })
  }

  updateEnvRequirements(data, key, value) {
    const newData = Object.assign({}, data);
    if (!newData.environmentRequirement) {
      newData.environmentRequirement = {}
    }
    newData.environmentRequirement[key] = value
    this.setState({ ...this.state, unit: newData })
  }

  updateEnvAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    if (!newData.environmentAssessment) {
      newData.environmentAssessment = {}
    }
    newData.environmentAssessment[key] = value
    this.setState({ ...this.state, unit: newData })
  }

  updateSecAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    if (!newData.securityAssessment) {
      newData.securityAssessment = {}
    }
    newData.securityAssessment[key] = value
    this.setState({ ...this.state, unit: newData })
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
    return (
      <Layout
        title={this.props.translate('musit.storageUnits.title')}
        translate={this.props.translate}
        breadcrumb={this.makeBreadcrumb(this.props.path, this.nodeTypes)}
        content={
          <Grid>
            <Row>
              <Col md={9}>
                <form
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      e.preventDefault()
                    }
                  }}
                  onSubmit={e => this.handleSubmit(e, this.state)}
                >
                  <div>
                    <h4 style={{ textAlign: 'center' }}>
                      {this.props.isAdd ? `${this.props.translate('musit.storageUnits.newNode')} - ` : ''}
                      {this.props.translate('musit.storageUnits.header')}
                    </h4>
                    <Grid>
                      <Row className="row-centered">
                        <Col md={5}>
                          <Form horizontal>
                            <div className="form-group">
                              <label className="col-sm-3 control-label" htmlFor="storageUnitType">
                                {this.props.translate('musit.storageUnits.type.labelText')}
                                { <span style={{ color: 'red' }}>*</span> }
                              </label>
                              <div class="col-sm-4" is="null">
                                <MusitDropDownField
                                  id="type"
                                  validate="text"
                                  tooltip={this.props.translate('musit.storageUnits.type.tooltip')}
                                  placeHolder={this.props.translate('musit.storageUnits.type.placeHolder')}
                                  maximumLength={100}
                                  items={['StorageUnit', 'Room', 'Building', 'Organisation']}
                                  translate={this.props.translate}
                                  translateKeyPrefix={'musit.storageUnits.type.items.'}
                                  onChange={(storageType) => this.updateStorageUnit(this.state.unit, 'type', storageType)}
                                  value={this.state.unit.type}
                                  disabled={!this.props.isAdd}
                                />
                              </div>
                            </div>
                          </Form>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={5}>
                          <Form horizontal>
                            <FormGroup>
                              <label className="col-sm-3 control-label" htmlFor="name">
                                {this.props.translate('musit.storageUnits.name.labelText')}{ <span style={{ color: 'red' }}>*</span> }
                              </label>
                              <div class="col-sm-8" is="null">
                                <MusitField
                                  id="name"
                                  tooltip={this.props.translate('musit.storageUnits.name.tooltip')}
                                  validate="text"
                                  placeHolder={this.props.translate('musit.storageUnits.name.placeHolder')}
                                  onChange={(storageUnitName) => this.updateStorageUnit(this.state.unit, 'name', storageUnitName)}
                                  maximumLength={100}
                                  value={this.state.unit.name || ''}
                                />
                              </div>
                            </FormGroup>
                          </Form>
                        </Col>
                        <Col md={5}>
                          {(this.state.unit.type === 'Building' || this.state.unit.type === 'Organisation') &&
                            <Form horizontal>
                              <FormGroup>
                                <label className="col-sm-3 control-label" htmlFor="address">
                                  {this.props.translate('musit.storageUnits.address.labelText')}
                                </label>
                                <div class="col-sm-8" is="null">
                                  <AddressSuggest
                                    id="addressField"
                                    value={this.state.unit.address}
                                    placeHolder="Find address"
                                    onChange={(address) => {
                                      this.updateStorageUnit(this.state.unit, 'address', address)
                                    }}
                                  />
                                </div>
                              </FormGroup>
                            </Form>
                          }
                        </Col>
                      </Row>
                      <Row className="row-centered">
                        <Col md={5}>
                          <Form horizontal>
                            <div className="form-group">
                              <label className="col-sm-3 control-label" htmlFor="comments2">
                                {this.props.translate('musit.storageUnits.area.labelText')}</label>
                              <div class="col-sm-4" is="null">
                                <MusitField
                                  id="areaFrom"
                                  tooltip={this.props.translate('musit.storageUnits.area.tooltip')}
                                  validate="number"
                                  placeHolder={this.props.translate('musit.storageUnits.area.placeHolder')}
                                  onChange={(areaFrom) => this.updateStorageUnit(this.state.unit, 'area', areaFrom)}
                                  precision={3}
                                  value={this.state.unit.area}
                                />
                              </div>
                              <div class="col-sm-4" is="null">
                                <MusitField
                                  id="areaTo"
                                  tooltip={this.props.translate('musit.storageUnits.areaTo.tooltip')}
                                  validate="number"
                                  placeHolder={this.props.translate('musit.storageUnits.areaTo.placeHolder')}
                                  onChange={(areaTo) => this.updateStorageUnit(this.state.unit, 'areaTo', areaTo)}
                                  precision={3}
                                  value={this.state.unit.areaTo}
                                />
                              </div>
                            </div>
                          </Form>
                        </Col>
                        <Col md={5}>
                          <Form horizontal>
                            <div className="form-group">
                              <label className="col-sm-3 control-label" htmlFor="controlId">
                                {this.props.translate('musit.storageUnits.height.labelText')}</label>
                              <div class="col-sm-4" is="null">
                                <MusitField
                                  id="heightFrom"
                                  tooltip={this.props.translate('musit.storageUnits.height.tooltip')}
                                  validate="number"
                                  placeHolder={this.props.translate('musit.storageUnits.height.placeHolder')}
                                  onChange={(heightFrom) => this.updateStorageUnit(this.state.unit, 'height', heightFrom)}
                                  precision={3}
                                  value={this.state.unit.height}
                                />
                              </div>
                              <div class="col-sm-4" is="null">
                                <MusitField
                                  id="heightTo"
                                  tooltip={this.props.translate('musit.storageUnits.heightTo.tooltip')}
                                  validate="number"
                                  placeHolder={this.props.translate('musit.storageUnits.heightTo.placeHolder')}
                                  onChange={(heightTo) => this.updateStorageUnit(this.state.unit, 'heightTo', heightTo)}
                                  precision={3}
                                  value={this.state.unit.heightTo}
                                />
                              </div>
                            </div>
                          </Form>
                        </Col>
                      </Row>
                    </Grid>
                    <Row>
                      <Col style={{ textAlign: 'center' }}>
                        <h3>{this.props.translate('musit.storageUnits.environmentalData')} </h3>
                      </Col>
                    </Row>
                    <EnvironmentRequirementComponent
                      environmentRequirement={this.state.unit.environmentRequirement}
                      translate={this.props.translate}
                      updateEnvRequirements={(k, v) => { this.updateEnvRequirements(this.state.unit, k, v) }}
                    />
                    {this.state.unit.type === 'Room' ?
                      <Options
                        translate={this.props.translate}
                        unit={this.state.unit}
                        // Disse må fikses (Mappe verdi av sikring fra bool -> {0,1})
                        updateSkallsikring={(perimeterSecurity) =>
                          this.updateSecAssessments(this.state.unit, 'perimeterSecurity', perimeterSecurity)}
                        updateTyverisikring={(theftProtection) =>
                          this.updateSecAssessments(this.state.unit, 'theftProtection', theftProtection)}
                        updateBrannsikring={(fireProtection) =>
                          this.updateSecAssessments(this.state.unit, 'fireProtection', fireProtection)}
                        updateVannskaderisiko={(waterDamageAssessment) =>
                          this.updateSecAssessments(this.state.unit, 'waterDamageAssessment', waterDamageAssessment)}
                        updateRutinerBeredskap={(routinesAndContingencyPlan) =>
                          this.updateSecAssessments(this.state.unit, 'routinesAndContingencyPlan', routinesAndContingencyPlan)}
                        updateLuftfuktighet={(relativeHumidity) =>
                          this.updateEnvAssessments(this.state.unit, 'relativeHumidity', relativeHumidity)}
                        updateLysforhold={(lightingCondition) =>
                          this.updateEnvAssessments(this.state.unit, 'lightingCondition', lightingCondition)}
                        updateTemperatur={(temperatureAssessment) =>
                          this.updateEnvAssessments(this.state.unit, 'temperatureAssessment', temperatureAssessment)}
                        updatePreventivKonservering={(preventiveConservation) =>
                          this.updateEnvAssessments(this.state.unit, 'preventiveConservation', preventiveConservation)}
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
                </form>
              </Col>
            </Row>
          </Grid>
        }
      />
    );
  }
}
