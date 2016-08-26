import React, { PropTypes } from 'react'
import { PageHeader, Panel, Grid, Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap'
import {
  ObservationFromToNumberCommentComponent,
  ObservationDoubleTextAreaComponent,
  ObservationStatusPercentageComment,
  ObservationPest
} from '../../../components/observation'
import { containsObjectWithField } from '../../../util'
import FontAwesome from 'react-fontawesome'

export default class ObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.object,
    title: PropTypes.string.isRequired,
    mode: React.PropTypes.oneOf(['ADD', 'VIEW', 'EDIT']).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedType: null,
      observations: props.observations,
      doneDate: props.doneDate,
      doneBy: props.doneBy
    }
    this.isTypeSelectable = this.isTypeSelectable.bind(this)
    this.onChangeField = this.onChangeField.bind(this)
    this.onChangeTypeSelect = this.onChangeTypeSelect.bind(this)
    this.onChangePestObservation = this.onChangePestObservation.bind(this)
    this.onRemovePestObservation = this.onRemovePestObservation.bind(this)
    this.onClickAddObservation = this.onClickAddObservation.bind(this)
  }

  onChangeField(type, field, value) {
    const observations = [...this.state.observations]
    const index = observations.findIndex((elem) => elem.type === type)
    observations[index] = { ...observations[index], props: { ...observations[index].props, [field]: value } }
    this.setState({ ...this.state, observations })
  }

  onChangePestObservation(pestObservationIndex, field, value) {
    const observations = [...this.state.observations]
    const pestIndex = observations.findIndex((o) => o.type === 'pest')
    const pestObj = observations[pestIndex]
    const pestObservations = pestObj.props.observations
    pestObservations[pestObservationIndex][field] = value
    this.setState({ ...this.state, observations: observations })
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

  typeDefinitions = {
    '': { label: 'typeSelect.labelText' },
    temperature: { label: 'temperature.labelText', render: this.renderTemperature },
    gas: { label: 'gas.labelText', render: this.renderGas },
    lux: { label: 'lux.labelText', render: this.renderLux },
    cleaning: { label: 'cleaning.labelText', render: this.renderCleaning },
    pest: { label: 'pest.labelText', render: this.renderPest, props: { observations: [{ lifeCycle: '', count: '' }] } },
    mold: { label: 'mold.labelText', render: this.renderMold },
    skallsikring: { label: 'skallsikring.labelText', render: this.renderSkallsikring },
    tyverisikring: { label: 'tyverisikring.labelText', render: this.renderTyverisikring },
    brannsikring: { label: 'brannsikring.labelText', render: this.renderBrannsikring },
    vannskaderisiko: { label: 'vannskaderisiko.labelText', render: this.renderVannskaderisiko },
    rh: { label: 'rh.labelText', render: this.renderRelativeHumidity },
    hypoxicAir: { label: 'hypoxicAir.labelText', render: this.renderHypoxicAir },
    alcohol: { label: 'alcohol.labelText', render: this.renderAlcohol }
  }

  addObservationType(typeToAdd, props = {}) {
    const type = typeToAdd || this.state.selectedType
    if (!type || type === '') {
      return
    }
    const typeProps = { ...props, ...this.typeDefinitions[type].props }
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
    return this.typeDefinitions[observation.type].render.bind(this)(observation.props)
  }

  renderAlcohol(props) {
    return (
      <ObservationStatusPercentageComment
        {...props}
        statusOptionValues={[
          this.props.translate('alcohol.statusItems.dryed'),
          this.props.translate('alcohol.statusItems.allmostDryed'),
          this.props.translate('alcohol.statusItems.someDryed'),
          this.props.translate('alcohol.statusItems.minorDryed'),
          this.props.translate('alcohol.statusItems.satisfactory')
        ]}
      />
    )
  }

  renderPest(props) {
    return (
      <ObservationPest
        disabled={this.props.mode === 'VIEW'}
        canEdit={this.props.mode !== 'VIEW'}
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
          rightValue: props.commentValue,
          rightLabel: this.props.translate('musit.observation.pest.commentsLabel'),
          rightTooltip: this.props.translate('musit.observation.pest.commentsTooltip'),
          onChangeRight: (value) => this.onChangeField('pest', 'commentValue', value),
        }}
        newButton={{
          label: this.props.translate('musit.observation.newButtonLabel'),
          onClick: this.onClickAddObservation
        }}
      />
    )
  }

  renderBrannsikring(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"brannsikring"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.tooltip')}
        onChangeLeft={(value) => this.onChangeField('brannsikring', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.brannsikring.comment')}
        onChangeRight={(value) => this.onChangeField('brannsikring', 'rightValue', value)}
      />
    )
  }

  renderVannskaderisiko(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"vannskaderisiko"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.tooltip')}
        onChangeLeft={(value) => this.onChangeField('vannskaderisiko', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.vannskaderisiko.comment')}
        onChangeRight={(value) => this.onChangeField('vannskaderisiko', 'rightValue', value)}
      />
    )
  }

  renderTyverisikring(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"tyverisikring"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.tooltip')}
        onChangeLeft={(value) => this.onChangeField('tyverisikring', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.tyverisikring.comment')}
        onChangeRight={(value) => this.onChangeField('tyverisikring', 'rightValue', value)}
      />
    )
  }

  renderSkallsikring(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"skallsikring"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.tooltip')}
        onChangeLeft={(value) => this.onChangeField('skallsikring', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.skallsikring.comment')}
        onChangeRight={(value) => this.onChangeField('skallsikring', 'rightValue', value)}
      />
    )
  }

  renderMold(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"mold"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.mold.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.mold.tooltip')}
        onChangeLeft={(value) => this.onChangeField('mold', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.mold.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.mold.comment')}
        onChangeRight={(value) => this.onChangeField('mold', 'rightValue', value)}
      />
    )
  }

  renderCleaning(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"cleaning"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.tooltip')}
        onChangeLeft={(value) => this.onChangeField('cleaning', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.cleaning.comment')}
        onChangeRight={(value) => this.onChangeField('cleaning', 'rightValue', value)}
      />
    )
  }

  renderLux(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"lux"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.tooltip')}
        onChangeLeft={(value) => this.onChangeField('lux', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.lightCondition.comment')}
        onChangeRight={(value) => this.onChangeField('lux', 'rightValue', value)}
      />
    )
  }

  renderGas(props) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        id={"gas"}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate('musit.storageUnits.environmentRequirements.gas.labelText')}
        leftTooltip={this.props.translate('musit.storageUnits.environmentRequirements.gas.tooltip')}
        onChangeLeft={(value) => this.onChangeField('gas', 'leftValue', value)}
        rightLabel={this.props.translate('musit.storageUnits.environmentRequirements.gas.comment')}
        rightTooltip={this.props.translate('musit.storageUnits.environmentRequirements.gas.comment')}
        onChangeRight={(value) => this.onChangeField('gas', 'rightValue', value)}
      />
    )
  }

  renderHypoxicAir(props) {
    return (
      <ObservationFromToNumberCommentComponent
        {...props}
        id={"hypoxicAir"}
        disabled={this.props.mode === 'VIEW'}
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

  renderRelativeHumidity(props) {
    return (
      <ObservationFromToNumberCommentComponent
        {...props}
        id={"rh"}
        disabled={this.props.mode === 'VIEW'}
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

  renderTemperature(props) {
    return (
      <ObservationFromToNumberCommentComponent
        {...props}
        id={"temperature"}
        disabled={this.props.mode === 'VIEW'}
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
                    {this.props.title}
                  </PageHeader>
                </Col>
              </Row>
              <Row>
                <form>
                  {this.props.mode !== 'ADD' ? '' : (
                    <Row>
                      <Col xs={4}>
                        <FormGroup controlId="formControlsSelect">
                          <FormControl
                            componentClass="select"
                            placeholder="select"
                            onChange={this.onChangeTypeSelect}
                            value={this.state.selectedType ? this.state.selectedType : ''}
                          >
                            {Object.keys(this.typeDefinitions).filter(this.isTypeSelectable).map((type, index) => {
                              return (
                                <option key={index} value={type}>
                                  {this.props.translate(`musit.observation.page.${this.typeDefinitions[type].label}`)}
                                </option>
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
                  )}
                  {this.state.observations.map((obs, index) => {
                    return (
                      <div key={index}>
                        <h3>
                          {this.props.translate(`musit.observation.page.${this.typeDefinitions[obs.type].label}`)}
                          &nbsp;
                          {this.props.mode !== 'ADD' ? '' : (
                            <a onClick={() => this.removeObservation(index)}>
                              <FontAwesome name="times" />
                            </a>
                          )}
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
