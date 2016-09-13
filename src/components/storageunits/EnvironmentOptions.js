import React from 'react'
import { Checkbox, ControlLabel, Grid, Row, Col } from 'react-bootstrap'
export default class EnvironmentOptions extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    unit: React.PropTypes.shape({
      securityAssessment: React.PropTypes.shape({
        perimeter: React.PropTypes.bool,
        theftProtection: React.PropTypes.bool,
        fireProtection: React.PropTypes.bool,
        waterDamage: React.PropTypes.bool,
        routinesAndContingencyPlan: React.PropTypes.bool,
      }),
      environmentAssessment: React.PropTypes.shape({
        relativeHumidity: React.PropTypes.bool,
        lightingCondition: React.PropTypes.bool,
        temperatureAssessment: React.PropTypes.bool,
        preventiveConservation: React.PropTypes.bool,
      })
    }),
    updateSkallsikring: React.PropTypes.func.isRequired,
    updateTyverisikring: React.PropTypes.func.isRequired,
    updateBrannsikring: React.PropTypes.func.isRequired,
    updateVannskaderisiko: React.PropTypes.func.isRequired,
    updateRutinerBeredskap: React.PropTypes.func.isRequired,
    updateLuftfuktighet: React.PropTypes.func.isRequired,
    updateLysforhold: React.PropTypes.func.isRequired,
    updateTemperatur: React.PropTypes.func.isRequired,
    updatePreventivKonservering: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col lg={5} md={5} sm={5} xs={10} offset={1}>
            <ControlLabel>{this.props.translate('musit.storageUnits.securityAssessment.securityAssessment')}</ControlLabel>
            <Checkbox
              checked={this.props.unit.securityAssessment ? this.props.unit.securityAssessment.perimeter : null}
              onChange={(event) => this.props.updateSkallsikring(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.perimeterSecurity')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.securityAssessment ? this.props.unit.securityAssessment.theftProtection : null}
              onChange={(event) => this.props.updateTyverisikring(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.theftProtection')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.securityAssessment ? this.props.unit.securityAssessment.fireProtection : null}
              onChange={(event) => this.props.updateBrannsikring(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.fireProtection')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.securityAssessment ? this.props.unit.securityAssessment.waterDamage : null}
              onChange={(event) => this.props.updateVannskaderisiko(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.waterDamageAssessment')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.securityAssessment ? this.props.unit.securityAssessment.routinesAndContingencyPlan : null}
              onChange={(event) => this.props.updateRutinerBeredskap(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.routinesAndContingencyPlan')}
            </Checkbox>
          </Col>
          <Col lg={5} md={5} sm={5} xs={10} offset={1}>
            <ControlLabel>
              {this.props.translate('musit.storageUnits.environmentalAssessment.environmentalAssessment')}
            </ControlLabel>
            <Checkbox
              checked={this.props.unit.environmentAssessment ? this.props.unit.environmentAssessment.relativeHumidity : null}
              onChange={(event) => this.props.updateLuftfuktighet(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.environmentalAssessment.relativeHumidity')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.environmentAssessment ? this.props.unit.environmentAssessment.lightingCondition : null}
              onChange={(event) => this.props.updateLysforhold(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.environmentalAssessment.lightingCondition')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.environmentAssessment ? this.props.unit.environmentAssessment.temperatureAssessment : null}
              onChange={(event) => this.props.updateTemperatur(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.environmentalAssessment.temperature')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.environmentAssessment ?
                this.props.unit.environmentAssessment.preventiveConservation : null}
              onChange={(event) => this.props.updatePreventivKonservering(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.environmentalAssessment.preventiveConservation')}
            </Checkbox>
          </Col>
        </Row>
      </Grid>
    )
  }
}
