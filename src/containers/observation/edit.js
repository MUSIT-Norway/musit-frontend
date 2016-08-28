import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'

const mapStateToProps = () => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    observations: [],
    doneDate: null,
    doneBy: null,
    location: {
      state: {
        pestOK: false,
        alcoholOK: false
      }
    }
  }
}

@connect(mapStateToProps)
export default class EditObservationPage extends React.Component {

  static propTypes = {
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.string,
    translate: PropTypes.func.isRequired,
    location: PropTypes.object
  }

  getObservationsFromLocationState() {
    return Object.keys(this.props.location.state).map((o) => {
      switch (o) {
        case 'pestOK':
          return { type: 'pest', props: ObservationPage.typeDefinitions.pest.props }
        case 'temperatureOK':
          return { type: 'temperature' }
        case 'moldOK':
          return { type: 'mold' }
        case 'inertAirOK':
          return { type: 'inertAir' }
        case 'gasOK':
          return { type: 'gas' }
        case 'lightConditionsOK':
          return { type: 'lux' }
        case 'cleaningOK':
          return { type: 'cleaning' }
        case 'relativeHumidityOK':
          return { type: 'rh' }
        case 'alcoholOK':
          return { type: 'alcohol' }
        default:
          throw Error('Invalid control')
      }
    })
  }

  render() {
    const observations = this.props.location.state ? this.getObservationsFromLocationState() : this.props.observations
    return (<ObservationPage
      observations={observations}
      doneDate={this.props.doneDate}
      doneBy={this.props.doneBy}
      translate={this.props.translate}
      title="Enter control observations"
      mode="EDIT"
    />)
  }
}
