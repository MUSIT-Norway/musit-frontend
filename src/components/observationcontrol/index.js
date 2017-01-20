import React from 'react';
import ObservationControlGrid from './Grid';
import ObservationControlComponent from './LeftMenu';
import Layout from '../../layout';
import Breadcrumb from '../../layout/Breadcrumb';
import Toolbar from '../../layout/Toolbar';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';

export default class ObservationControlGridShow extends React.Component {
  static propTypes = {
    observationControlGridData: React.PropTypes.arrayOf(React.PropTypes.object),
    params: React.PropTypes.object,
    route: React.PropTypes.object,
    loadControlAndObservations: React.PropTypes.func.isRequired,
    loadStorageObj: React.PropTypes.func.isRequired,
    path: React.PropTypes.arrayOf(React.PropTypes.object)
  }

  constructor(props) {
    super(props);
    this.props.params.id = this.props.params.id * 1;
    this.state = {
      showObservations: this.props.route.showObservations,
      showControls: this.props.route.showControls
    };
  }

  componentWillMount() {
    this.props.loadControlAndObservations(this.props.params.id, this.props.user.museumId);
    this.props.loadStorageObj(this.props.params.id, this.props.user.museumId);
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
    return <ObservationControlGrid
      id={this.props.params.id}
      tableData={this.props.observationControlGridData.filter((e) => {
        if (e.eventType && this.state.showControls && this.state.showObservations) {
          return true;
        } else if (e.eventType && this.state.showControls) {
          return e.eventType.toLowerCase() === 'control';
        } else if (e.eventType && this.state.showObservations) {
          return e.eventType.toLowerCase() === 'observation';
        }
        return false;
      })}
    />;
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={
          <Breadcrumb
            node={this.props.rootNode}
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