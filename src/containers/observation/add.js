import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'

const mapStateToProps = () => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    observations: [],
    doneDate: null,
    doneBy: null
  }
}

@connect(mapStateToProps)
export default class AddObservationPage extends React.Component {

  static propTypes = {
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.string,
    translate: PropTypes.func.isRequired
  }

  render() {
    return (
      <ObservationPage
        observations={this.props.observations}
        doneDate={this.props.doneDate}
        doneBy={this.props.doneBy}
        translate={this.props.translate}
        title="Add new observations"
        mode="ADD"
      />
    )
  }
}
