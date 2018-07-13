import * as React from 'react';
import * as PropTypes from 'prop-types';
import EventsGrid from './EventsGrid';
import EventsLeftMenu from './EventsLeftMenu';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Toolbar from '../../components/layout/Toolbar';
import { I18n } from 'react-i18nify';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch';
import store$, { clearEvents$, loadRootNode$, loadEvents$ } from './eventsStore';
import * as Loader from 'react-loader';
import Config from '../../config';
import { AppSession } from '../../types/appSession';
import { TODO } from '../../types/common';
import { Match } from '../../types/Routes';
import { History } from 'history';

interface EventsComponentProps {
  appSession: AppSession;
  store: TODO;
  match: Match<TODO>;
  route: object;
  loadEvents: Function;
  loadRootNode: Function;
  clearEvents: Function;
  loader: JSX.Element;
  history: History;

  // ---
  showControls: boolean;
  showObservations: boolean;
}

/* Old:
  static propTypes = {
    appSession: PropTypes.object,
    store: PropTypes.object,
    match: PropTypes.object,
    route: PropTypes.object,
    loadEvents: PropTypes.func.isRequired,
    loadRootNode: PropTypes.func.isRequired,
    clearEvents: PropTypes.func.isRequired,
    loader: PropTypes.element.isRequired,
    history: PropTypes.object
  };
*/

interface EventsComponentState {
  showControls: boolean;
  showObservations: boolean;
}

export class EventsComponent extends React.Component<
  EventsComponentProps,
  EventsComponentState
> {
  constructor(props: EventsComponentProps) {
    super(props);
    this.state = {
      showObservations: this.props.showObservations,
      showControls: this.props.showControls
    };
  }

  static defaultProps = {
    loader: <Loader loaded={false} />
  };

  componentWillMount() {
    const params = this.props.match.params || {};
    this.props.clearEvents();
    this.props.loadEvents({
      nodeId: params.id,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
    this.props.loadRootNode({
      id: params.id,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
  }

  makeToolbar() {
    return (
      <Toolbar
        showCenter={this.state.showControls}
        showLeft={this.state.showObservations}
        hideRight={true}
        labelCenter={I18n.t('musit.grid.button.controls')}
        labelLeft={I18n.t('musit.grid.button.observations')}
        placeHolderSearch={I18n.t('musit.grid.search.placeHolder')}
        clickShowCenter={() =>
          this.setState(ps => ({
            ...ps,
            showControls: !this.state.showControls
          }))
        }
        clickShowLeft={() =>
          this.setState(ps => ({
            ...ps,
            showObservations: !this.state.showObservations
          }))
        }
      />
    );
  }

  makeLeftMenu(historyPush: Function) {
    const nodeId = this.props.match.params.id;
    const appSession = this.props.appSession;
    return (
      <div style={{ paddingTop: 10 }}>
        {appSession.rolesForModules.storageFacilityWrite && (
          <EventsLeftMenu
            id={nodeId}
            //??? selectObservation
            //??? selectControl
            onClickNewObservation={() =>
              historyPush(
                Config.magasin.urls.client.storagefacility.addObservation(
                  nodeId,
                  appSession
                )
              )
            }
            onClickNewControl={() =>
              historyPush(
                Config.magasin.urls.client.storagefacility.addControl(nodeId, appSession)
              )
            }
          />
        )}
      </div>
    );
  }

  makeContent(historyPush: TODO) {
    if (this.props.store.loading) {
      return this.props.loader;
    }
    const filtered = this.props.store.data.filter((e: TODO) => {
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
    const nodeId = this.props.match.params.id;
    const appSession = this.props.appSession;
    return (
      <EventsGrid
        id={nodeId}
        showControl={(ctl: TODO) =>
          historyPush(
            Config.magasin.urls.client.storagefacility.viewControl(
              nodeId,
              ctl.id,
              appSession
            )
          )
        }
        showObservation={(obs: TODO) =>
          historyPush(
            Config.magasin.urls.client.storagefacility.viewObservation(
              nodeId,
              obs.id,
              appSession
            )
          )
        }
        tableData={filtered}
      />
    );
  }

  showNodes(node: TODO, historyPush: TODO) {
    const appSession = this.props.appSession;
    if (node && node.nodeId) {
      historyPush(
        Config.magasin.urls.client.storagefacility.goToNode(node.nodeId, appSession)
      );
    } else {
      historyPush(Config.magasin.urls.client.storagefacility.goToRoot(appSession));
    }
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={
          <Breadcrumb
            node={this.props.store.rootNode}
            onClickCrumb={(node: TODO) => this.showNodes(node, this.props.history.push)}
            allActive
          />
        }
        toolbar={this.makeToolbar()}
        leftMenu={this.makeLeftMenu(this.props.history.push)}
        content={this.makeContent(this.props.history.push)}
      />
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  store$
};

const commands = {
  clearEvents$,
  loadRootNode$,
  loadEvents$
};

export default inject(data, commands)(EventsComponent);
