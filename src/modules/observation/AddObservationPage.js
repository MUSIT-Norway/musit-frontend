import React from 'react';
import PropTypes from 'prop-types';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import inject from 'react-rxjs/dist/RxInject';
import { hashHistory } from 'react-router';
import { emitError, emitSuccess } from '../../shared/errors';
import store$, { loadRootNode$ } from './observationStore';
import Observation from '../../models/observation';

export class AddObservationPage extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    addObservation: PropTypes.func.isRequired,
    loadRootNode: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    actor: PropTypes.object,
    rootNode: PropTypes.object,
    appSession: PropTypes.object.isRequired
  };

  componentWillMount() {
    if (!this.props.store.rootNode) {
      this.props.loadRootNode({
        id: this.props.params.id,
        museumId: this.props.appSession.museumId,
        token: this.props.appSession.accessToken
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
            <h4 style={{ textAlign: 'center' }}>
              {I18n.t('musit.observation.page.titles.add')}
            </h4>
            <ObservationPage
              id={this.props.params.id}
              onSaveObservation={(nodeId, data) => {
                const museumId = this.props.appSession.museumId;
                const token = this.props.appSession.accessToken;
                this.props
                  .addObservation({
                    nodeId,
                    museumId,
                    data,
                    token,
                    callback: {
                      onComplete: () => {
                        hashHistory.goBack();
                        this.props.emitSuccess({
                          type: 'saveSuccess',
                          message: I18n.t('musit.observation.page.messages.saveSuccess')
                        });
                      },
                      onFailure: e => this.props.emitError({ ...e, type: 'network' })
                    }
                  })
                  .toPromise();
              }}
              mode="ADD"
              doneBy={this.props.appSession.actor}
            />
          </div>
        }
      />
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$
};

const commands = {
  loadRootNode$
};

const props = {
  emitError,
  emitSuccess,
  addObservation: Observation.addObservation()
};

export default inject(data, commands, props)(AddObservationPage);
