import { values } from 'lodash';
import * as React from "react";
import { Component } from "react";
import { Grid, Row, Col, Checkbox, ControlLabel, Form, FormGroup } from 'react-bootstrap';
import SaveCancel from '../../components/formfields/saveCancel/SaveCancel';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import AddressSuggest from '../../components/suggest/AddressSuggest';
import * as Loader from 'react-loader';
import { parseISODate } from '../../shared/util';
import {
  MusitTextArea as TextArea,
  MusitDropDownField,
  MusitField as Field
} from '../../components/formfields';
import validateForm from './nodeValidator';
import { I18n } from 'react-i18nify';
import { TODO } from '../../types/common';
import { Match } from '../../types/Routes';
import { AppSession } from '../../types/appSession';

interface NodeDetailsProps {
  unit: TODO;
  match: Match<TODO>;
  onLagreClick: Function;
  isAdd?: boolean;
  path?: Array<object>;
  loaded: boolean;
  updateState: Function;
  goBack: Function;
  rootNode: Node;
  loading?: boolean;

  appSession: AppSession;
}
/* Old:
  static propTypes = {
    unit: PropTypes.object.isRequired,
    match: PropTypes.object,
    onLagreClick: PropTypes.func.isRequired,
    isAdd: PropTypes.bool,
    path: PropTypes.arrayOf(PropTypes.object),
    loaded: PropTypes.bool.isRequired,
    updateState: PropTypes.func.isRequired,
    goBack: PropTypes.func
  };
*/
export default class NodeDetails extends Component<NodeDetailsProps> {


