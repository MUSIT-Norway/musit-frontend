import React, { PropTypes } from 'react'
import { PageHeader, Panel, Grid, Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap'
import {
    ObservationFromToNumberCommentComponent
} from '../../../components/observation'
import { containsObjectWithField } from '../../../util'
import { connect } from 'react-redux'
import Language from '../../../components/language'

const mapStateToProps = () => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
  }
}

@connect(mapStateToProps)
export default class ObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedType: null,
      observations: []
    }
    this.isTypeAdded = this.isTypeAdded.bind(this)
    this.isTypeSelectable = this.isTypeSelectable.bind(this)
  }

  getTemperatureProperties() {
    return {
      id: 'temperature',
      fromLabel: this.props.translate('musit.storageUnits.environmentRequirements.temperature.labelText'),
      fromTooltip: this.props.translate('musit.storageUnits.environmentRequirements.temperature.tooltip'),
      toLabel: this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.labelText'),
      toTooltip: this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.tooltip'),
      commentLabel: this.props.translate('musit.storageUnits.environmentRequirements.temperature.comment.labelText'),
      commentTooltip: this.props.translate('musit.texts.freetext')
    }
  }

  types = ['', 'temperature', 'gas', 'flux', 'pest', 'mold']

  addObservationType(type) {
    const observations = [...this.state.observations]
    switch (type) {
      case 'temperature':
        observations.push({ type, props: this.getTemperatureProperties() });
        break
      default:
        console.log('Unknown type')
    }
    this.setState({ ...this.state, observations, selectedType: null })
  }

  isTypeAdded(typeStr) {
    return containsObjectWithField(this.state.observations, 'type', typeStr)
  }

  isTypeSelectable(type) {
    return !this.isTypeAdded(type)
  }

  renderObservationType(type, props) {
    switch (type) {
      case 'temperature':
        return this.renderTemperatureObservation(props)
      default:
        console.log('Unknown type')
    }
    return null
  }

  renderTemperatureObservation(props) {
    return (
      <div>
        <h3>Temperatur</h3>
        <ObservationFromToNumberCommentComponent {...props} />
      </div>
    )
  }

  render() {
    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row>
                <Col style={{ textAlign: 'center' }}>
                  <PageHeader>
                    Add new observation
                  </PageHeader>
                </Col>
              </Row>
              <Row>
                <form>
                  <Row>
                    <Col xs={4}>
                      <FormGroup controlId="formControlsSelect">
                        <FormControl
                          componentClass="select"
                          placeholder="select"
                          onChange={(e) => {
                            const selectedType = e.target.options[e.target.selectedIndex].value
                            this.setState({
                              ...this.state,
                              selectedType
                            })
                          }}
                        >
                          {this.types.filter(this.isTypeSelectable).map((typeValue) => {
                            return (
                              <option value={typeValue} selected={this.state.selectedType === typeValue ? 'selected' : ''}>{typeValue === '' ? 'Velg type' : typeValue}</option>
                            )
                          })}
                        </FormControl>
                      </FormGroup>
                    </Col>
                    <Col xs={4}>
                      <Button
                        bsStyle="primary"
                        onClick={() => this.addObservationType(this.state.selectedType)}
                      >
                          Legg til
                      </Button>
                    </Col>
                  </Row>
                  {this.state.observations.map((obs) => this.renderObservationType(obs.type, obs.props))}
                </form>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }
}
