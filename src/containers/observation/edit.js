import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import { loadObservation, getActorNameFromId } from '../../reducers/observation'
import { loadPath } from '../../storageunit/grid'
import { addControl } from '../../reducers/control'
import Layout from '../../layout'
import Breadcrumb from '../../layout/breadcrumb'
import { hashHistory } from 'react-router'
import { parseISODateNonStrict as parseISODate } from '../../util'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    path: state.storageGridUnit.root.path ?
          state.storageGridUnit.root.path.map((s) => {
            return {
              id: s.id, name: s.name, type: s.type, url: `/magasin/${s.id}` } }) :
      null
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadObservation: (id) => {
    dispatch(loadObservation(id, {
      onSuccess: () => this.props.loadPath(id),
      onFailure: true
    }))
  },
  loadPath: (id) => {
    dispatch(loadPath(id))
  },
  // Higher order function (or partial function if you like to call it that)
  onSaveObservation: (controlState) => {
    return (id, observationState) => {
      dispatch(addControl(id, controlState, observationState, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => alert('This went terribly wrong!')
      }))
    }
  },
  loadPersonNameFromId: (id) => {
    dispatch(getActorNameFromId(id))
  }
})


@connect(mapStateToProps, mapDispatchToProps)
export default class EditObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    loadPath: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  getObservationsFromLocationState() {
    return Object.keys(this.props.location.state)
      .filter((o) => o.endsWith('OK') && this.props.location.state[o] === false)
      .map((o) => {
        switch (o) {
          case 'pestOK':
            return { type: 'pest', data: ObservationPage.createDefaultPestData() }
          case 'temperatureOK':
            return { type: 'temperature', data: {} }
          case 'moldOK':
            return { type: 'mold', data: {} }
          case 'hypoxicAirOK':
            return { type: 'hypoxicAir', data: {} }
          case 'gasOK':
            return { type: 'gas', data: {} }
          case 'lightConditionsOK':
            return { type: 'lightConditions', data: {} }
          case 'cleaningOK':
            return { type: 'cleaning', data: {} }
          case 'relativeHumidityOK':
            return { type: 'relativeHumidity', data: {} }
          case 'alcoholOK':
            return { type: 'alcohol', data: {} }
          default:
            throw Error(`Invalid control ${o}`)
        }
      }
    )
  }

  parseDoneDateFromLocationState() {
    let doneDate = this.props.location.state.doneDate
    if (typeof doneDate === 'string') {
      doneDate = parseISODate(doneDate)
    }
    return doneDate
  }

  render() {
    const nodes = this.props.path
    const nodeTypes = [{ type: 'Building', iconName: 'folder' },
                       { type: 'Room', iconName: 'folder' },
                       { type: 'StorageUnit', iconName: 'folder' }]
    const breadcrumb = nodes ? this.makeBreadcrumb(nodes, nodeTypes) : null
    return (
      <Layout
        title={"Magasin"}
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <div>
            <center><h4>{this.props.translate('musit.observation.page.titles.edit')}</h4></center>
            <ObservationPage
              id={this.props.params.id}
              observations={this.getObservationsFromLocationState()}
              doneDate={this.parseDoneDateFromLocationState().toISOString()}
              doneBy={this.props.location.state.doneBy}
              onSaveObservation={this.props.onSaveObservation(this.props.location.state)}
              translate={this.props.translate}
              mode="EDIT"
            />
          </div>
        }
      />
    )
  }
}
