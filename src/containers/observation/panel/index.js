/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react'
import { PageHeader, Panel, Grid, Row, Col, Button, ControlLabel, SplitButton, MenuItem } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import Language from '../../../components/language'
import DatePicker from 'react-bootstrap-date-picker'
import { hashHistory } from 'react-router'
import Autosuggest from 'react-autosuggest'
import { suggestPerson, clearSuggest } from '../../../reducers/suggest'
import { observationTypeDefinitions, defineCommentType,
  defineFromToType, definePestType, defineStatusType } from './observationTypeDefinitions'
import { addObservation, loadObservation, getActorNameFromId } from '../../../reducers/observation'
import { actions } from './actions'
import { MusitField } from '../../../components/formfields'
import SaveCancel from '../../../components/formfields/saveCancel/SaveCancel'
import { isDefined } from '../../../util'

// TODO: Bind finished page handling to redux and microservices.
const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  doneBy: state.observation.data.doneBy,
  doneDate: state.observation.data.doneDate,
  registeredDate: state.observation.data.registeredDate,
  registeredBy: state.observation.data.registeredBy,
  observations: state.observation.data.observations,
  suggest: state.suggest
})

const mapDispatchToProps = (dispatch) => ({
  loadObservation: (id, callback) => {
    dispatch(loadObservation(id, callback))
  },
  onSaveObservation: (data, controls) => {
    if (controls) { // We are working on a new control with observations
      // console.log('Adding new control with observations')
    } else {
      dispatch(addObservation(data, {
        onSuccess: (/* result */) => hashHistory.goBack(),
        onFailure: (/* error */) => null /* alert(`Error occured: ${error}`) */
      }))
    }
  },
  onDoneBySuggestionsUpdateRequested: ({ value, reason }) => {
    // Should only autosuggest on typing if you have more then 2 characters
    if (reason && (reason === 'type') && value && value.length >= 2) {
      dispatch(suggestPerson('doneByField', value))
    } else {
      dispatch(clearSuggest('doneByField'))
    }
  },
  loadPersonNameFromId: (id) => {
    dispatch(getActorNameFromId(id))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
export default class ObservationView extends React.Component {
  static propTypes = {
    loadObservation: React.PropTypes.func.isRequired,
    loadPersonNameFromId: React.PropTypes.func.isRequired,
    translate: React.PropTypes.func.isRequired,
    onSaveObservation: React.PropTypes.func.isRequired,
    observations: React.PropTypes.arrayOf(React.PropTypes.object),
    params: React.PropTypes.object,
    controlObservations: React.PropTypes.object,
    onDoneBySuggestionsUpdateRequested: React.PropTypes.func.isRequired,
    suggest: React.PropTypes.array.isRequired,
    route: React.PropTypes.object,
    location: React.PropTypes.object,
    doneBy: React.PropTypes.object
  }

  constructor(props) {
    super(props)

    const { translate } = props

    this.displayExisting = !!this.props.params.obsId

    this.observationTypeDefinitions = observationTypeDefinitions(translate, this.actions)

    this.actions = actions(this)

    const label = (key) => translate(`musit.storageUnits.environmentRequirements.${key}`)

    this.observationTypes = {
      lux: defineCommentType(
        'lux',
        'Lysforhold',
        label('lightCondition.labelText'),
        label('lightCondition.tooltip'),
        label('renhold.comment'),
        label('renhold.comment'),
        this.actions.changeLuxLeft,
        this.actions.changeLuxRight,
        this.displayExisting
      ),
      gas: defineCommentType(
        'gas',
        'Gass',
        label('gas.labelText'),
        label('gas.tooltip'),
        label('renhold.comment'),
        label('renhold.comment'),
        this.actions.changeGasLeft,
        this.actions.changeGasRight,
        this.displayExisting
      ),
      cleaning: defineCommentType(
        'cleaning',
        'Renhold',
        label('renhold.labelText'),
        label('renhold.tooltip'),
        label('renhold.comment'),
        'Right tooltip',
        this.actions.changeCleaningLeft,
        this.actions.changeCleaningRight,
        this.displayExisting
      ),
      mold: defineCommentType(
        'mold',
        'Mugg',
        label('mold.labelText'),
        label('mold.tooltip'),
        label('renhold.comment'),
        label('renhold.comment'),
        this.actions.changeMoldLeft,
        this.actions.changeMoldRight,
        this.displayExisting
      ),
      skallsikring: defineCommentType(
        'skallsikring',
        'Skallsikring',
        label('skallsikring.labelText'),
        label('skallsikring.tooltip'),
        label('skallsikring.comment'),
        label('skallsikring.comment'),
        this.actions.changeSkallSikringLeft,
        this.actions.changeSkallSikringRight,
        this.displayExisting
      ),
      tyverisikring: defineCommentType(
        'tyverisikring',
        'Tyverisikring',
        label('tyverisikring.labelText'),
        label('tyverisikring.tooltip'),
        label('renhold.comment'),
        label('renhold.comment'),
        this.actions.changeTyveriSikringLeft,
        this.actions.changeTyveriSikringRight,
        this.displayExisting
      ),
      brannsikring: defineCommentType(
        'brannsikring',
        'Brannsikring',
        label('brannsikring.labelText'),
        label('brannsikring.tooltip'),
        label('brannsikring.comment'),
        label('brannsikring.comment'),
        this.actions.changeBrannSikringLeft,
        this.actions.changeBrannSikringRight,
        this.displayExisting
      ),
      vannskaderisiko: defineCommentType(
        'vannskaderisiko',
        'Vannskaderisiko',
        label('vannskaderisiko.labelText'),
        label('vannskaderisiko.tooltip'),
        label('vannskaderisiko.comment'),
        label('vannskaderisiko.comment'),
        this.actions.changeVannskadeRisikoLeft,
        this.actions.changeVannskadeRisikoRight,
        this.displayExisting
      ),
      temperature: defineFromToType(
        'temperature',
        'Temperatur',
        label('temperature.labelText'),
        label('temperature.tooltip'),
        label('temperatureTolerance.labelText'),
        label('temperatureTolerance.tooltip'),
        label('temperature.comment'),
        label('temperature.comment'),
        this.actions.changeTempFrom,
        this.actions.changeTempTo,
        this.actions.changeTempComment,
        '', '',
        this.displayExisting
      ),
      rh: defineFromToType(
        'rh',
        'Relativ luftfuktighet',
        label('relativeHumidity.labelText'),
        label('relativeHumidity.tooltip'),
        label('relativeHumidityTolerance.labelText'),
        label('relativeHumidityTolerance.tooltip'),
        label('relativeHumidity.comment'),
        label('relativeHumidity.comment'),
        this.actions.changeRHFrom,
        this.actions.changeRHTo,
        this.actions.changeRHComment,
        '', '',
        this.displayExisting
      ),
      hypoxicAir: defineFromToType(
        'hypoxicAir',
        'Inert luft',
        label('inertAir.labelText'),
        label('inertAir.tooltip'),
        label('inertAirTolerance.labelText'),
        label('inertAirTolerance.tooltip'),
        label('inertAir.comment'),
        label('inertAir.comment'),
        this.actions.changeHypoxicAirFrom,
        this.actions.changeHypoxicAirTo,
        this.actions.changeHypoxicAirComment,
        'Fra %', 'Til %',
        this.displayExisting
      ),
      alcohol: defineStatusType(
        'alcohol',
        label('alcohol.labelText'),
        label('alcohol.statusLabel'),
        'statusTooltip',
        [
          label('alcohol.statusItems.dryed'),
          label('alcohol.statusItems.allmostDryed'),
          label('alcohol.statusItems.someDryed'),
          label('alcohol.statusItems.minorDryed'),
          label('alcohol.statusItems.satisfactory')
        ],
        label('alcohol.volume'),
        label('alcohol.tooltip'),
        label('alcohol.comment'),
        label('alcohol.comment'),
        this.actions.changeAlchoholStatus,
        this.actions.changeAlchoholVolume,
        this.actions.changeAlchoholComment,
        this.displayExisting
      ),
      pest: definePestType(
        'pest',
        'Skadedyr',
        this.actions.addPest,
        this.actions.changeLifeCycle,
        this.actions.changeCount,
        this.actions.changePestIdentification,
        this.actions.changePestComment,
        this.displayExisting
      )
    }

    this.addNewControlObservationJson = (obsType, defaultValuesType) => {
      const json = {}
      json.type = obsType
      json.data = this.observationTypeDefinitions[defaultValuesType].defaultValues
      return json
    }

    this.addNewControlObservationArrayOfJson = (obsType, defaultValuesType) => {
      return this.addNewControlObservationJson(obsType, defaultValuesType)
    }

    this.mapControlObservation = (controlType, obsType, defaultValuesType) => {
      const location = this.props.location;
      const createObservation = location && location.state && location.state[controlType] === false;
      if (createObservation) {
        return this.addNewControlObservationArrayOfJson(obsType, defaultValuesType)
      }
      return null
    }

    this.addNewControlObservation = () => {
      const arr = []
      arr.push(this.mapControlObservation('lightConditionsOK', 'lux', 'comments'))
      arr.push(this.mapControlObservation('gasOK', 'gas', 'comments'))
      arr.push(this.mapControlObservation('cleaningOK', 'cleaning', 'comments'))
      arr.push(this.mapControlObservation('moldOK', 'mold', 'comments'))
      arr.push(this.mapControlObservation('temperatureOK', 'temperature', 'fromTo'))
      arr.push(this.mapControlObservation('relativeHumidityOK', 'rh', 'fromTo'))
      arr.push(this.mapControlObservation('inertAirOK', 'hypoxicAir', 'fromTo'))
      arr.push(this.mapControlObservation('alcoholOK', 'alcohol', 'status'))
      arr.push(this.mapControlObservation('pestOK', 'pest', 'pest'))
      return arr
    }

    let observations = []
    if (this.displayExisting) {
      observations = this.props.observations
    } else if (this.props.location.state) {
      observations = this.addNewControlObservation()
    }

    this.state = { ...this.state, observations: observations.filter(isDefined) }

    this.addNewObservation = this.addNewObservation.bind(this)
    this.onChangeDoneBy = this.onChangeDoneBy.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.selectType = this.selectType.bind(this)
    this.onCancelObservation = this.onCancelObservation.bind(this)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.renderActiveType = this.renderActiveType.bind(this)
  }

  componentWillMount() {
    if (this.props.params.obsId) {
      this.props.loadObservation(this.props.params.obsId, {
        onSuccess: (result) => {
          if (Number.isInteger(result.doneBy)) {
            this.props.loadPersonNameFromId(result.doneBy)
          }
        }
      })
    }
  }

  onChangeDoneBy(event, { newValue }) {
    this.updateDoneByName(newValue)
  }

  onCancelObservation() {
    this.clearState()
    hashHistory.goBack()
  }

  onSuggestionSelected(event, { suggestion }) {
    this.updateDoneBy(suggestion)
  }

  onChangeDate(v) {
    this.setState({ ...this.state, doneDate: v })
  }

  getSuggestions() {
    return this.props.suggest.doneByField && this.props.suggest.doneByField.data ? this.props.suggest.doneByField.data : [];
  }

  getDoneBySuggestionValue(suggestion) {
    return suggestion.fn
  }

  getPageHeader() {
    if (this.props.location.state) {
      return this.props.translate('musit.newControl.title')
    }

    if (this.displayExisting) {
      return this.props.translate('musit.observation.viewObservationHeader')
    }

    return this.props.translate('musit.observation.newObservationHeader')
  }

  selectType(index, observationType) {
    this.setState({
      ...this.state,
      observations: this.state.observations.map((obs, i) => {
        let retVal = obs
        if (index === i) {
          const typeValue = observationType[0]
          const obsType = observationType[1]
          retVal = { ...obs, type: typeValue, data: this.observationTypeDefinitions[obsType.component.viewType].defaultValues }
        }
        return retVal
      })
    })
  }

  clearState() {
    this.setState({ ...this.state, observations: [], doneDate: '', doneBy: {} })
  }

  addNewObservation() {
    this.setState({ ...this.state, observations: [...this.state.observations, { type: '' }] })
  }

  updateDoneByName(newValue) {
    this.setState({ ...this.state, doneBy: { ...this.state.doneBy, fn: newValue } })
  }

  updateDoneBy(newValue) {
    this.setState({ ...this.state, doneBy: newValue })
  }

  renderDoneBySuggestion(suggestion) {
    const suggestionText = `${suggestion.fn}`
    return (
      <span className={'suggestion-content'}>{suggestionText}</span>
    )
  }

  renderActiveType(observation, index) {
    let subBlock = ''
    if (observation.type && observation.type.length > 0) {
      const observationType = this.observationTypes[observation.type]
      const observationTypeDef = this.observationTypeDefinitions[observationType.component.viewType]
      subBlock = observationTypeDef.render(index, {
        ...observationType.component.props,
        ...observationTypeDef.props,
        ...observation.data
      })
    }

    const menuItems = Object.entries(this.observationTypes).map((obsType, row) => {
      return (
        <MenuItem
          key={row}
          disabled={this.state.observations.findIndex((e) => (e.type === obsType[0])) >= 0}
          eventKey={obsType}
        >
          {obsType[1].label}
        </MenuItem>
      )
    })

    return (
      <Row key={index}>
        <hr />
        <Col sm={10} smOffset={1}>
          <SplitButton
            id={`new_${index}`}
            title={observation.type ? this.observationTypes[observation.type].label : null || 'Vennligst velg...'}
            pullRight
            disabled={this.displayExisting || this.props.location.state}
            onSelect={(observationType) => this.selectType(index, observationType)}
          >
            {menuItems}
          </SplitButton>
          <h1 />
          {subBlock}
        </Col>
      </Row>
    )
  }

  render() {
    const localState = this.displayExisting ? this.props : this.state

    const suggestions = this.getSuggestions()

    const doneByProps = {
      id: 'doneByField',
      placeholder: 'Done by',
      value: localState.doneBy ? localState.doneBy.fn : '',
      type: 'search',
      onChange: this.onChangeDoneBy
    }

    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row>
                <Col style={{ textAlign: 'center' }}>
                  <PageHeader>
                    {this.getPageHeader()}
                    <br />
                    { this.props.location.state ? this.props.translate('musit.observation.registerObservations') : ''}
                  </PageHeader>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={5} smOffset={1}>
                  <ControlLabel>{this.props.translate('musit.observation.date')}</ControlLabel>
                  <DatePicker
                    dateFormat="YYYY-MM-DD"
                    value={localState.doneDate}
                    onChange={this.onChangeDate}
                    disabled={this.displayExisting}
                  />
                </Col>
                <Col xs={12} sm={5}>
                  <ControlLabel>{this.props.translate('musit.observation.doneBy')}</ControlLabel>
                  <Autosuggest
                    suggestions={suggestions}
                    disabled={this.displayExisting}
                    onSuggestionsUpdateRequested={this.props.onDoneBySuggestionsUpdateRequested}
                    getSuggestionValue={this.getDoneBySuggestionValue}
                    renderSuggestion={this.renderDoneBySuggestion}
                    inputProps={doneByProps}
                    shouldRenderSuggestions={(v) => v !== 'undefined'}
                    onSuggestionSelected={this.onSuggestionSelected}
                  />
                </Col>
              </Row>
              {this.displayExisting ?
                <Row>
                  <Col sm={5} smOffset={1}>
                    <ControlLabel>{this.props.translate('musit.texts.dateRegistered')}</ControlLabel>
                    <br />
                    <DatePicker
                      dateFormat="YYYY-MM-DD"
                      value={localState.registeredDate}
                      disabled={this.displayExisting}
                    />
                  </Col>
                  <Col sm={5} >
                    <ControlLabel>{this.props.translate('musit.texts.registeredBy')}</ControlLabel>
                    <br />
                    <MusitField
                      id="registeredBy"
                      value={localState.registeredBy}
                      validate="text"
                      disabled={this.SaveCancelSaveCancel}
                    />
                  </Col>
                </Row>
              : ''}
              <h1 />
              {localState.observations.map(this.renderActiveType)}
              {this.displayExisting || this.props.location.state ? '' :
                <Row>
                  <h1 />
                  <hr />
                  <Col sm={5} smOffset={1}>
                    <Button
                      onClick={() => this.addNewObservation()}
                      disabled={this.displayExisting || this.props.location.state}
                    >
                      <FontAwesome name="plus-circle" /> {this.props.translate('musit.observation.newButtonLabel')}
                    </Button>
                  </Col>
                </Row>
              }
              <h1 />
              <hr />
              <h1 />
              <SaveCancel
                translate={this.props.translate}
                onClickSave={() => this.props.onSaveObservation(this.state, this.props.location.state)}
                onClickCancel={() => this.onCancelObservation()}
                saveDisabled={this.displayExisting}
                cancelDisabled={this.displayExisting}
              />
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }
}
