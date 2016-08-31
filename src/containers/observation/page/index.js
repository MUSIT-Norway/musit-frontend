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
import { hashHistory } from 'react-router'
import SaveCancel from '../../../components/formfields/saveCancel/SaveCancel'
// import DatePicker from 'react-bootstrap-date-picker'
// import ActorSuggest from '../../../components/actor'

export default class ObservationPage extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.object,
    registeredDate: PropTypes.string,
    registeredBy: PropTypes.string,
    suggest: PropTypes.arrayOf(PropTypes.object),
    onSaveObservation: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    mode: React.PropTypes.oneOf(['ADD', 'VIEW', 'EDIT']).isRequired,
  }

  static defaultPestData = { observations: [{ lifeCycle: '', count: '' }] }

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

  onChangeField(field, value, index) {
    const observations = [...this.state.observations]
    observations[index] = { ...observations[index], data: { ...observations[index].data, [field]: value } }
    this.setState({ ...this.state, observations })
  }

  onChangePestObservation(pestObservationIndex, field, value, pestIndex) {
    const observations = [...this.state.observations]
    const pestObj = observations[pestIndex]
    const pestObservations = pestObj.data.observations
    pestObservations[pestObservationIndex][field] = value
    this.setState({ ...this.state, observations: observations })
  }

  onRemovePestObservation(pestObservationIndex, pestIndex) {
    const observationsCopy = [...this.state.observations]
    const pestObj = observationsCopy[pestIndex]
    pestObj.data.observations = pestObj.data.observations.filter((elm, index) => index !== pestObservationIndex)
    this.setState({ ...this.state, observations: observationsCopy })
  }

  onClickAddObservation(pestIndex) {
    const observationsCopy = [...this.state.observations]
    const pestObj = observationsCopy[pestIndex]
    const pestObservations = pestObj.data.observations
    pestObservations.unshift({ lifeCycle: '', count: '' })
    this.setState({ ...this.state, observations: observationsCopy })
  }

  onChangeTypeSelect(e) {
    this.setState({
      ...this.state,
      selectedType: e.target.options[e.target.selectedIndex].value
    })
  }

  getLabel(key) {
    return this.props.translate(`musit.observation.page.${key}`)
  }

  typeDefinitions = {
    '': { label: 'typeSelect.labelText' },
    gas: { label: 'gas.labelText', render: this.renderDoubleTextArea },
    lux: { label: 'lux.labelText', render: this.renderDoubleTextArea },
    cleaning: { label: 'cleaning.labelText', render: this.renderDoubleTextArea },
    pest: { label: 'pest.labelText', render: this.renderPest, data: ObservationPage.defaultPestData },
    mold: { label: 'mold.labelText', render: this.renderDoubleTextArea },
    skallsikring: { label: 'skallsikring.labelText', render: this.renderDoubleTextArea },
    tyverisikring: { label: 'tyverisikring.labelText', render: this.renderDoubleTextArea },
    brannsikring: { label: 'brannsikring.labelText', render: this.renderDoubleTextArea },
    vannskaderisiko: { label: 'vannskaderisiko.labelText', render: this.renderDoubleTextArea },
    relativeHumidity: { label: 'rh.labelText', render: this.renderFromToNumberComment },
    inertAir: { label: 'hypoxicAir.labelText', render: this.renderFromToNumberComment },
    temperature: { label: 'temperature.labelText', render: this.renderFromToNumberComment },
    alcohol: { label: 'alcohol.labelText', render: this.renderAlcohol }
  }

  addObservationType(typeToAdd, data = {}) {
    const type = typeToAdd || this.state.selectedType
    if (!type || type === '') {
      return
    }
    const typeProps = { ...data, ...this.typeDefinitions[type].data }
    const observations = [{ type, data: typeProps }, ...this.state.observations]
    this.setState({ ...this.state, observations, selectedType: null })
  }

  isTypeSelectable(typeStr) {
    return !containsObjectWithField(this.state.observations, 'type', typeStr)
  }

  removeObservation(index) {
    const observations = this.state.observations
    this.setState({ ...this.state, observations: observations.filter((o, i) => i !== index) })
  }

  renderObservation(observation, index) {
    return this.typeDefinitions[observation.type].render.bind(this)(observation.type, observation.data, index)
  }

  renderAlcohol(id, props, index) {
    return (
      <ObservationStatusPercentageComment
        {...props}
        statusValue={props.status}
        statusLabel={this.props.translate('musit.observation.page.alcohol.statusLabel')}
        statusTooltip={this.props.translate('musit.observation.page.alcohol.statusTooltip')}
        statusPlaceHolder={this.props.translate('musit.observation.page.alcohol.statusPlaceHolder')}
        statusItems={[
          this.props.translate('musit.observation.page.alcohol.statusItems.dryed'),
          this.props.translate('musit.observation.page.alcohol.statusItems.allmostDryed'),
          this.props.translate('musit.observation.page.alcohol.statusItems.someDryed'),
          this.props.translate('musit.observation.page.alcohol.statusItems.minorDryed'),
          this.props.translate('musit.observation.page.alcohol.statusItems.satisfactory')
        ]}
        statusOnChange={(value) => this.onChangeField('status', value, index)}
        volumeValue={props.volume}
        volumeLabel={this.props.translate('musit.storageUnits.environmentRequirements.alcohol.volumeLabel')}
        volumeTooltip={this.props.translate('musit.storageUnits.environmentRequirements.alcohol.volumeTooltip')}
        volumePlaceHolder={this.props.translate('musit.storageUnits.environmentRequirements.alcohol.volumePlaceHolder')}
        volumeOnChange={(value) => this.onChangeField('volume', value, index)}
        commentValue={props.comment}
        commentLabel={this.props.translate('musit.storageUnits.environmentRequirements.alcohol.commentLabel')}
        commentTooltip={this.props.translate('musit.storageUnits.environmentRequirements.alcohol.commentTooltip')}
        commentPlaceHolder={this.props.translate('musit.storageUnits.environmentRequirements.alcohol.commentPlaceHolder')}
        commentOnChange={(value) => this.onChangeField('comment', value, index)}
      />
    )
  }

  renderPest(id, props, index) {
    return (
      <ObservationPest
        disabled={this.props.mode === 'VIEW'}
        canEdit={this.props.mode !== 'VIEW'}
        observations={props.observations}
        lifeCycleLabel={this.props.translate('musit.observation.pest.lifeCycleLabel')}
        lifeCyclePlaceHolder={this.props.translate('musit.texts.makeChoice')}
        lifeCycleTooltip={this.props.translate('musit.observation.pest.lifeCycleTooltip')}
        lifeCycleOnChange={(lifeCycleIndex, value) => this.onChangePestObservation(lifeCycleIndex, 'lifeCycle', value, index)}
        lifeCycleOnRemove={(lifeCycleIndex) => this.onRemovePestObservation(lifeCycleIndex, index)}
        lifeCycleItems={[
          this.props.translate('musit.observation.lifeCycleLabelMenu.puppe'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.adult'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.puppeskin'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.larva'),
          this.props.translate('musit.observation.lifeCycleLabelMenu.egg')
        ]}
        countLabel={this.props.translate('musit.observation.pest.countLabel')}
        countPlaceHolder={this.props.translate('musit.observation.pest.countPlaceHolder')}
        countTooltip={this.props.translate('musit.observation.pest.countTooltip')}
        countOnChange={(countIndex, value) => this.onChangePestObservation(countIndex, 'count', value, index)}
        commentsLeftValue={props.identificationValue}
        commentsLeftLabel={this.props.translate('musit.observation.pest.identificationLabel')}
        commentsLeftTooltip={this.props.translate('musit.observation.pest.identificationTooltip')}
        commentsLeftPlaceHolder={this.props.translate('musit.observation.pest.identificationPlaceHolder')}
        commentsOnChangeLeft={(value) => this.onChangeField('identificationValue', value, index)}
        commentsRightValue={props.commentValue}
        commentsRightLabel={this.props.translate('musit.observation.pest.commentsLabel')}
        commentsRightTooltip={this.props.translate('musit.observation.pest.commentsTooltip')}
        commentsRightPlaceHolder={this.props.translate('musit.observation.pest.commentsPlaceHolder')}
        commentsOnChangeRight={(value) => this.onChangeField('commentValue', value, index)}
        newButtonLabel={this.props.translate('musit.observation.newButtonLabel')}
        newButtonOnClick={() => this.onClickAddObservation(index)}
      />
    )
  }

  renderDoubleTextArea(id, props, index) {
    return (
      <ObservationDoubleTextAreaComponent
        {...props}
        disabled={this.props.mode === 'VIEW'}
        leftLabel={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.labelText`)}
        leftTooltip={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.tooltip`)}
        leftPlaceHolder={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.placeHolder`)}
        onChangeLeft={(value) => this.onChangeField('leftValue', value, index)}
        rightLabel={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.comment`)}
        rightTooltip={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.comment`)}
        rightPlaceHolder={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.commentPlaceHolder`)}
        onChangeRight={(value) => this.onChangeField('rightValue', value, index)}
      />
    )
  }

  renderFromToNumberComment(id, props, index) {
    return (
      <ObservationFromToNumberCommentComponent
        {...props}
        disabled={this.props.mode === 'VIEW'}
        fromLabel={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.labelText`)}
        fromTooltip={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.tooltip`)}
        fromPlaceHolder={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.placeHolder`)}
        onChangeFrom={(value) => this.onChangeField('fromValue', value, index)}
        toLabel={this.props.translate(`musit.storageUnits.environmentRequirements.${id}Tolerance.labelText`)}
        toTooltip={this.props.translate(`musit.storageUnits.environmentRequirements.${id}Tolerance.tooltip`)}
        toPlaceHolder={this.props.translate(`musit.storageUnits.environmentRequirements.${id}Tolerance.placeHolder`)}
        onChangeTo={(value) => this.onChangeField('toValue', value, index)}
        commentLabel={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.comment`)}
        commentTooltip={this.props.translate(`musit.storageUnits.environmentRequirements.${id}.comment`)}
        commentPlaceholder={this.props.translate('musit.texts.freetext')}
        onChangeComment={(value) => this.onChangeField('commentValue', value, index)}
      />
    )
  }

  render() {
    return (
      <div>
        <main>
          <Panel>
            <form>
              <Grid>
                <Row>
                  <Col style={{ textAlign: 'center' }}>
                    <PageHeader>
                      {this.props.title}
                    </PageHeader>
                  </Col>
                </Row>
                <Row>
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
                                  {this.getLabel(this.typeDefinitions[type].label)}
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
                  {this.state.observations.map((observation, index) => {
                    return (
                      <div key={index}>
                        <h3>
                          {this.getLabel(this.typeDefinitions[observation.type].label)}
                          &nbsp;
                          {this.props.mode !== 'ADD' ? '' : (
                            <a onClick={() => this.removeObservation(index)}>
                              <FontAwesome name="times" />
                            </a>
                          )}
                        </h3>
                        {this.renderObservation(observation, index)}
                        <hr />
                      </div>
                    )
                  })}
                </Row>
                <SaveCancel
                  translate={this.props.translate}
                  onClickSave={() => this.props.onSaveObservation(this.props.id, this.state.observations)}
                  onClickCancel={() => hashHistory.goBack()}
                  saveDisabled={false}
                  cancelDisabled={false}
                />
              </Grid>
            </form>
          </Panel>
        </main>
      </div>
    )
  }
}
