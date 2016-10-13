
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import { loadObservation } from '../../reducers/observation'
import { addControl } from '../../reducers/control'
import Layout from '../../layout'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'
import { parseISODateNonStrict as parseISODate, createBreadcrumbPath } from '../../util'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    path: createBreadcrumbPath(state.storageGridUnit.root.data.path, state.storageGridUnit.root.data.pathNames)
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadObservation: (id) => {
    dispatch(loadObservation(id))
  },
  // Higher order function (or partial function if you like to call it that)
  onSaveObservation: (controlState) => {
    return (id, observationState) => {
      dispatch(addControl(id, controlState, observationState, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => alert('This went terribly wrong!')
      }))
    }
  }
})

class EditObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
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
          case 'lightConditionOK':
            return { type: 'lightCondition', data: {} }
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
    const breadcrumb = <Breadcrumb nodes={nodes} passive />
    return (
      <Layout
        title={'Magasin'}
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{this.props.translate('musit.observation.page.titles.edit')}</h4>
            <ObservationPage
              id={this.props.params.id}
              observations={this.getObservationsFromLocationState()}
              doneDate={this.parseDoneDateFromLocationState()}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditObservationPage)
