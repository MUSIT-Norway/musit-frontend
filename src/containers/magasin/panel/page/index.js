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
import { Grid, Row, Col, Checkbox, ControlLabel, Form, FormGroup } from 'react-bootstrap'
import SaveCancel from '../../../../components/formfields/saveCancel/SaveCancel'
import Layout from '../../../../layout'
import { validateString, validateNumber } from '../../../../components/formfields/common/validators'
import Breadcrumb from '../../../../layout/Breadcrumb'
import Language from '../../../../components/language'
import AddressSuggest from '../../../../components/address'
import Loader from 'react-loader';
import { createBreadcrumbPath } from '../../../../util'
import { MusitTextArea as TextArea, MusitDropDownField, MusitField as Field } from '../../../../components/formfields'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    path: createBreadcrumbPath(state.storageGridUnit.root.data.path, state.storageGridUnit.root.data.pathNames)
  }
}

class StorageUnitContainer extends Component {
  static propTypes = {
    unit: PropTypes.object.isRequired,
    params: PropTypes.object,
    onLagreClick: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    isAdd: React.PropTypes.bool,
    path: React.PropTypes.arrayOf(React.PropTypes.object),
    loaded: React.PropTypes.bool.isRequired,
    updateState: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.translate = this.translate.bind(this)
    this.renderNumberField = this.renderNumberField.bind(this)
    this.renderStringFieldBlock = this.renderStringFieldBlock.bind(this)
  }

  errorAddMessage = (errors, field) => {
    errors[`${field}`] = this.props.translate(`musit.storageUnits.${field}.incorrect`)
  }

  validateStringField(field, value, maxLength = 100) {
    const errors = {}
    if (validateString(value, 0, maxLength) === 'error') {
      this.errorAddMessage(errors, field)
    }
    return errors
  }

  validateNumberField(field, value = '', minimumLength = 0, maximumLength = 10, precision = 3) {
    const errors = {}
    if (validateNumber(value, minimumLength, maximumLength, precision) === 'error') {
      this.errorAddMessage(errors, field)
    }
    return errors
  }

