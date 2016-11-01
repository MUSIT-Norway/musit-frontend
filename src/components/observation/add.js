import React, { PropTypes } from 'react'
import ObservationPage from './index'
import Layout from '../../layout'
import Breadcrumb from '../../layout/Breadcrumb'

export default class AddObservationPage extends React.Component {

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
