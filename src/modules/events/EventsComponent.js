import React from 'react';
import ObservationControlGrid from './EventsGrid';
import ObservationControlComponent from './EventsLeftMenu';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Toolbar from '../../components/layout/Toolbar';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import inject from 'react-rxjs/dist/RxInject';
import store$, {
  clearEvents$,
  loadRootNode$,
  loadEvents$
} from './eventsStore';
import Loader from 'react-loader';

export class EventsComponent extends React.Component {
  static propTypes = {
    store: React.PropTypes.object,
    params: React.PropTypes.object,
    route: React.PropTypes.object,
    loadEvents: React.PropTypes.func.isRequired,
    loadRootNode: React.PropTypes.func.isRequired,
    clearEvents: React.PropTypes.func.isRequired,
    loader: React.PropTypes.element.isRequired
  }

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
    return <Toolbar
      showRight={this.state.showControls}
      showLeft={this.state.showObservations}
      labelRight={I18n.t('musit.grid.button.controls')}
      labelLeft={I18n.t('musit.grid.button.observations')}
      placeHolderSearch={I18n.t('musit.grid.search.placeHolder')}
      clickShowRight={() => this.setState({ ...this.state, showControls: !this.state.showControls })}
      clickShowLeft={() => this.setState({ ...this.state, showObservations: !this.state.showObservations })}
    />;
  }

  makeLeftMenu() {
    return <div style={{ paddingTop: 10 }}>
      <ObservationControlComponent
        id={this.props.params.id}
        selectObservation
        selectControl
        onClickNewObservation={() => hashHistory.push(`/magasin/${this.props.params.id}/observation/add`)}
        onClickNewControl={() => hashHistory.push(`/magasin/${this.props.params.id}/control/add`)}
      />
    </div>;
  }

  makeContent() {
    if (this.props.store.loading) {
      return this.props.loader;
    }
    const filtered = this.props.store.data.filter((e) => {
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
    return <ObservationControlGrid
      id={this.props.params.id}
      tableData={filtered}
    />;
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={
          <Breadcrumb
            node={this.props.store.rootNode}
            onClickCrumb={(node) => hashHistory.push(node.url)}
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
