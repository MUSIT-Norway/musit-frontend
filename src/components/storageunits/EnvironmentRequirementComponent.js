import React, { Component } from 'react';
import { MusitTextArea as TextArea, MusitField as Field } from '../../components/formfields'
import { Form, Grid, Row, Col, FormGroup } from 'react-bootstrap'

export default class EnvironmentRequirementComponent extends Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    updateEnvRequirements: React.PropTypes.func.isRequired,
    environmentRequirement: React.PropTypes.object,
  };

  constructor(props) {
    super(props)
    this.state = {
      environmentRequirement: {
        temperature: '',
        temperatureTolerance: '',
        relativeHumidity: '',
        relativeHumidityTolerance: '',
        hypoxicAir: '',
        hypoxicAirTolerance: '',
        cleaning: '',
        lightingCondition: '',
        comments: ''
      }
    }

    this.temperature = {
      id: 'temperature',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.temperature.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.temperature.placeHolder'),
      precision: 3,
      onChange: (temperature) => {
        const state = {
          environmentRequirement: { ...this.state.environmentRequirement, temperature: temperature
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.temperatureTolerance = {
      id: 'temperatureTolerance',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.tooltip'),
      validate: 'number',
      precision: 0,
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.placeHolder'),
      addOnPrefix: '\u00b1',
      onChange: (temperatureTolerance) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            temperatureTolerance: temperatureTolerance
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.relativeHumidity = {
      id: 'relativeHumidity',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.placeHolder'),
      precision: 3,
      onChange: (relativeHumidity) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            relativeHumidity: relativeHumidity
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.relativeHumidityTolerance = {
      id: 'relativeHumidityTolerance',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.tooltip'),
      validate: 'number',
      precision: 0,
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.placeHolder'),
      addOnPrefix: '\u00b1',
      onChange: (relativeHumidityTolerance) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            relativeHumidityTolerance: relativeHumidityTolerance
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.hypoxicAir = {
      id: 'hypoxicAir',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.hypoxicAir.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.hypoxicAir.placeHolder'),
      precision: 3,
      onChange: (hypoxicAir) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            hypoxicAir: hypoxicAir
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.hypoxicAirTolerance = {
      id: 'hypoxicAirTolerance',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.hypoxicAirTolerance.tooltip'),
      validate: 'number',
      precision: 0,
      placeHolder: this.props.translate('musit.storageUnits.environmentRequirements.hypoxicAirTolerance.placeHolder'),
      addOnPrefix: '\u00b1',
      onChange: (hypoxicAirTolerance) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            hypoxicAirTolerance: hypoxicAirTolerance
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.cleaning = {
      id: 'cleaning',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.cleaning.tooltip'),
      validate: 'text',
      maximumLength: 100,
      onChange: (cleaning) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            cleaning: cleaning
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.lightingCondition = {
      id: 'lightningConditions',
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.lightningConditions.tooltip'),
      validate: 'text',
      maximumLength: 100,
      onChange: (lightingCondition) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            lightingCondition: lightingCondition
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }

    this.comments = {
      id: 'comments',
      numberOfRows: 4,
      tooltip: this.props.translate('musit.storageUnits.environmentRequirements.comments.tooltip'),
      validate: 'text',
      maximumLength: 250,
      onChange: (comments) => {
        const state = {
          environmentRequirement: {
            ...this.state.environmentRequirement,
            comments: comments
          }
        }
        this.setState(state)
        this.props.updateEnvRequirements(this.state.environmentRequirement)
      }
    }
  }

  componentWillReceiveProps(props) {
    this.setState(props.environmentRequirement ?
      { environmentRequirement: { ...this.state.environmentRequirement, ...props.environmentRequirement } } :
      { environmentRequirement: {} }
    )
  }

  render() {
    const renderFieldBlock = (bindValue, fieldProps, label) => (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor="comments2">{label}</label>
        <div class="col-sm-8" is="null">
          <Field {...fieldProps} value={bindValue} />
        </div>
      </FormGroup>
    )

    return (
      <div>
        <Grid>
          <Row className="row-centered">
            <Col md={5}>
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="comments2">
                    {this.props.translate('musit.storageUnits.environmentRequirements.temperature.labelText')}</label>
                  <div class="col-sm-4" is="null">
                    <Field
                      {...this.temperature}
                      value={this.state.environmentRequirement.temperature}
                    />
                  </div>
                  <div class="col-sm-4" is="null">
                    <Field {...this.temperatureTolerance} value={this.state.environmentRequirement.temperatureTolerance} />
                  </div>
                </div>
              </form>
            </Col>
            <Col md={5}>
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="comments2">
                    {this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.labelText')}</label>
                  <div class="col-sm-4" is="null">
                    <Field {...this.relativeHumidity} value={this.state.environmentRequirement.relativeHumidity} />
                  </div>
                  <div class="col-sm-4" is="null">
                    <Field
                      {...this.relativeHumidityTolerance}
                      value={this.state.environmentRequirement.relativeHumidityTolerance}
                    />
                  </div>
                </div>
              </form>
            </Col>
          </Row>
          <Row className="row-centered">
            <Col md={5}>
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="comments2">
                    {this.props.translate('musit.storageUnits.environmentRequirements.hypoxicAir.labelText')}</label>
                  <div class="col-sm-4" is="null">
                    <Field {...this.hypoxicAir} value={this.state.environmentRequirement.hypoxicAir} />
                  </div>
                  <div class="col-sm-4" is="null">
                    <Field {...this.hypoxicAirTolerance} value={this.state.environmentRequirement.hypoxicAirTolerance} />
                  </div>
                </div>
              </form>
            </Col>
            <Col md={5}>
              <Form horizontal>
                {renderFieldBlock(this.state.environmentRequirement.cleaning, this.cleaning,
                  this.props.translate('musit.storageUnits.environmentRequirements.cleaning.labelText'))}

              </Form>
            </Col>
          </Row>
          <Row className="row-centered">
            <Col md={5}>
              <Form horizontal>
                {renderFieldBlock(this.state.environmentRequirement.lightingCondition, this.lightingCondition,
                  this.props.translate('musit.storageUnits.environmentRequirements.lightningConditions.labelText'))}
              </Form>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="comments">
                    {this.props.translate('musit.storageUnits.environmentRequirements.comments.labelText')}</label>
                  <div class="col-sm-8" is="null">
                    <TextArea
                      {...this.comments}
                      value={this.state.environmentRequirement.comments}
                    />
                  </div>
                </div>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
