import React, { PropTypes } from 'react';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import Actor from '../../models/actor';
import inject from 'react-rxjs/dist/RxInject';
import { hashHistory } from 'react-router';
import { emitError, emitSuccess } from '../../shared/errors';
import store$, { loadRootNode$ } from './observationStore';
import Control from '../../models/control';

export class EditObservationPage extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    addObservation: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
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

  getObservationsFromLocationState() {
    return Object.keys(this.props.location.state)
      .filter((o) => o.endsWith('OK') && this.props.location.state[o] === false)
      .map((o) => {
        switch (o) {
        case 'pestOK':
          return { type: 'pest', data: ObservationPage.createDefaultPestData() };
        case 'temperatureOK':
          return { type: 'temperature', data: {} };
        case 'moldOK':
          return { type: 'mold', data: {} };
        case 'hypoxicAirOK':
          return { type: 'hypoxicAir', data: {} };
        case 'gasOK':
          return { type: 'gas', data: {} };
        case 'lightConditionOK':
          return { type: 'lightCondition', data: {} };
        case 'cleaningOK':
          return { type: 'cleaning', data: {} };
        case 'relativeHumidityOK':
          return { type: 'relativeHumidity', data: {} };
        case 'alcoholOK':
          return { type: 'alcohol', data: {} };
        default:
          throw Error(`Invalid control ${o}`);
        }
      }
      );
  }

  getDoneByFromLocationState() {
    return new Actor(this.props.location.state.doneBy);
  }

  render() {
    return (
      <Layout
        title={'Magasin'}
        breadcrumb={<Breadcrumb node={this.props.store.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.observation.page.titles.edit')}</h4>
            <ObservationPage
              id={this.props.params.id}
              observations={this.getObservationsFromLocationState()}
              doneDate={this.props.location.state.doneDate}
              doneBy={this.getDoneByFromLocationState()}
              onSaveObservation={(nodeId, observations) => {
                const museumId = this.props.appSession.getMuseumId();
                const token = this.props.appSession.getAccessToken();
                const controlData = this.props.location.state;
                this.props.addObservation({ nodeId, museumId, controlData, observations, token, callback: {
                  onComplete: () => {
                    hashHistory.goBack();
                    this.props.emitSuccess( { type: 'saveSuccess', message: I18n.t('musit.observation.page.messages.saveSuccess') });
                  },
                  onFailure: (e) => this.props.emitError({ ...e, type: 'network' })
                }});
              }}
              mode="EDIT"
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
  loadRootNode$
};

const props = {
  emitError,
  emitSuccess,
  addObservation: (cmd) => Control.addControl()(cmd).toPromise()
};

export default inject(data, commands, props)(EditObservationPage);
