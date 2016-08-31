import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import Layout from '../../layout'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    suggest: state.suggest
  }
}

@connect(mapStateToProps)
export default class AddObservationPage extends React.Component {

  static propTypes = {
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.object,
    translate: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  }

  render() {
    return (
      <Layout
        title="Add new observations"
        translate={this.props.translate}
        breadcrumb={<span>Museum / Papirdunken / Esken inni der</span>}
        toolbar={<span />}
        leftMenu={
          <div
            style={{
              minHeight: 400
            }}
          />
        }
        content={
          <ObservationPage
            id={this.props.params.id}
            onSaveObservation={(id, data) => {
              console.log(id)
              console.log(data)
            }}
            observations={this.props.observations}
            suggest={this.props.suggest}
            translate={this.props.translate}
            title="Add new observations"
            mode="ADD"
          />
        }
      />
    )
  }
}
