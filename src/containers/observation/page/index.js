import React, { PropTypes } from 'react'
import { ControlLabel, Grid, Row, Col, Button, FormGroup, FormControl } from 'react-bootstrap'
import { RenderPest, RenderAlcohol, RenderDoubleTextArea, RenderFromToNumberComment } from '../../../components/observation/render'
import { containsObjectWithField } from '../../../util'
import FontAwesome from 'react-fontawesome'
import { hashHistory } from 'react-router'
import SaveCancel from '../../../components/formfields/saveCancel/SaveCancel'
import DatePicker from 'react-bootstrap-date-picker'
import ActorSuggest from '../../../components/actor'

export default class ObservationPage extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.object,
    registeredDate: PropTypes.string,
    registeredBy: PropTypes.string,
    onSaveObservation: PropTypes.func.isRequired,
    mode: React.PropTypes.oneOf(['ADD', 'VIEW', 'EDIT']).isRequired,
    saveDisabled: React.PropTypes.bool,
    cancelDisabled: React.PropTypes.bool
  }

  static defaultProps = {
    observations: [],
    saveDisabled: false,
    cancelDisabled: false
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

  componentWillReceiveProps(nextProps) {
    if (this.props.mode === 'VIEW') {
      this.setState({
        ...this.state,
        doneBy: nextProps.doneBy && nextProps.doneBy.id ? nextProps.doneBy : null,
        doneDate: nextProps.doneDate,
        observations: nextProps.observations
      })
    }
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
    rh: { label: 'rh.labelText', render: this.renderFromToNumberComment },
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
    const typeDefinition = this.typeDefinitions[observation.type];
    return typeDefinition.render.bind(this)(observation.type, observation.data, index)
  }

  renderAlcohol(id, valueProps, index) {
    return (<RenderAlcohol
      disabled={this.props.mode === 'VIEW'}
      valueProps={valueProps}
      index={index}
      mode={this.props.mode}
      translate={this.props.translate}
      onChangeField={this.onChangeField}
    />)
  }

  renderPest(id, valueProps, index) {
    return (<RenderPest
      disabled={this.props.mode === 'VIEW'}
      canEdit={this.props.mode !== 'VIEW'}
      valueProps={valueProps}
      index={index}
      mode={this.props.mode}
      translate={this.props.translate}
      onChangeField={this.onChangeField}
      onChangePestObservation={this.onChangePestObservation}
      onRemovePestObservation={this.onRemovePestObservation}
      onClickAddObservation={this.onClickAddObservation}
    />)
  }

  renderDoubleTextArea(id, valueProps, index) {
    return (<RenderDoubleTextArea
      disabled={this.props.mode === 'VIEW'}
      type={id}
      valueProps={valueProps}
      index={index}
      mode={this.props.mode}
      translate={this.props.translate}
      onChangeField={this.onChangeField}
    />)
  }

  renderFromToNumberComment(id, valueProps, index) {
    return (<RenderFromToNumberComment
      disabled={this.props.mode === 'VIEW'}
      type={id}
      valueProps={valueProps}
      index={index}
      mode={this.props.mode}
      translate={this.props.translate}
      onChangeField={this.onChangeField}
    />)
  }

  render() {
    return (
      <form>
        <Grid>
          <Row>
            <h3 />
            <Row>
              <Col xs={12} sm={5}>
                <ControlLabel>{this.props.translate('musit.observation.date')}</ControlLabel>
                {this.props.mode !== 'ADD' ? (
                  <FormControl
                    componentClass="input"
                    value={this.state.doneDate}
                    disabled
                  />
                ) : (
                  <DatePicker
                    dateFormat="YYYY-MM-DD"
                    value={this.state.doneDate}
                    onChange={(value) => {
                      this.setState({ ...this.state, doneDate: value })
                    }}
                    disabled={this.props.mode === 'VIEW'}
                  />
                )}
              </Col>
              <Col xs={12} sm={5}>
                <ControlLabel>{this.props.translate('musit.observation.doneBy')}</ControlLabel>
                {this.props.mode !== 'ADD' ? (
                  <FormControl
                    componentClass="input"
                    value={this.state.doneBy ? this.state.doneBy.fn : ''}
                    disabled
                  />
                ) : (
                  <ActorSuggest
                    id="doneByField"
                    value={this.state.doneBy ? this.state.doneBy.fn : ''}
                    placeHolder="Find actor"
                    onChange={newValue => {
                      this.setState({ ...this.state, doneBy: newValue })
                    }}
                  />
                )}
              </Col>
            </Row>
            {this.props.mode === 'VIEW' ?
              <Row>
                <Col sm={5}>
                  <ControlLabel>{this.props.translate('musit.texts.dateRegistered')}</ControlLabel>
                  <FormControl
                    componentClass="input"
                    value={this.props.registeredDate}
                    disabled
                  />
                </Col>
                <Col sm={5} >
                  <ControlLabel>{this.props.translate('musit.texts.registeredBy')}</ControlLabel>
                  <FormControl
                    componentClass="input"
                    value={this.props.registeredBy}
                    disabled
                  />
                </Col>
              </Row>
            : ''}
            <h3 />
            {this.props.mode !== 'ADD' ? '' : (
              <Row>
                <Col xs={2}>
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
            onClickSave={() => this.props.onSaveObservation(this.props.id, this.state)}
            onClickCancel={() => hashHistory.goBack()}
            saveDisabled={this.props.saveDisabled === true || this.state.observations.length === 0}
            cancelDisabled={this.props.cancelDisabled}
          />
        </Grid>
      </form>
    )
  }
}
