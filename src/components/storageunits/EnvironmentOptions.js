import React from 'react'
import { Checkbox, ControlLabel, Grid, Row, Col } from 'react-bootstrap'
export default class EnvironmentOptions extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    unit: React.PropTypes.shape({
      securityAssessment: React.PropTypes.shape({
        perimeterSecurity: React.PropTypes.bool,
        theftProtection: React.PropTypes.bool,
        fireProtection: React.PropTypes.bool,
        waterDamageAssessment: React.PropTypes.bool,
        routinesAndContingencyPlan: React.PropTypes.bool,
      }),
      environmentAssessment: React.PropTypes.shape({
        relativeHumidity: React.PropTypes.bool,
        lightingCondition: React.PropTypes.bool,
        temperatureAssessment: React.PropTypes.bool,
        preventiveConservation: React.PropTypes.bool,
      })
    }),
    updateSecurityAssessment: React.PropTypes.func.isRequired,
    updateEnvironmentAssessment: React.PropTypes.func.isRequired
  }

  renderSecurityAssessmentField(field) {
    return (
        <div>
          <Checkbox
              checked={!!this.props.unit.securityAssessment[field]}
              onChange={(event) => this.props.updateSecurityAssessment(field, event.target.checked)}
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
              onChange={(event) => this.props.updateEnvironmentAssessment(field, event.target.checked)}
          >
            {this.props.translate(`musit.storageUnits.environmentalAssessment.${field}`)}
          </Checkbox>
        </div>
    )
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col lg={5} md={5} sm={5} xs={10} offset={1}>
            <ControlLabel>{this.props.translate('musit.storageUnits.securityAssessment.securityAssessment')}</ControlLabel>
            {this.renderSecurityAssessmentField('perimeterSecurity')}
            {this.renderSecurityAssessmentField('theftProtection')}
            {this.renderSecurityAssessmentField('fireProtection')}
            {this.renderSecurityAssessmentField('waterDamageAssessment')}
            {this.renderSecurityAssessmentField('routinesAndContingencyPlan')}
          </Col>
          <Col lg={5} md={5} sm={5} xs={10} offset={1}>
            <ControlLabel>
              {this.props.translate('musit.storageUnits.environmentalAssessment.environmentalAssessment')}
            </ControlLabel>
            {this.renderEnvironmentAssessmentField('relativeHumidity')}
            {this.renderEnvironmentAssessmentField('lightingCondition')}
            {this.renderEnvironmentAssessmentField('temperatureAssessment')}
            {this.renderEnvironmentAssessmentField('preventiveConservation')}
          </Col>
        </Row>
      </Grid>
    )
  }
}
