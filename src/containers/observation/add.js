
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import ObservationPage from './page'
import Layout from '../../layout'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'
import { addObservation } from '../../reducers/observation'
import { loadRoot } from '../../reducers/storageunit/grid'
import { emitError, emitSuccess } from '../../errors/emitter'

const mapStateToProps = (state) => {
  return {
    actor: state.auth.actor,
    translate: (key, markdown) => I18n.t(key, markdown),
    rootNode: state.storageGridUnit.root.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveObservation: (id, data) => {
      dispatch(addObservation(id, data, {
        onSuccess: () => {
          hashHistory.goBack()
          emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') })
        },
        onFailure: () => emitError( { type: 'errorOnSave', message: I18n.t('musit.observation.page.messages.saveError') })
      }))
    },
    loadStorageObj: (id) => {
      dispatch(loadRoot(id))
    }
  }
}

class AddObservationPage extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    actor: PropTypes.object,
    rootNode: React.PropTypes.object
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id)
    }
  }

  render() {
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{this.props.translate('musit.observation.page.titles.add')}</h4>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={this.props.onSaveObservation}
              translate={this.props.translate}
              mode="ADD"
              doneBy={this.props.actor}
            />
          </div>
        }
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddObservationPage)
