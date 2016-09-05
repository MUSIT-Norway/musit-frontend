import React from 'react'
import { Checkbox, ControlLabel, Grid, Row, Col } from 'react-bootstrap'
export default class EnvironmentOptions extends React.Component {
  static propTypes = {
    translate: React.PropTypes.func.isRequired,
    unit: React.PropTypes.shape({
      sikringSkallsikring: React.PropTypes.bool,
      sikringTyverisikring: React.PropTypes.bool,
      sikringBrannsikring: React.PropTypes.bool,
      sikringVannskaderisiko: React.PropTypes.bool,
      sikringRutineOgBeredskap: React.PropTypes.bool,
      bevarLuftfuktOgTemp: React.PropTypes.bool,
      bevarLysforhold: React.PropTypes.bool,
      temperatur: React.PropTypes.bool,
      bevarPrevantKons: React.PropTypes.bool,
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
        <Row styleClass="row-centered">
          <Col lg={6} md={6} sm={6} xs={12}>
            <ControlLabel>{this.props.translate('musit.storageUnits.securityAssessment.securityAssessment')}</ControlLabel>
            <Checkbox
              checked={this.props.unit.sikringSkallsikring}
              onChange={(event) => this.props.updateSkallsikring(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.perimeterSecurity')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringTyverisikring}
              onChange={(event) => this.props.updateTyverisikring(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.theftProtection')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringBrannsikring}
              onChange={(event) => this.props.updateBrannsikring(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.fireProtection')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringVannskaderisiko}
              onChange={(event) => this.props.updateVannskaderisiko(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.waterDamageAssessment')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.sikringRutineOgBeredskap}
              onChange={(event) => this.props.updateRutinerBeredskap(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.securityAssessment.routinesAndContingencyPlan')}
            </Checkbox>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12}>
            <ControlLabel>
              {this.props.translate('musit.storageUnits.environmentalAssessment.environmentalAssessment')}
            </ControlLabel>
            <Checkbox
              checked={this.props.unit.bevarLuftfuktOgTemp}
              onChange={(event) => this.props.updateLuftfuktighet(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.environmentalAssessment.relativeHumidity')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.bevarLysforhold}
              onChange={(event) => this.props.updateLysforhold(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.environmentalAssessment.lightingCondition')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.temperatur}
              onChange={(event) => this.props.updateTemperatur(event.target.checked)}
            >
              {this.props.translate('musit.storageUnits.environmentalAssessment.temperature')}
            </Checkbox>
            <Checkbox
              checked={this.props.unit.bevarPrevantKons}
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