  constructor(props:NodeDetailsProps) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.translateEnvReqField = this.translateEnvReqField.bind(this);
    this.renderEnvReqNumberField = this.renderEnvReqNumberField.bind(this);
    this.renderEnvReqStringFieldBlock = this.renderEnvReqStringFieldBlock.bind(this);
  }

  handleSubmit(e:TODO) {
    e.preventDefault();
    const errors = validateForm(this.props);
    this.props.updateState({ ...this.props.unit, errors });
    if (Object.keys(errors).length === 0) {
      this.props.onLagreClick(this.props.unit);
    }
  }

  updateStorageUnit(data:TODO, key:TODO, value:TODO) {
    const newData = Object.assign({}, data);
    newData[key] = value;
    this.props.updateState(newData);
  }

  updateEnvRequirements(data:TODO, key:TODO, value:TODO) {
    const newData = Object.assign({}, data);
    newData.environmentRequirement = { ...newData.environmentRequirement, [key]: value };
    this.props.updateState(newData);
  }

  updateEnvAssessments(data:TODO, key:TODO, value:TODO) {
    const newData = Object.assign({}, data);
    newData.environmentAssessment = { ...newData.environmentAssessment, [key]: value };
    this.props.updateState(newData);
  }

  updateSecAssessments(data:TODO, key:TODO, value:TODO) {
    const newData = Object.assign({}, data);
    newData.securityAssessment = { ...newData.securityAssessment, [key]: value };
    this.props.updateState(newData);
  }

  translateEnvReqField(field:TODO) {
    return I18n.t(`musit.storageUnits.environmentRequirement.${field}`);
  }

  renderEnvReqStringFieldBlock(field:TODO) {
    return (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor={field}>
          {this.translateEnvReqField(`${field}.labelText`)}
        </label>
        <div className="col-sm-8">
          <Field
            id={field}
            tooltip={this.translateEnvReqField(`${field}.tooltip`)}
            validate="text"
            maximumLength={100}
            onChange={(value:TODO) => this.updateEnvRequirements(this.props.unit, field, value)}
            value={this.props.unit.environmentRequirement[field] || ''}
          />
        </div>
      </FormGroup>
    );
  }

  renderEnvReqTextAreaBlock(field:TODO) {
    return (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor={field}>
          {this.translateEnvReqField(`${field}.labelText`)}
        </label>
        <div className="col-sm-8">
          <TextArea
            id={field}
            numberOfRows={4}
            tooltip={this.translateEnvReqField(`${field}.tooltip`)}
            validate="text"
            maximumLength={250}
            onChange={(value:TODO) => this.updateEnvRequirements(this.props.unit, field, value)}
            value={this.props.unit.environmentRequirement[field] || ''}
          />
        </div>
      </FormGroup>
    );
  }

  renderEnvReqNumberField(field:TODO, unit:TODO, precision:TODO) {
    return (
      <Field
        id={field}
        tooltip={this.translateEnvReqField(`${field}.tooltip`)}
        validate="number"
        placeHolder={this.translateEnvReqField(`${field}.placeHolder`)}
        precision={precision}
        onChange={(value:TODO) => this.updateEnvRequirements(this.props.unit, field, value)}
        value={unit.environmentRequirement[field] || ''}
      />
    );
  }

  renderSecurityAssessmentField(field:TODO) {
    return (
      <div>
        <Checkbox
          checked={!!this.props.unit.securityAssessment[field]}
          onChange={event =>
            this.updateSecAssessments(this.props.unit, field, (event.target as TODO).checked)
          }
        >
          {I18n.t(`musit.storageUnits.securityAssessment.${field}`)}
        </Checkbox>
      </div>
    );
  }

  renderEnvironmentAssessmentField(field:TODO) {
    return (
      <div>
        <Checkbox
          checked={!!this.props.unit.environmentAssessment[field]}
          onChange={event =>
            this.updateEnvAssessments(this.props.unit, field, (event.target as TODO).checked)
          }
        >
          {I18n.t(`musit.storageUnits.environmentalAssessment.${field}`)}
        </Checkbox>
      </div>
    );
  }

  renderStorageUnitNumberField(field:TODO, unit:TODO, precision:TODO) {
    return (
      <Field
        id={field}
        tooltip={I18n.t(`musit.storageUnits.${field}.tooltip`)}
        validate="number"
        placeHolder={I18n.t(`musit.storageUnits.${field}.placeHolder`)}
        onChange={(value:TODO) => this.updateStorageUnit(this.props.unit, field, value)}
        precision={precision}
        value={unit[field]}
      />
    );
  }

  renderLastChangeData(unit:TODO) {
    const lastUpdateDate = parseISODate(unit.updatedDate).format('DD.MM.YYYY');
    const lastUpdateBy = unit.updatedByName;
    return (
      <span>
        <b>{I18n.t('musit.storageUnits.lastUpdateBy')}</b>{' '}
        {this.props.isAdd ? '' : lastUpdateBy}
        <br />
        <b>{I18n.t('musit.storageUnits.lastUpdateDate')}</b>
        {this.props.isAdd ? '' : lastUpdateDate}
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
                    onKeyDown={e => {
                      if (e.keyCode === 13 && (e.target as TODO).type !== 'textarea') {
                        e.preventDefault();
                      }
                    }}
                    onSubmit={(e:TODO) => this.handleSubmit(e)}
                  >
                    <div>
                      <h4 style={{ textAlign: 'center' }}>
                        {this.props.isAdd
                          ? `${I18n.t('musit.storageUnits.newNode')} - `
                          : ''}
                        {I18n.t('musit.storageUnits.header')}
                      </h4>
                      <Grid>
                        <Row className="row-centered">
                          <Col md={5}>
                            <Form horizontal>
                              <div className="form-group">
                                <label
                                  className="col-sm-3 control-label"
                                  htmlFor="storageUnitType"
                                >
                                  {I18n.t('musit.storageUnits.type.labelText')}
                                  {<span style={{ color: 'red' }}>*</span>}
                                </label>
                                <div className="col-sm-4">
                                  <MusitDropDownField
                                    id="type"
                                    validate="text"
                                    tooltip={I18n.t('musit.storageUnits.type.tooltip')}
                                    placeHolder={I18n.t(
                                      'musit.storageUnits.type.placeHolder'
                                    )}
                                    maximumLength={100}
                                    items={[
                                      'StorageUnit',
                                      'Room',
                                      'Building',
                                      'Organisation'
                                    ]}
                                    translateKeyPrefix={'musit.storageUnits.type.items.'}
                                    onChange={(storageType:TODO) =>
                                      this.updateStorageUnit(
                                        this.props.unit,
                                        'type',
                                        storageType
                                      )
                                    }
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
                                  {<span style={{ color: 'red' }}>*</span>}
                                </label>
                                <div className="col-sm-8">
                                  <Field
                                    id="name"
                                    tooltip={I18n.t('musit.storageUnits.name.tooltip')}
                                    validate="text"
                                    placeHolder={I18n.t(
                                      'musit.storageUnits.name.placeHolder'
                                    )}
                                    onChange={(storageUnitName:string) =>
                                      this.updateStorageUnit(
                                        this.props.unit,
                                        'name',
                                        storageUnitName
                                      )
                                    }
                                    maximumLength={100}
                                    value={this.props.unit.name || ''}
                                  />
                                </div>
                              </FormGroup>
                            </Form>
                          </Col>
                          <Col md={5}>
                            {(this.props.unit.type === 'Building' ||
                              this.props.unit.type === 'Organisation') && (
                              <Form horizontal>
                                <FormGroup>
                                  <label
                                    className="col-sm-3 control-label"
                                    htmlFor="address"
                                  >
                                    {I18n.t('musit.storageUnits.address.labelText')}
                                  </label>
                                  <div className="col-sm-8">
                                    <AddressSuggest
                                      id="addressField"
                                      value={this.props.unit.address}
                                      placeHolder="Find address"
                                      onChange={(address:TODO) => {
                                        this.updateStorageUnit(
                                          this.props.unit,
                                          'address',
                                          address
                                        );
                                      }}
                                    />
                                  </div>
                                </FormGroup>
                              </Form>
                            )}
                          </Col>
                        </Row>
                        <Row className="row-centered">
                          <Col md={5}>
                            <Form horizontal>
                              <div className="form-group">
                                <label
                                  className="col-sm-3 control-label"
                                  htmlFor="comments2"
                                >
                                  {I18n.t('musit.storageUnits.area.labelText')}
                                </label>
                                <div className="col-sm-4">
                                  {this.renderStorageUnitNumberField(
                                    'area',
                                    this.props.unit,
                                    3
                                  )}
                                </div>
                                <div className="col-sm-4">
                                  {this.renderStorageUnitNumberField(
                                    'areaTo',
                                    this.props.unit,
                                    3
                                  )}
                                </div>
                              </div>
                            </Form>
                          </Col>
                          <Col md={5}>
                            <Form horizontal>
                              <div className="form-group">
                                <label
                                  className="col-sm-3 control-label"
                                  htmlFor="controlId"
                                >
                                  {I18n.t('musit.storageUnits.height.labelText')}
                                </label>
                                <div className="col-sm-4">
                                  {this.renderStorageUnitNumberField(
                                    'height',
                                    this.props.unit,
                                    3
                                  )}
                                </div>
                                <div className="col-sm-4">
                                  {this.renderStorageUnitNumberField(
                                    'heightTo',
                                    this.props.unit,
                                    3
                                  )}
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
                                  <label
                                    className="col-sm-3 control-label"
                                    htmlFor="comments2"
                                  >
                                    {this.translateEnvReqField('temperature.labelText')}
                                  </label>
                                  <div className="col-sm-4">
                                    {this.renderEnvReqNumberField(
                                      'temperature',
                                      this.props.unit,
                                      3
                                    )}
                                  </div>
                                  <div className="col-sm-4">
                                    {this.renderEnvReqNumberField(
                                      'temperatureTolerance',
                                      this.props.unit,
                                      0
                                    )}
                                  </div>
                                </div>
                              </Form>
                            </Col>
                            <Col md={5}>
                              <Form horizontal>
                                <div className="form-group">
                                  <label
                                    className="col-sm-3 control-label"
                                    htmlFor="comments2"
                                  >
                                    {this.translateEnvReqField(
                                      'relativeHumidity.labelText'
                                    )}
                                  </label>
                                  <div className="col-sm-4">
                                    {this.renderEnvReqNumberField(
                                      'relativeHumidity',
                                      this.props.unit,
                                      3
                                    )}
                                  </div>
                                  <div className="col-sm-4">
                                    {this.renderEnvReqNumberField(
                                      'relativeHumidityTolerance',
                                      this.props.unit,
                                      0
                                    )}
                                  </div>
                                </div>
                              </Form>
                            </Col>
                          </Row>
                          <Row className="row-centered">
                            <Col md={5}>
                              <Form horizontal>
                                <div className="form-group">
                                  <label
                                    className="col-sm-3 control-label"
                                    htmlFor="comments2"
                                  >
                                    {this.translateEnvReqField('hypoxicAir.labelText')}
                                  </label>
                                  <div className="col-sm-4">
                                    {this.renderEnvReqNumberField(
                                      'hypoxicAir',
                                      this.props.unit,
                                      3
                                    )}
                                  </div>
                                  <div className="col-sm-4">
                                    {this.renderEnvReqNumberField(
                                      'hypoxicAirTolerance',
                                      this.props.unit,
                                      0
                                    )}
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
                      {this.props.unit.type === 'Room' && (
                        <Grid>
                          <Row>
                            <Col lg={5} md={5} sm={5} xs={10} /*Doesn't exist?: offset={1}*/>
                              <ControlLabel>
                                {I18n.t(
                                  'musit.storageUnits.securityAssessment.securityAssessment'
                                )}
                              </ControlLabel>
                              {this.renderSecurityAssessmentField('perimeter')}
                              {this.renderSecurityAssessmentField('theftProtection')}
                              {this.renderSecurityAssessmentField('fireProtection')}
                              {this.renderSecurityAssessmentField('waterDamage')}
                              {this.renderSecurityAssessmentField(
                                'routinesAndContingencyPlan'
                              )}
                            </Col>
                            <Col lg={5} md={5} sm={5} xs={10} /*Doesn't exist?: offset={1}*/>
                              <ControlLabel>
                                {I18n.t(
                                  'musit.storageUnits.environmentalAssessment.environmentalAssessment'
                                )}
                              </ControlLabel>
                              {this.renderEnvironmentAssessmentField('relativeHumidity')}
                              {this.renderEnvironmentAssessmentField('lightingCondition')}
                              {this.renderEnvironmentAssessmentField('temperature')}
                              {this.renderEnvironmentAssessmentField(
                                'preventiveConservation'
                              )}
                            </Col>
                          </Row>
                        </Grid>
                      )}
                      <Grid>
                        <Row>
                          <br />
                          {this.props.unit.errors &&
                            values(this.props.unit.errors).map((error, index) => {
                              return (
                                <p style={{ color: 'red' }} key={index}>
                                  {error}
                                </p>
                              );
                            })}
                          <br />
                          {this.props.loaded && (
                            <SaveCancel
                              saveDisabled={
                                this.props.loading ||
                                !this.props.rootNode ||
                                !this.props.appSession.rolesForModules
                                  .storageFacilityWrite
                              }
                              onClickSave={this.handleSubmit}
                              onClickCancel={() => this.props.goBack()}
                            />
                          )}
                        </Row>
                        <Row>
                          <Col sm={8} />
                          <Col sm={4}>{this.renderLastChangeData(this.props.unit)}</Col>
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
