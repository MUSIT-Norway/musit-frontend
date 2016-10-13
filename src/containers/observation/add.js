
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import ObservationPage from './page'
import Layout from '../../layout'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'
import { addObservation } from '../../reducers/observation'
import { createBreadcrumbPath } from '../../util'
import { loadRoot } from '../../reducers/storageunit/grid'

const mapStateToProps = (state) => {
  return {
    actor: state.auth.actor,
    translate: (key, markdown) => I18n.t(key, markdown),
    path: createBreadcrumbPath(state.storageGridUnit.root.data.path, state.storageGridUnit.root.data.pathNames)
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
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  componentWillMount() {
    if (this.props.path.length === 0) {
      this.props.loadStorageObj(this.props.params.id)
    }
  }

  render() {
    const nodes = this.props.path
    const breadcrumb = <Breadcrumb nodes={nodes} passive />
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={breadcrumb}
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