  validateEnvironmentRequirement(field, min, max, pres, formProps) {
    const key = field.split('.').reduce((a, b) => formProps[a][b])
    return this.validateNumberField(field, key, min, max, pres)
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
      errors = { ...errors, ...this.validateStringField('type', formProps.unit.type, 100) }
      errors = { ...errors, ...this.validateStringField('name', formProps.unit.name, 100) }
      errors = { ...errors, ...this.validateStringField('address', formProps.unit.address, 100) }
      errors = { ...errors, ...this.validateNumberField('area', formProps.unit.area, 0, 10, 3) }
      errors = { ...errors, ...this.validateNumberField('areaTo', formProps.unit.areaTo, 0, 10, 3) }
      errors = { ...errors, ...this.validateNumberField('height', formProps.unit.height, 0, 10, 3) }
      errors = { ...errors, ...this.validateNumberField('heightTo', formProps.unit.heightTo, 0, 10, 3) }
      errors = {
        ...errors,
        ...this.validateEnvironmentRequirement('environmentRequirement.temperature', 0, 10, 3, formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateEnvironmentRequirement('environmentRequirement.temperatureTolerance', 0, 10, 0, formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateEnvironmentRequirement('environmentRequirement.relativeHumidity', 0, 10, 3, formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateEnvironmentRequirement('environmentRequirement.relativeHumidityTolerance', 0, 10, 0, formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateEnvironmentRequirement('environmentRequirement.hypoxicAir', 0, 10, 3, formProps.unit)
      }
      errors = {
        ...errors,
        ...this.validateEnvironmentRequirement('environmentRequirement.hypoxicAirTolerance', 0, 10, 0, formProps.unit)
      }
      const environmentRequirement = formProps.unit.environmentRequirement;
      errors = {
        ...errors,
        ...this.validateStringField('environmentRequirement.cleaning', environmentRequirement.cleaning, 100)
      }
      errors = {
        ...errors,
        ...this.validateStringField('environmentRequirement.lightingCondition', environmentRequirement.lightingCondition, 100)
      }
      errors = {
        ...errors,
        ...this.validateStringField('environmentRequirement.comments', environmentRequirement.comments, 250)
      }
    } else {
      errors.type = this.props.translate('musit.storageUnits.type.required')
      errors.name = this.props.translate('musit.storageUnits.name.required')
    }
    return errors
  }

  handleSubmit(e) {
    e.preventDefault()
    const errors = this.validateForm(this.props)
    this.props.updateState({ ...this.props.unit, errors })
    if (Object.keys(errors).length === 0) {
      this.props.onLagreClick(this.props.unit)
    }
  }

  updateStorageUnit(data, key, value) {
    const newData = Object.assign({}, data);
    newData[key] = value
    this.props.updateState(newData)
  }

  updateEnvRequirements(data, key, value) {
    const newData = Object.assign({}, data);
    newData.environmentRequirement[key] = value
    this.props.updateState(newData)
  }

  updateEnvAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    newData.environmentAssessment[key] = value
    this.props.updateState(newData)
  }

  updateSecAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    newData.securityAssessment[key] = value
    this.props.updateState(newData)
  }

  translate(field) {
    return this.props.translate(`musit.storageUnits.environmentRequirement.${field}`)
  }

  renderStringFieldBlock(field) {
    return (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor={field}>
          {this.translate(`${field}.labelText`)}
        </label>
        <div class="col-sm-8" is="null">
          <Field
            id={field}
            tooltip={this.translate(`${field}.tooltip`)}
            validate="text"
            maximumLength={100}
            onChange={value => this.updateEnvRequirements(this.props.unit, field, value)}
            value={this.props.unit.environmentRequirement[field] || ''}
          />
        </div>
      </FormGroup>
    )
  }

  renderTextAreaBlock(field) {
    return (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor={field}>
          {this.translate(`${field}.labelText`)}
        </label>
        <div class="col-sm-8" is="null">
          <TextArea
            id={field}
            numberOfRows={4}
            tooltip={this.translate(`${field}.tooltip`)}
            validate="text"
            maximumLength={250}
            onChange={value => this.updateEnvRequirements(this.props.unit, field, value)}
            value={this.props.unit.environmentRequirement[field] || ''}
          />
        </div>
      </FormGroup>
    )
  }

  renderNumberField(field, unit, precision) {
    return (
      <Field
        id={field}
        tooltip={this.translate(`${field}.tooltip`)}
        validate="number"
        placeHolder={this.translate(`${field}.placeHolder`)}
        precision={precision}
        onChange={value => this.updateEnvRequirements(this.props.unit, field, value)}
        value={unit.environmentRequirement[field] || ''}
      />
    )
  }

  renderSecurityAssessmentField(field) {
    return (
      <div>
        <Checkbox
          checked={!!this.props.unit.securityAssessment[field]}
          onChange={(event) => this.updateSecAssessments(this.props.unit, field, event.target.checked)}
        >
          {this.props.translate(`musit.storageUnits.securityAssessment.${field}`)}
        </Checkbox>
      </div>
    )
  }

  renderEnvironmentAssessmentField(field) {
    return (
      <div>
        <Checkbox
          checked={!!this.props.unit.environmentAssessment[field]}
          onChange={(event) => this.updateEnvAssessments(this.props.unit, field, event.target.checked)}
        >
          {this.props.translate(`musit.storageUnits.environmentalAssessment.${field}`)}
        </Checkbox>
      </div>
    )
  }

  render() {
    return (
      <Layout
        title={this.props.translate('musit.storageUnits.title')}
        translate={this.props.translate}
        breadcrumb={<Breadcrumb nodes={this.props.path} passive />}
        content={
          <Loader loaded={this.props.loaded}>
            <Grid>
              <Row>
                <Col md={9}>
                  <form
                    onKeyDown={(e) => {
                      if (e.keyCode === 13 && e.target.type !== 'textarea') {
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
                                    onChange={storageType => this.updateStorageUnit(this.props.unit, 'type', storageType)}
                                    value={this.props.unit.type}
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
                                  {this.props.translate('musit.storageUnits.name.labelText')}
                                  { <span style={{ color: 'red' }}>*</span> }
                                </label>
                                <div class="col-sm-8" is="null">
                                  <Field
                                    id="name"
                                    tooltip={this.props.translate('musit.storageUnits.name.tooltip')}
                                    validate="text"
                                    placeHolder={this.props.translate('musit.storageUnits.name.placeHolder')}
                                    onChange={storageUnitName => this.updateStorageUnit(this.props.unit, 'name', storageUnitName)}
                                    maximumLength={100}
                                    value={this.props.unit.name || ''}
                                  />
                                </div>
                              </FormGroup>
                            </Form>
                          </Col>
                          <Col md={5}>
                            {(this.props.unit.type === 'Building'
                            || this.props.unit.type === 'Organisation') &&
                              <Form horizontal>
                                <FormGroup>
                                  <label className="col-sm-3 control-label" htmlFor="address">
                                    {this.props.translate('musit.storageUnits.address.labelText')}
                                  </label>
                                  <div class="col-sm-8" is="null">
                                    <AddressSuggest
                                      id="addressField"
                                      value={this.props.unit.address}
                                      placeHolder="Find address"
                                      onChange={(address) => {
                                        this.updateStorageUnit(this.props.unit, 'address', address)
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
                                  <Field
                                    id="areaFrom"
                                    tooltip={this.props.translate('musit.storageUnits.area.tooltip')}
                                    validate="number"
                                    placeHolder={this.props.translate('musit.storageUnits.area.placeHolder')}
                                    onChange={areaFrom => this.updateStorageUnit(this.props.unit, 'area', areaFrom)}
                                    precision={3}
                                    value={this.props.unit.area}
                                  />
                                </div>
                                <div class="col-sm-4" is="null">
                                  <Field
                                    id="areaTo"
                                    tooltip={this.props.translate('musit.storageUnits.areaTo.tooltip')}
                                    validate="number"
                                    placeHolder={this.props.translate('musit.storageUnits.areaTo.placeHolder')}
                                    onChange={areaTo => this.updateStorageUnit(this.props.unit, 'areaTo', areaTo)}
                                    precision={3}
                                    value={this.props.unit.areaTo}
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
                                  <Field
                                    id="heightFrom"
                                    tooltip={this.props.translate('musit.storageUnits.height.tooltip')}
                                    validate="number"
                                    placeHolder={this.props.translate('musit.storageUnits.height.placeHolder')}
                                    onChange={heightFrom => this.updateStorageUnit(this.props.unit, 'height', heightFrom)}
                                    precision={3}
                                    value={this.props.unit.height}
                                  />
                                </div>
                                <div class="col-sm-4" is="null">
                                  <Field
                                    id="heightTo"
                                    tooltip={this.props.translate('musit.storageUnits.heightTo.tooltip')}
                                    validate="number"
                                    placeHolder={this.props.translate('musit.storageUnits.heightTo.placeHolder')}
                                    onChange={heightTo => this.updateStorageUnit(this.props.unit, 'heightTo', heightTo)}
                                    precision={3}
                                    value={this.props.unit.heightTo}
                                  />
                                </div>
                              </div>
                            </Form>
                          </Col>
                        </Row>
                      </Grid>
                      <Row>
                        <Col style={{ textAlign: 'center' }}>
                          <h4>{this.props.translate('musit.storageUnits.environmentalData')}</h4>
                        </Col>
                      </Row>
                      <div>
                        <Grid>
                          <Row className="row-centered">
                            <Col md={5}>
                              <Form horizontal>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label" htmlFor="comments2">
                                    {this.translate('temperature.labelText')}</label>
                                  <div class="col-sm-4" is="null">
                                    {this.renderNumberField('temperature', this.props.unit, 3)}
                                  </div>
                                  <div class="col-sm-4" is="null">
                                    {this.renderNumberField('temperatureTolerance', this.props.unit, 0)}
                                  </div>
                                </div>
                              </Form>
                            </Col>
                            <Col md={5}>
                              <Form horizontal>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label" htmlFor="comments2">
                                    {this.translate('relativeHumidity.labelText')}</label>
                                  <div class="col-sm-4" is="null">
                                    {this.renderNumberField('relativeHumidity', this.props.unit, 3)}
                                  </div>
                                  <div class="col-sm-4" is="null">
                                    {this.renderNumberField('relativeHumidityTolerance', this.props.unit, 0)}
                                  </div>
                                </div>
                              </Form>
                            </Col>
                          </Row>
                          <Row className="row-centered">
                            <Col md={5}>
                              <Form horizontal>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label" htmlFor="comments2">
                                    {this.translate('hypoxicAir.labelText')}</label>
                                  <div class="col-sm-4" is="null">
                                    {this.renderNumberField('hypoxicAir', this.props.unit, 3)}
                                  </div>
                                  <div class="col-sm-4" is="null">
                                    {this.renderNumberField('hypoxicAirTolerance', this.props.unit, 0)}
                                  </div>
                                </div>
                              </Form>
                            </Col>
                            <Col md={5}>
                              <Form horizontal>
                                {this.renderStringFieldBlock('cleaning')}
                              </Form>
                            </Col>
                          </Row>
                          <Row className="row-centered">
                            <Col md={5}>
                              <Form horizontal>
                                {this.renderStringFieldBlock('lightingCondition')}
                              </Form>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={5}>
                              <Form horizontal>
                                {this.renderTextAreaBlock('comments')}
                              </Form>
                            </Col>
                          </Row>
                        </Grid>
                      </div>
                      {this.props.unit.type === 'Room' &&
                        <Grid>
                          <Row>
                            <Col lg={5} md={5} sm={5} xs={10} offset={1}>
                              <ControlLabel>{this.props.translate('musit.storageUnits.securityAssessment.securityAssessment')}
                              </ControlLabel>
                              {this.renderSecurityAssessmentField('perimeter')}
                              {this.renderSecurityAssessmentField('theftProtection')}
                              {this.renderSecurityAssessmentField('fireProtection')}
                              {this.renderSecurityAssessmentField('waterDamage')}
                              {this.renderSecurityAssessmentField('routinesAndContingencyPlan')}
                            </Col>
                            <Col lg={5} md={5} sm={5} xs={10} offset={1}>
                              <ControlLabel>
                                {this.props.translate('musit.storageUnits.environmentalAssessment.environmentalAssessment')}
                              </ControlLabel>
                              {this.renderEnvironmentAssessmentField('relativeHumidity')}
                              {this.renderEnvironmentAssessmentField('lightingCondition')}
                              {this.renderEnvironmentAssessmentField('temperature')}
                              {this.renderEnvironmentAssessmentField('preventiveConservation')}
                            </Col>
                          </Row>
                        </Grid>}
                      <Grid>
                        <Row>
                          <br />
                          {this.props.unit.errors && Object.values(this.props.unit.errors).map((error, index) => {
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
          </Loader>
        }
      />
    );
  }
}

export default connect(mapStateToProps)(StorageUnitContainer)
