import React from 'react';
import EventsGrid from './EventsGrid';
import EventsLeftMenu from './EventsLeftMenu';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Toolbar from '../../components/layout/Toolbar';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import inject from 'react-rxjs/dist/RxInject';
import store$, { clearEvents$, loadRootNode$, loadEvents$ } from './eventsStore';
import Loader from 'react-loader';
import Config from '../../config';

export class EventsComponent extends React.Component {
  static propTypes = {
    appSession: React.PropTypes.object,
    store: React.PropTypes.object,
    params: React.PropTypes.object,
    route: React.PropTypes.object,
    loadEvents: React.PropTypes.func.isRequired,
    loadRootNode: React.PropTypes.func.isRequired,
    clearEvents: React.PropTypes.func.isRequired,
    loader: React.PropTypes.element.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showObservations: this.props.route.showObservations,
      showControls: this.props.route.showControls
    };
  }

  static defaultProps = {
    loader: <Loader loaded={false} />
  };

  componentWillMount() {
    this.props.clearEvents();
    this.props.loadEvents({
      nodeId: this.props.params.id,
      museumId: this.props.appSession.getMuseumId(),
      token: this.props.appSession.getAccessToken()
    });
    this.props.loadRootNode({
      id: this.props.params.id,
      museumId: this.props.appSession.getMuseumId(),
      token: this.props.appSession.getAccessToken()
    });
  }

  makeToolbar() {
    return (
      <Toolbar
        showRight={this.state.showControls}
        showLeft={this.state.showObservations}
        labelRight={I18n.t('musit.grid.button.controls')}
        labelLeft={I18n.t('musit.grid.button.observations')}
        placeHolderSearch={I18n.t('musit.grid.search.placeHolder')}
        clickShowRight={() =>
          this.setState({ ...this.state, showControls: !this.state.showControls })}
        clickShowLeft={() =>
          this.setState({
            ...this.state,
            showObservations: !this.state.showObservations
          })}
      />
    );
  }

  makeLeftMenu() {
    const nodeId = this.props.params.id;
    const appSession = this.props.appSession;
    return (
      <div style={{ paddingTop: 10 }}>
        <EventsLeftMenu
          id={this.props.params.id}
          selectObservation
          selectControl
          onClickNewObservation={() =>
            hashHistory.push(
              Config.magasin.urls.client.storagefacility.addObservation(
                nodeId,
                appSession
              )
            )}
          onClickNewControl={() =>
            hashHistory.push(
              Config.magasin.urls.client.storagefacility.addControl(nodeId, appSession)
            )}
        />
      </div>
    );
  }

  makeContent() {
    if (this.props.store.loading) {
      return this.props.loader;
    }
    const filtered = this.props.store.data.filter(e => {
      if (e.eventType && this.state.showControls && this.state.showObservations) {
        return true;
      } else if (e.eventType && this.state.showControls) {
        return e.eventType.toLowerCase() === 'control';
      } else if (e.eventType && this.state.showObservations) {
        return e.eventType.toLowerCase() === 'observation';
      }
      return false;
    });
    if (filtered.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: 'grey' }}>
          {I18n.t('musit.events.noData')}
        </div>
      );
    }
    const nodeId = this.props.params.id;
    const appSession = this.props.appSession;
    return (
      <EventsGrid
        id={nodeId}
        showControl={ctl =>
          hashHistory.push(
            Config.magasin.urls.client.storagefacility.viewControl(
              nodeId,
              ctl.id,
              appSession
            )
          )}
        showObservation={obs =>
          hashHistory.push(
            Config.magasin.urls.client.storagefacility.viewObservation(
              nodeId,
              obs.id,
              appSession
            )
          )}
        tableData={filtered}
      />
    );
  }

  showNodes(node) {
    const appSession = this.props.appSession;
    if (node && node.id) {
      hashHistory.push(
        Config.magasin.urls.client.storagefacility.goToNode(node.id, appSession)
      );
    } else {
      hashHistory.push(Config.magasin.urls.client.storagefacility.goToRoot(appSession));
    }
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={
          <Breadcrumb
            node={this.props.store.rootNode}
            onClickCrumb={node => this.showNodes(node)}
            allActive
          />
        }
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu()}
        content={this.makeContent()}
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$
};

const commands = {
  clearEvents$,
  loadRootNode$,
  loadEvents$
};

export default inject(data, commands)(EventsComponent);
