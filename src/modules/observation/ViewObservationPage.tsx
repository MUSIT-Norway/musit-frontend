import * as React from 'react';
import * as PropTypes from 'prop-types';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import store$, { setLoading$, loadRootNode$, getObservation$ } from './observationStore';
import { Match } from '../../types/Routes';
import { TODO } from '../../types/common';
import { AppSession } from '../../types/appSession';

interface ViewObservationPageProps {
  match: Match<TODO>;
  setLoading: Function;
  getObservation: Function;
  loadRootNode: Function;
  store: TODO;
  goBack: Function;

  //NEW:
  appSession: AppSession;
}

/* Old:
  static propTypes = {
    match: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired,
    getObservation: PropTypes.func.isRequired,
    loadRootNode: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired
  };
*/

export class ViewObservationPage extends React.Component<ViewObservationPageProps> {
  componentWillMount() {
    this.props.setLoading();
    this.props.getObservation({
      nodeId: this.props.match.params.id,
      observationId: this.props.match.params.obsId,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
    this.props.loadRootNode({
      id: this.props.match.params.id,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
  }

  render() {
    if (!this.props.store.data.observations) {
      return null; // We need data to display. If there is no data, there is nothing to display. Maybe spin wheel?
    }
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={<Breadcrumb node={this.props.store.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>
              {I18n.t('musit.observation.page.titles.view')}
            </h4>
            <ObservationPage
              appSession={this.props.appSession}
              goBack={this.props.goBack}
              id={this.props.match.params.id}
              onSaveObservation={() => true} // disable save
              observations={this.props.store.data.observations}
              doneBy={this.props.store.data.doneBy}
              doneDate={this.props.store.data.doneDate}
              registeredBy={this.props.store.data.registeredBy}
              registeredDate={this.props.store.data.registeredDate}
              saveDisabled
              mode="VIEW"
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
  setLoading$,
  getObservation$,
  loadRootNode$
};

const props = (props: TODO) => ({
  ...props,
  goBack: props.history.goBack
});

export default inject(data, commands, props)(ViewObservationPage);
