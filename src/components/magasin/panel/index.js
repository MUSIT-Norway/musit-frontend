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
import { values } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { hashHistory } from 'react-router';
import { Grid, Row, Col, Checkbox, ControlLabel, Form, FormGroup } from 'react-bootstrap';
import SaveCancel from '../../../components/formfields/saveCancel/SaveCancel';
import Layout from '../../../layout';
import Breadcrumb from '../../../layout/Breadcrumb';
import AddressSuggest from '../../../components/address';
import Loader from 'react-loader';
import { parseISODateNonStrict } from '../../../util';
import { MusitTextArea as TextArea, MusitDropDownField, MusitField as Field } from '../../../components/formfields';
import validateForm from './validator';
import { I18n } from 'react-i18nify';

export default class StorageUnitContainer extends Component {
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
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.translateEnvReqField = this.translateEnvReqField.bind(this);
    this.renderEnvReqNumberField = this.renderEnvReqNumberField.bind(this);
    this.renderEnvReqStringFieldBlock = this.renderEnvReqStringFieldBlock.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const errors = validateForm(this.props);
    this.props.updateState({ ...this.props.unit, errors });
    if (Object.keys(errors).length === 0) {
      this.props.onLagreClick(this.props.unit);
    }
  }

  updateStorageUnit(data, key, value) {
    const newData = Object.assign({}, data);
    newData[key] = value;
    this.props.updateState(newData);
  }

  updateEnvRequirements(data, key, value) {
    const newData = Object.assign({}, data);
    newData.environmentRequirement[key] = value;
    this.props.updateState(newData);
  }

  updateEnvAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    newData.environmentAssessment[key] = value;
    this.props.updateState(newData);
  }

  updateSecAssessments(data, key, value) {
    const newData = Object.assign({}, data);
    newData.securityAssessment[key] = value;
    this.props.updateState(newData);
  }

  translateEnvReqField(field) {
    return I18n.t(`musit.storageUnits.environmentRequirement.${field}`);
  }

  renderEnvReqStringFieldBlock(field) {
    return (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor={field}>
          {this.translateEnvReqField(`${field}.labelText`)}
        </label>
        <div class="col-sm-8" is="null">
          <Field
            id={field}
            tooltip={this.translateEnvReqField(`${field}.tooltip`)}
            validate="text"
            maximumLength={100}
            onChange={value => this.updateEnvRequirements(this.props.unit, field, value)}
            value={this.props.unit.environmentRequirement[field] || ''}
          />
        </div>
      </FormGroup>
    );
  }

  renderEnvReqTextAreaBlock(field) {
    return (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor={field}>
          {this.translateEnvReqField(`${field}.labelText`)}
        </label>
        <div class="col-sm-8" is="null">
          <TextArea
            id={field}
            numberOfRows={4}
            tooltip={this.translateEnvReqField(`${field}.tooltip`)}
            validate="text"
            maximumLength={250}
            onChange={value => this.updateEnvRequirements(this.props.unit, field, value)}
            value={this.props.unit.environmentRequirement[field] || ''}
          />
        </div>
      </FormGroup>
    );
  }

  renderEnvReqNumberField(field, unit, precision) {
    return (
      <Field
        id={field}
        tooltip={this.translateEnvReqField(`${field}.tooltip`)}
        validate="number"
        placeHolder={this.translateEnvReqField(`${field}.placeHolder`)}
        precision={precision}
        onChange={value => this.updateEnvRequirements(this.props.unit, field, value)}
        value={unit.environmentRequirement[field] || ''}
      />
    );
  }

  renderSecurityAssessmentField(field) {
    return (
      <div>
        <Checkbox
          checked={!!this.props.unit.securityAssessment[field]}
          onChange={(event) => this.updateSecAssessments(this.props.unit, field, event.target.checked)}
        >
          {I18n.t(`musit.storageUnits.securityAssessment.${field}`)}
        </Checkbox>
      </div>
    );
  }

  renderEnvironmentAssessmentField(field) {
    return (
      <div>
        <Checkbox
          checked={!!this.props.unit.environmentAssessment[field]}
          onChange={(event) => this.updateEnvAssessments(this.props.unit, field, event.target.checked)}
        >
          {I18n.t(`musit.storageUnits.environmentalAssessment.${field}`)}
        </Checkbox>
      </div>
    );
  }

  renderStorageUnitNumberField(field, unit, precision) {
    return (
      <Field
        id={field}
        tooltip={I18n.t(`musit.storageUnits.${field}.tooltip`)}
        validate="number"
        placeHolder={I18n.t(`musit.storageUnits.${field}.placeHolder`)}
        onChange={value => this.updateStorageUnit(this.props.unit, field, value)}
        precision={precision}
        value={unit[field]}
      />
    );
  }

  renderLastChangeData(unit) {
    const lastUpdateDate = parseISODateNonStrict(unit.updatedDate).format("DD.MM.YYYY");
    // const lastUpdateBy = unit.updatedBy // TODO når dette er i orden, autentisering er i orden
    return (
      <span>
        <b>{I18n.t('musit.storageUnits.lastUpdateBy')}</b> {this.props.isAdd ? '' : 'Darth Wader'}
        <br />
        <b>{I18n.t('musit.storageUnits.lastUpdateDate')}</b>{this.props.isAdd ? '' : lastUpdateDate}
      </span>
    );
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <Loader loaded={this.props.loaded}>
            <Grid>
              <Row>
                <Col md={9}>
                  <form
                    onKeyDown={(e) => {
                      if (e.keyCode === 13 && e.target.type !== 'textarea') {
                        e.preventDefault();
                      }
                    }}
                    onSubmit={e => this.handleSubmit(e, this.state)}
                  >
                    <div>
                      <h4 style={{ textAlign: 'center' }}>
                        {this.props.isAdd ? `${I18n.t('musit.storageUnits.newNode')} - ` : ''}
                        {I18n.t('musit.storageUnits.header')}
                      </h4>
                      <Grid>
                        <Row className="row-centered">
                          <Col md={5}>
                            <Form horizontal>
                              <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="storageUnitType">
                                  {I18n.t('musit.storageUnits.type.labelText')}
                                  { <span style={{ color: 'red' }}>*</span> }
                                </label>
                                <div class="col-sm-4" is="null">
                                  <MusitDropDownField
                                    id="type"
                                    validate="text"
                                    tooltip={I18n.t('musit.storageUnits.type.tooltip')}
                                    placeHolder={I18n.t('musit.storageUnits.type.placeHolder')}
                                    maximumLength={100}
                                    items={['StorageUnit', 'Room', 'Building', 'Organisation']}
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
                                  {I18n.t('musit.storageUnits.name.labelText')}
                                  { <span style={{ color: 'red' }}>*</span> }
                                </label>
                                <div class="col-sm-8" is="null">
                                  <Field
                                    id="name"
                                    tooltip={I18n.t('musit.storageUnits.name.tooltip')}
                                    validate="text"
                                    placeHolder={I18n.t('musit.storageUnits.name.placeHolder')}
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
                                    {I18n.t('musit.storageUnits.address.labelText')}
                                  </label>
                                  <div class="col-sm-8" is="null">
                                    <AddressSuggest
                                      id="addressField"
                                      value={this.props.unit.address}
                                      placeHolder="Find address"
                                      onChange={(address) => {
                                        this.updateStorageUnit(this.props.unit, 'address', address);
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
                                  {I18n.t('musit.storageUnits.area.labelText')}</label>
                                <div class="col-sm-4" is="null">
                                  {this.renderStorageUnitNumberField('area', this.props.unit, 3)}
                                </div>
                                <div class="col-sm-4" is="null">
                                  {this.renderStorageUnitNumberField('areaTo', this.props.unit, 3)}
                                </div>
                              </div>
                            </Form>
                          </Col>
                          <Col md={5}>
                            <Form horizontal>
                              <div className="form-group">
                                <label className="col-sm-3 control-label" htmlFor="controlId">
                                  {I18n.t('musit.storageUnits.height.labelText')}</label>
                                <div class="col-sm-4" is="null">
                                  {this.renderStorageUnitNumberField('height', this.props.unit, 3)}
                                </div>
                                <div class="col-sm-4" is="null">
                                  {this.renderStorageUnitNumberField('heightTo', this.props.unit, 3)}
                                </div>
                              </div>
                            </Form>
                          </Col>
                        </Row>
                      </Grid>
                      <Row>
                        <Col style={{ textAlign: 'center' }}>
                          <h4>{I18n.t('musit.storageUnits.environmentalData')}</h4>
                        </Col>
                      </Row>
                      <div>
                        <Grid>
                          <Row className="row-centered">
                            <Col md={5}>
                              <Form horizontal>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label" htmlFor="comments2">
                                    {this.translateEnvReqField('temperature.labelText')}</label>
                                  <div class="col-sm-4" is="null">
                                    {this.renderEnvReqNumberField('temperature', this.props.unit, 3)}
                                  </div>
                                  <div class="col-sm-4" is="null">
                                    {this.renderEnvReqNumberField('temperatureTolerance', this.props.unit, 0)}
                                  </div>
                                </div>
                              </Form>
                            </Col>
                            <Col md={5}>
                              <Form horizontal>
                                <div className="form-group">
                                  <label className="col-sm-3 control-label" htmlFor="comments2">
                                    {this.translateEnvReqField('relativeHumidity.labelText')}</label>
                                  <div class="col-sm-4" is="null">
                                    {this.renderEnvReqNumberField('relativeHumidity', this.props.unit, 3)}
                                  </div>
                                  <div class="col-sm-4" is="null">
                                    {this.renderEnvReqNumberField('relativeHumidityTolerance', this.props.unit, 0)}
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
                                    {this.translateEnvReqField('hypoxicAir.labelText')}</label>
                                  <div class="col-sm-4" is="null">
                                    {this.renderEnvReqNumberField('hypoxicAir', this.props.unit, 3)}
                                  </div>
                                  <div class="col-sm-4" is="null">
                                    {this.renderEnvReqNumberField('hypoxicAirTolerance', this.props.unit, 0)}
                                  </div>
                                </div>
                              </Form>
                            </Col>
                            <Col md={5}>
                              <Form horizontal>
                                {this.renderEnvReqStringFieldBlock('cleaning')}
                              </Form>
                            </Col>
                          </Row>
                          <Row className="row-centered">
                            <Col md={5}>
                              <Form horizontal>
                                {this.renderEnvReqStringFieldBlock('lightingCondition')}
                              </Form>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={5}>
                              <Form horizontal>
                                {this.renderEnvReqTextAreaBlock('comments')}
                              </Form>
                            </Col>
                          </Row>
                        </Grid>
                      </div>
                      {this.props.unit.type === 'Room' &&
                        <Grid>
                          <Row>
                            <Col lg={5} md={5} sm={5} xs={10} offset={1}>
                              <ControlLabel>{I18n.t('musit.storageUnits.securityAssessment.securityAssessment')}
                              </ControlLabel>
                              {this.renderSecurityAssessmentField('perimeter')}
                              {this.renderSecurityAssessmentField('theftProtection')}
                              {this.renderSecurityAssessmentField('fireProtection')}
                              {this.renderSecurityAssessmentField('waterDamage')}
                              {this.renderSecurityAssessmentField('routinesAndContingencyPlan')}
                            </Col>
                            <Col lg={5} md={5} sm={5} xs={10} offset={1}>
                              <ControlLabel>
                                {I18n.t('musit.storageUnits.environmentalAssessment.environmentalAssessment')}
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
                          {this.props.unit.errors && values(this.props.unit.errors).map((error, index) => {
                            return <p style={{ color: 'red' }} key={index}>{error}</p>;
                          })}
                          <br />
                          <SaveCancel
                            onClickSave={this.handleSubmit}
                            onClickCancel={() => hashHistory.goBack()}
                          />
                        </Row>
                        <Row>
                          <Col sm={8} />
                          <Col sm={4}>
                            {this.renderLastChangeData(this.props.unit)}
                          </Col>
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
