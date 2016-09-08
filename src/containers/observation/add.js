import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import Layout from '../../layout'
import { hashHistory } from 'react-router'
import { addObservation } from '../../reducers/observation'

const mapStateToProps = () => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveObservation: (id, data) => {
      dispatch(addObservation(id, data, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => alert('ikke istand til å lagre')
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired
  }

  render() {
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={<span>Museum / Papirdunken / Esken inni der</span>}
        content={
          <div>
            <center><h4>{this.props.translate('musit.observation.page.titles.add')}</h4></center>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={this.props.onSaveObservation}
              translate={this.props.translate}
              title="Add new observations"
              mode="ADD"
            />
          </div>
        }
      />
    )
  }
}
