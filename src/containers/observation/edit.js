
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import ObservationPage from './page'
import { loadObservation } from '../../reducers/observation'
import { addControl } from '../../reducers/control'
import Layout from '../../layout'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'
import { createBreadcrumbPath } from '../../util'
import { loadRoot } from '../../reducers/storageunit/grid'
import { emitError } from '../../errors/emitter'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => I18n.t(key, markdown),
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
        onFailure: () => emitError({ type: 'errorOnSave', message: this.props.translate('musit.observation.messages.saveError') })
      }))
    }
  },
  loadStorageObj: (id) => {
    dispatch(loadRoot(id))
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

  componentWillMount() {
    if (this.props.path.length === 0) {
      this.props.loadStorageObj(this.props.params.id)
    }
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
              doneDate={this.props.location.state.doneDate}
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
