import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Language from '../../components/language'
import ObservationPage from './page'
import Layout from '../../layout'
import { loadObservation, getActorNameFromId } from '../../reducers/observation'
import { parseISODateNonStrict as parseISODate } from '../../util'
import Breadcrumb from '../../layout/Breadcrumb'

const mapStateToProps = (state) => {
  return {
    translate: (key, markdown) => Language.translate(key, markdown),
    doneBy: state.observation.data.doneBy,
    doneDate: state.observation.data.doneDate,
    registeredDate: state.observation.data.registeredDate,
    registeredBy: state.observation.data.registeredBy,
    observations: state.observation.data.observations,
    path: state.storageGridUnit.root.path ?
      state.storageGridUnit.root.path.map((s) => {
        return {
          id: s.id, name: s.name, type: s.type, url: `/magasin/${s.id}` } }) :
      null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadObservation: (id, callback) => {
      dispatch(loadObservation(id, callback))
    },
    loadPersonNameFromId: (id) => {
      dispatch(getActorNameFromId(id))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ViewObservationPage extends React.Component {

  static propTypes = {
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.object,
    registeredBy: PropTypes.object,
    registeredDate: PropTypes.object,
    translate: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    loadPersonNameFromId: PropTypes.func.isRequired,
    loadObservation: PropTypes.func.isRequired,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  componentWillMount() {
    if (this.props.params.obsId) {
      this.props.loadObservation(this.props.params.obsId, {
        onSuccess: (r) => this.props.loadPersonNameFromId(r.doneBy)
      })
    }
  }

  render() {
    const nodes = this.props.path
    const nodeTypes = [{ type: 'Building', iconName: 'folder' },
                       { type: 'Room', iconName: 'folder' },
                       { type: 'StorageUnit', iconName: 'folder' }]
    const breadcrumb = nodes ? this.makeBreadcrumb(nodes, nodeTypes) : null
    return (
      <Layout
        title="Magasin"
        translate={this.props.translate}
        breadcrumb={breadcrumb}
        content={
          <div>
            <h4>{this.props.translate('musit.observation.page.titles.view')}</h4>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={() => true} // disable save
              observations={this.props.observations}
              translate={this.props.translate}
              doneBy={this.props.doneBy}
              doneDate={parseISODate(this.props.doneDate)}
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
