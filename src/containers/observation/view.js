
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import ObservationPage from './page'
import Layout from '../../layout'
import { loadObservation, getActorNameFromId } from '../../reducers/observation'
import { createBreadcrumbPath } from '../../util'
import Breadcrumb from '../../layout/Breadcrumb'
import { loadRoot } from '../../reducers/storageunit/grid'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => I18n.t(key, markdown),
    doneBy: state.observation.data.doneBy,
    doneDate: state.observation.data.doneDate,
    registeredDate: state.observation.data.registeredDate,
    registeredBy: state.observation.data.registeredBy,
    observations: state.observation.data.observations,
    path: createBreadcrumbPath(state.storageGridUnit.root.data.path, state.storageGridUnit.root.data.pathNames)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadObservation: (nodeId, observationId, callback) => {
      dispatch(loadObservation(nodeId, observationId, callback))
    },
    loadPersonNameFromId: (doneBy) => {
      dispatch(getActorNameFromId(doneBy))
    },
    loadStorageObj: (id) => {
      dispatch(loadRoot(id))
    }
  }
}

class ViewObservationPage extends React.Component {

  static propTypes = {
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.object,
    registeredBy: PropTypes.string,
    registeredDate: PropTypes.string,
    translate: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    loadPersonNameFromId: PropTypes.func.isRequired,
    loadObservation: PropTypes.func.isRequired,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  componentWillMount() {
    if (this.props.params.obsId) {
      this.props.loadObservation(this.props.params.id, this.props.params.obsId, {
        onSuccess: (r) => {
          this.props.loadPersonNameFromId(r.doneBy)
          if (this.props.path.length === 0) {
            this.props.loadStorageObj(this.props.params.id)
          }
        }
      })
    }
  }

  render() {
    if (!this.props.observations) {
      return null; // We need data to display. If there is no data, there is nothing to display. Maybe spin wheel?
    }

    const nodes = this.props.path
    const breadcrumb = <Breadcrumb nodes={nodes} passive />
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{this.props.translate('musit.observation.page.titles.view')}</h4>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={() => true} // disable save
              observations={this.props.observations}
              translate={this.props.translate}
              doneBy={this.props.doneBy}
              doneDate={this.props.doneDate}
              registeredBy={this.props.registeredBy}
              registeredDate={this.props.registeredDate}
              saveDisabled
              mode="VIEW"
            />
          </div>
        }
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewObservationPage)
