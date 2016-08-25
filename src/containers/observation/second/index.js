import React, { PropTypes } from 'react'
import { PageHeader, Panel, Grid, Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap'
import { ObservationFromToNumberCommentComponent, ObservationDoubleTextAreaComponent } from '../../../components/observation'
import { containsObjectWithField } from '../../../util'
import { connect } from 'react-redux'
import Language from '../../../components/language'
import FontAwesome from 'react-fontawesome'

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
    this.onChangeField = this.onChangeField.bind(this)
    this.addObservationType = this.addObservationType.bind(this)
    this.renderObservation = this.renderObservation.bind(this)
    this.renderTemperatureObservation = this.renderTemperatureObservation.bind(this)
    this.typeDisplayMap = {}
    this.types.forEach((t) => {
      this.typeDisplayMap[t.value] = t.display
    })
  }

  onChangeField(type, field, value) {
    const observations = [...this.state.observations]
    const index = observations.findIndex((elem) => elem.type === type)
    observations[index] = { ...observations[index], props: { ...observations[index].props, [field]: value } }
    this.setState({ ...this.state, observations })
  }

  types = [
    {
      value: '',
      display: 'Velg type'
    },
    {
      value: 'temperature',
      display: 'Temperature'
    },
    {
      value: 'gas',
      display: 'Gas'
    },
    {
      value: 'lux',
      display: 'LUX'
    },
    {
      value: 'cleaning',
      display: 'Cleaning'
    },
    {
      value: 'pest',
      display: 'Pest'
    },
    {
      value: 'mold',
      display: 'Mold'
    },
    {
      value: 'skallsikring',
      display: 'Skallsikring'
    },
    {
      value: 'tyverisikring',
      display: 'Tyverisikring'
    },
    {
      value: 'brannsikring',
      display: 'Brannsikring'
    },
    {
      value: 'vannskaderisiko',
      display: 'Vannskaderisiko'
    },
    {
      value: 'rh',
      display: 'Relative humidity'
    },
    {
      value: 'hypoxicAir',
      display: 'HypoxicAir'
    },
    {
      value: 'alcohol',
      display: 'Alcohol'
    }
  ]


  addObservationType(type, props = {}) {
    const observations = [...this.state.observations, { type, props }]
    this.setState({ ...this.state, observations, selectedType: null })
  }

  isTypeAdded(typeStr) {
    return containsObjectWithField(this.state.observations, 'type', typeStr)
  }

  isTypeSelectable(typeObj) {
    return !this.isTypeAdded(typeObj.value)
  }

  removeObservation(index) {
    const observations = this.state.observations
    delete observations[index]
    this.setState({ ...this.state, observations: observations.filter((o) => o !== undefined) })
  }

  renderObservation(observation) {
    const props = observation.props
    switch (observation.type) {
      case 'temperature':
        return this.renderTemperatureObservation(props)
      case 'rh':
        return this.renderRelativeHumidityObservation(props)
      case 'hypoxicAir':
        return this.renderHypoxicAirObservation(props)
      case 'lux':
        return this.renderLuxObservation(props)
      case 'gas':
        return this.renderGasObservation(props)
      case 'cleaning':
        return this.renderCleaningObservation(props)
      case 'mold':
        return this.renderMoldObservation(props)
      case 'skallsikring':
        return this.renderSkallsikringObservation(props)
      case 'tyverisikring':
        return this.renderTyverisikringObservation(props)
      case 'brannsikring':
        return this.renderBrannsikringObservation(props)
      case 'vannskaderisiko':
        return this.renderVannskaderisikoObservation(props)
      default:
        console.log('Unknown type')
    }
    return null
  }

  renderBrannsikringObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderVannskaderisikoObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderTyverisikringObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderSkallsikringObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderMoldObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderCleaningObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderLuxObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderGasObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent {...props} />
    )
  }

  renderHypoxicAirObservation(props) {
    return (
      <ObservationFromToNumberCommentComponent {...props} />
    )
  }

  renderRelativeHumidityObservation(props) {
    return (
      <ObservationFromToNumberCommentComponent {...props} />
    )
  }

  renderTemperatureObservation(props) {
    return (
      <ObservationFromToNumberCommentComponent
        {...props}
        id={"temperature"}
        fromLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperature.labelText')}
        fromTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperature.tooltip')}
        onChangeFrom={(value) => this.onChangeField('temperature', 'fromValue', value)}
        toLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.labelText')}
        toTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperatureTolerance.tooltip')}
        onChangeTo={(value) => this.onChangeField('temperature', 'toValue', value)}
        commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.temperature.comment')}
        commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.temperature.comment')}
        commentPlaceholder={this.props.translate('musit.texts.freetext')}
        onChangeComment={(value) => this.onChangeField('temperature', 'commentValue', value)}
      />
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
                            this.setState({
                              ...this.state,
                              selectedType: e.target.options[e.target.selectedIndex].value
                            })
                          }}
                          value={this.state.selectedType ? this.state.selectedType : ''}
                        >
                          {this.types.filter(this.isTypeSelectable).map((typeObj, index) => {
                            return (
                              <option key={index} value={typeObj.value}>{typeObj.display}</option>
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
                  {this.state.observations.map((obs, index) => {
                    return (
                      <div key={index}>
                        <h3>{this.typeDisplayMap[obs.type]}&nbsp;<a onClick={() => this.removeObservation(index)}><FontAwesome name="trash-o" /></a></h3>
                        {this.renderObservation(obs)}
                        <hr />
                      </div>
                    )
                  })}
                </form>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }
}
