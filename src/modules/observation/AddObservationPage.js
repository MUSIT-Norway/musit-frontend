import React, { PropTypes } from 'react';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import inject from 'react-rxjs/dist/RxInject';
import { hashHistory } from 'react-router';
import { emitError, emitSuccess } from '../../shared/errors';
import store$, { loadRootNode$, addObservation$ } from './observationStore';

export class AddObservationPage extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    addObservation: PropTypes.func.isRequired,
    loadRootNode: PropTypes.func.isRequired,
    actor: PropTypes.object,
    rootNode: React.PropTypes.object,
    appSession: PropTypes.object.isRequired
  }

  componentWillMount() {
    if (!this.props.store.rootNode) {
      this.props.loadRootNode({
        nodeId: this.props.params.id,
        museumId: this.props.appSession.getMuseumId(),
        token: this.props.appSession.getAccessToken()
      });
    }
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={<Breadcrumb node={this.props.store.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.observation.page.titles.add')}</h4>
            <ObservationPage
              id={this.props.params.id}
              museumId={this.props.appSession.getMuseumId()}
              onSaveObservation={(nodeId, data, museumId, token = this.props.appSession.getAccessToken()) => {
                this.props.addObservation({ nodeId, museumId, data, token,
                  onComplete: () => {
                    hashHistory.goBack();
                    emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
                  },
                  onFailure: (e) => emitError({ ...e, type: 'network' })
                });
              }}
              mode="ADD"
              doneBy={this.props.appSession.getActor()}
            />
          </div>
        }
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$
};

const commands = {
  loadRootNode$,
  addObservation$
};

export default inject(data, commands)(AddObservationPage);
