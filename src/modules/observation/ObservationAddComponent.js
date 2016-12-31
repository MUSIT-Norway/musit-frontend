import React, { PropTypes } from 'react';
import ObservationPage from './ObservationComponent';
import Layout from '../../layout';
import Breadcrumb from '../../layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';
import { emitError, emitSuccess } from '../../util/errors/emitter';

export default class AddObservationPage extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    user: PropTypes.object,
    rootNode: React.PropTypes.object
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id, this.props.user.museumId);
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
              user={this.props.user}
              onSaveObservation={(id, museumId, data) => {
                this.props.onSaveObservation(id, museumId, data, {
                  onSuccess: () => {
                    hashHistory.goBack();
                    emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
                  },
                  onFailure: (e) => emitError({ ...e, type: 'network' })
                });
              }}
              mode="ADD"
              doneBy={this.props.user.actor}
            />
          </div>
        }
      />
    );
  }
}
