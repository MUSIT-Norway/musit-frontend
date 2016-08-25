import React, { PropTypes } from 'react'
import { PageHeader, Panel, Grid, Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap'
import {
  ObservationFromToNumberCommentComponent,
  ObservationDoubleTextAreaComponent,
  ObservationStatusPercentageComment,
  ObservationPest
} from '../../../components/observation'
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
      observations: [
        /* an example
        {
          type: 'temperature',
          props: {
            fromValue: '12,23',
            toValue: '12',
            commentValue: 'This was very bad'
          }
        }
        */
      ]
    }
    this.isTypeSelectable = this.isTypeSelectable.bind(this)
    this.onChangeField = this.onChangeField.bind(this)
    this.addObservationType = this.addObservationType.bind(this)
    this.renderObservation = this.renderObservation.bind(this)
    this.renderTemperatureObservation = this.renderTemperatureObservation.bind(this)
    this.onChangeTypeSelect = this.onChangeTypeSelect.bind(this)
    this.onChangePestObservation = this.onChangePestObservation.bind(this)
    this.onRemovePestObservation = this.onRemovePestObservation.bind(this)
    this.onClickAddObservation = this.onClickAddObservation.bind(this)
    this.typeDisplayMap = {}
    this.typePropsMap = {}
    this.types.forEach((t) => {
      this.typeDisplayMap[t.value] = this.props.translate(t.display, false)
      this.typePropsMap[t.value] = t.props
    })
  }

  onChangeField(type, field, value) {
    const observations = [...this.state.observations]
    const index = observations.findIndex((elem) => elem.type === type)
    observations[index] = { ...observations[index], props: { ...observations[index].props, [field]: value } }
    this.setState({ ...this.state, observations })
  }

  onChangePestObservation(pestObservationIndex, field, value) {
    const observationsCopy = [...this.state.observations]
    const pestIndex = observationsCopy.findIndex((o) => o.type === 'pest')
    const pestObj = observationsCopy[pestIndex]
    const pestObservations = pestObj.props.observations
    pestObservations[pestObservationIndex][field] = value
    this.setState({ ...this.state, observations: observationsCopy })
  }

  onRemovePestObservation(pestObservationIndex) {
    const observationsCopy = [...this.state.observations]
    const pestIndex = observationsCopy.findIndex((o) => o.type === 'pest')
    const pestObj = observationsCopy[pestIndex]
    pestObj.props.observations = pestObj.props.observations.filter((elm, index) => index !== pestObservationIndex)
    this.setState({ ...this.state, observations: observationsCopy })
  }

  onClickAddObservation() {
    const observationsCopy = [...this.state.observations]
    const pestIndex = observationsCopy.findIndex((o) => o.type === 'pest')
    const pestObj = observationsCopy[pestIndex]
    const pestObservations = pestObj.props.observations
    pestObservations.unshift({ lifeCycle: '', count: '' })
    this.setState({ ...this.state, observations: observationsCopy })
  }

  onChangeTypeSelect(e) {
    this.setState({
      ...this.state,
      selectedType: e.target.options[e.target.selectedIndex].value
    })
  }

  /**
   * This is configuration data. Not to be used directly in code for rendering etc.
   * Referenced in constructor for creating a typeDisplayMap object.
   *
   * This array contains object with:
   *
   *   value <- the type identificator
   *   display <- the type label key (which needs to be translated)
   *
   * @type {*[]}
   */
  types = [
    {
      value: '',
      display: 'musit.texts.makeChoice'
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
      display: 'Pest',
      props: {
        observations: [{ lifeCycle: '', count: '' }]
      }
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


  addObservationType(typeToAdd, props = {}) {
    const type = typeToAdd || this.state.selectedType
    const typeProps = { ...props, ...this.typePropsMap[type] }
    const observations = [{ type, props: typeProps }, ...this.state.observations]
    this.setState({ ...this.state, observations, selectedType: null })
  }

  isTypeSelectable(typeStr) {
    return !containsObjectWithField(this.state.observations, 'type', typeStr)
  }

  // TODO is there a better way to remove an element completely from an array?
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
      case 'pest':
        return this.renderPestObservation(props)
      case 'alcohol':
        return this.renderAlcoholObservation(props)
      default:
        console.log('Unknown type')
    }
    return null
  }

  renderAlcoholObservation(props) {
    return (
      <ObservationStatusPercentageComment {...props} />
    )
  }

  renderPestObservation(props) {
    return (
      <ObservationPest
        observations={props.observations}
        lifeCycle={{
          label: this.props.translate('musit.observation.pest.lifeCycleLabel'),
          placeHolder: this.props.translate('musit.texts.makeChoice'),
          tooltip: this.props.translate('musit.observation.pest.lifeCycleTooltip'),
          onChange: (index, value) => this.onChangePestObservation(index, 'lifeCycle', value),
          onRemove: (index) => this.onRemovePestObservation(index),
          items: [
            this.props.translate('musit.observation.lifeCycleLabelMenu.puppe'),
            this.props.translate('musit.observation.lifeCycleLabelMenu.adult'),
            this.props.translate('musit.observation.lifeCycleLabelMenu.puppeskin'),
            this.props.translate('musit.observation.lifeCycleLabelMenu.larva'),
            this.props.translate('musit.observation.lifeCycleLabelMenu.egg')
          ]
        }}
        count={{
          label: this.props.translate('musit.observation.pest.countLabel'),
          placeHolder: this.props.translate('musit.observation.pest.countPlaceHolder'),
          tooltip: this.props.translate('musit.observation.pest.countTooltip'),
          onChange: (index, value) => this.onChangePestObservation(index, 'count', value)
        }}
        comments={{
          leftValue: props.identificationValue,
          leftLabel: this.props.translate('musit.observation.pest.identificationLabel'),
          leftTooltip: this.props.translate('musit.observation.pest.identificationTooltip'),
          onChangeLeft: (value) => this.onChangeField('pest', 'identificationValue', value),
          rightValue: props.rightValue,
          rightLabel: this.props.translate('musit.observation.pest.commentsLabel'),
          rightTooltip: this.props.translate('musit.observation.pest.commentsTooltip'),
          onChangeRight: (value) => this.onChangeField('pest', 'commentsValue', value),
        }}
        newButton={{
          label: this.props.translate('musit.observation.newButtonLabel'),
          onClick: this.onClickAddObservation
        }}
      />
    )
  }

  renderBrannsikringObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"brannsikring"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.tooltip')}
        onChangeLeft={(value) => this.onChangeField('brannsikring', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.comment')}
        onChangeRight={(value) => this.onChangeField('brannsikring', 'rightValue', value)}
      />
    )
  }

  renderVannskaderisikoObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"vannskaderisiko"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.tooltip')}
        onChangeLeft={(value) => this.onChangeField('vannskaderisiko', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.comment')}
        onChangeRight={(value) => this.onChangeField('vannskaderisiko', 'rightValue', value)}
      />
    )
  }

  renderTyverisikringObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"tyverisikring"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.tooltip')}
        onChangeLeft={(value) => this.onChangeField('tyverisikring', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.comment')}
        onChangeRight={(value) => this.onChangeField('tyverisikring', 'rightValue', value)}
      />
    )
  }

  renderSkallsikringObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"skallsikring"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.tooltip')}
        onChangeLeft={(value) => this.onChangeField('skallsikring', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.comment')}
        onChangeRight={(value) => this.onChangeField('skallsikring', 'rightValue', value)}
      />
    )
  }

  renderMoldObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"mold"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.mold.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.mold.tooltip')}
        onChangeLeft={(value) => this.onChangeField('mold', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.mold.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.mold.comment')}
        onChangeRight={(value) => this.onChangeField('mold', 'rightValue', value)}
      />
    )
  }

  renderCleaningObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"cleaning"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.tooltip')}
        onChangeLeft={(value) => this.onChangeField('cleaning', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.comment')}
        onChangeRight={(value) => this.onChangeField('cleaning', 'rightValue', value)}
      />
    )
  }

  renderLuxObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"lux"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.tooltip')}
        onChangeLeft={(value) => this.onChangeField('lux', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.comment')}
        onChangeRight={(value) => this.onChangeField('lux', 'rightValue', value)}
      />
    )
  }

  renderGasObservation(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"gas"}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.gas.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.gas.tooltip')}
        onChangeLeft={(value) => this.onChangeField('gas', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.gas.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.gas.comment')}
        onChangeRight={(value) => this.onChangeField('gas', 'rightValue', value)}
      />
    )
  }

  renderHypoxicAirObservation(props) {
    return (
      <ObservationFromToNumberCommentComponent
        {...props}
        id={"hypoxicAir"}
        fromLabel={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.labelText')}
        fromTooltip={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.tooltip')}
        onChangeFrom={(value) => this.onChangeField('hypoxicAir', 'fromValue', value)}
        toLabel={this.props.translate('musit.storageUnits.environmentRequirements.inertAirTolerance.labelText')}
        toTooltip={this.props.translate('musit.storageUnits.environmentRequirements.inertAirTolerance.tooltip')}
        onChangeTo={(value) => this.onChangeField('hypoxicAir', 'toValue', value)}
        commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.comment')}
        commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.inertAir.comment')}
        commentPlaceholder={this.props.translate('musit.texts.freetext')}
        onChangeComment={(value) => this.onChangeField('hypoxicAir', 'commentValue', value)}
      />
    )
  }

  renderRelativeHumidityObservation(props) {
    return (
      <ObservationFromToNumberCommentComponent
        {...props}
        id={"rh"}
        fromLabel={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.labelText')}
        fromTooltip={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.tooltip')}
        onChangeFrom={(value) => this.onChangeField('rh', 'fromValue', value)}
        toLabel={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.labelText')}
        toTooltip={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidityTolerance.tooltip')}
        onChangeTo={(value) => this.onChangeField('rh', 'toValue', value)}
        commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.comment')}
        commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.relativeHumidity.comment')}
        commentPlaceholder={this.props.translate('musit.texts.freetext')}
        onChangeComment={(value) => this.onChangeField('rh', 'commentValue', value)}
      />
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
                          onChange={this.onChangeTypeSelect}
                          value={this.state.selectedType ? this.state.selectedType : ''}
                        >
                          {Object.keys(this.typeDisplayMap).filter(this.isTypeSelectable).map((typeStr, index) => {
                            return (
                              <option key={index} value={typeStr}>{this.typeDisplayMap[typeStr]}</option>
                            )
                          })}
                        </FormControl>
                      </FormGroup>
                    </Col>
                    <Col xs={4}>
                      <Button
                        bsStyle="primary"
                        onClick={() => this.addObservationType()}
                      >
                          Legg til
                      </Button>
                    </Col>
                  </Row>
                  {this.state.observations.map((obs, index) => {
                    return (
                      <div key={index}>
                        <h3>
                          {this.typeDisplayMap[obs.type]}
                          &nbsp;
                          <a onClick={() => this.removeObservation(index)}>
                            <FontAwesome name="times" />
                          </a>
                        </h3>
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
