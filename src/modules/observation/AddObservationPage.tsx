import * as React from 'react';
import * as PropTypes from 'prop-types';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import { emitError, emitSuccess } from '../../shared/errors';
import store$, { loadRootNode$ } from './observationStore';
import Observation from '../../models/observation';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';
import { Match } from '../../types/Routes';

interface AddObservationPageProps {
  match: Match<TODO>;
  addObservation: Function;
  loadRootNode: Function;
  emitError: Function;
  emitSuccess: Function;
  actor?: object;
  rootNode?: object;
  appSession: AppSession;
  goBack: Function;

  store: TODO;
}

/* Old:

  static propTypes = {
    match: PropTypes.object.isRequired,
    addObservation: PropTypes.func.isRequired,
    loadRootNode: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
    emitSuccess: PropTypes.func.isRequired,
    actor: PropTypes.object,
    rootNode: PropTypes.object,
    appSession: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired
  };


*/
export class AddObservationPage extends React.Component<AddObservationPageProps> {
  componentWillMount() {
    if (!this.props.store.rootNode) {
      this.props.loadRootNode({
        id: this.props.match.params.id,
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
              appSession={this.props.appSession}
              goBack={this.props.goBack}
              id={this.props.match.params.id}
              onSaveObservation={(nodeId: TODO, data: TODO) => {
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
                        this.props.goBack();
                        this.props.emitSuccess({
                          type: 'saveSuccess',
                          message: I18n.t('musit.observation.page.messages.saveSuccess')
                        });
                      },
                      onFailure: (e: TODO) =>
                        this.props.emitError({ ...e, type: 'network' })
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

const props = (props: TODO) => ({
  ...props,
  emitError,
  emitSuccess,
  addObservation: Observation.addObservation(),
  goBack: props.history.goBack
});

export default inject(data, commands, props)(AddObservationPage);
