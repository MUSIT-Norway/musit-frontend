import React, { PropTypes } from 'react';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import inject from 'react-rxjs/dist/RxInject';
import store$, { setLoading$, loadRootNode$, getObservation$ } from './observationStore';

export class ViewObservationPage extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    setLoading: PropTypes.func.isRequired,
    getObservation: PropTypes.func.isRequired,
    loadRootNode: PropTypes.func.isRequired,
    store: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.setLoading();
    this.props.getObservation({
      nodeId: this.props.params.id,
      observationId: this.props.params.obsId,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
    this.props.loadRootNode({
      id: this.props.params.id,
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
              id={this.props.params.id}
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
  appSession$: { type: React.PropTypes.object.isRequired },
  store$
};

const commands = {
  setLoading$,
  getObservation$,
  loadRootNode$
};

export default inject(data, commands)(ViewObservationPage);
