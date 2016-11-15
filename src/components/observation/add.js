import React, { PropTypes } from 'react';
import ObservationPage from './index';
import Layout from '../../layout';
import Breadcrumb from '../../layout/Breadcrumb';
import { I18n } from 'react-i18nify';

export default class AddObservationPage extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    actor: PropTypes.object,
    rootNode: React.PropTypes.object
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id);
    }
  }

  render() {
    return (
      <Layout
        title="Magasin"
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.observation.page.titles.add')}</h4>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={this.props.onSaveObservation}
              mode="ADD"
              doneBy={this.props.actor}
            />
          </div>
        }
      />
    );
  }
}
