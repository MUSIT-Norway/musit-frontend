import * as React from 'react';
import * as PropTypes from 'prop-types';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { emitError, emitSuccess } from '../../shared/errors';
import store$, { loadRootNode$ } from './observationStore';
import Control from '../../models/control';
import { TODO, TODO_NodeStore } from '../../types/common';
import { Match } from '../../types/Routes';
import { AppSession } from '../../types/appSession';
import { History } from 'history';

interface EditObservationPageProps {
  location: TODO;
  addObservation: Function;
  emitError: Function;
  emitSuccess: Function;
  match: Match<TODO>;
  rootNode: object;
  appSession: AppSession;
  goBack: Function;

  //Nye:
  loadRootNode: Function;

  store: TODO_NodeStore;
  history: History;
}

/* Old:
  static propTypes = {
    location: PropTypes.object.isRequired,
    addObservation: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    rootNode: PropTypes.object,
    appSession: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired
  };

*/

export class EditObservationPage extends React.Component<EditObservationPageProps> {
  componentWillMount() {
    if (!this.props.store.rootNode) {
      this.props.loadRootNode({
        id: this.props.match.params.id,
        museumId: this.props.appSession.museumId,
        token: this.props.appSession.accessToken
      });
    }
  }

  getObservationsFromLocationState() {
    return Object.keys(this.props.location.state)
      .filter(o => o.endsWith('OK') && this.props.location.state[o] === false)
      .map(o => {
        switch (o) {
          case 'pestOK':
            return {
              type: 'pest',
              data: ObservationPage.createDefaultPestData()
            };
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
      });
  }

  getDoneByFromLocationState() {
    return this.props.location.state.doneBy;
  }

  render() {
    return (
      <Layout
        title={'Magasin'}
        breadcrumb={<Breadcrumb node={this.props.store.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>
              {I18n.t('musit.observation.page.titles.edit')}
            </h4>
            <ObservationPage
              appSession={this.props.appSession}
              goBack={this.props.goBack}
              id={this.props.match.params.id}
              observations={this.getObservationsFromLocationState()}
              doneDate={this.props.location.state.doneDate}
              doneBy={this.getDoneByFromLocationState()}
              onSaveObservation={(nodeId: TODO, observations: TODO) => {
                const museumId = this.props.appSession.museumId;
                const token = this.props.appSession.accessToken;
                const controlData = this.props.location.state;
                this.props
                  .addObservation({
                    nodeId,
                    museumId,
                    controlData,
                    observations,
                    token,
                    callback: {
                      onComplete: () => {
                        this.props.goBack();
                        this.props.emitSuccess({
                          type: 'saveSuccess',
                          message: I18n.t('musit.newControl.saveControlSuccess')
                        });
                      },
                      onFailure: (e: TODO) =>
                        this.props.emitError({ ...e, type: 'network' })
                    }
                  })
                  .toPromise();
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
  appSession$: { type: PropTypes.object.isRequired },
  store$
};

const commands = {
  loadRootNode$
};

const props = (props: EditObservationPageProps) => ({
  ...props,
  emitError,
  emitSuccess,
  addObservation: Control.addControl(),
  goBack: props.history.goBack
});

export default inject(data, commands, props)(EditObservationPage);
