import React, { PropTypes } from 'react';
import ObservationPage from './ObservationPage';
import Layout from '../../layout';
import Breadcrumb from '../../layout/Breadcrumb';
import { I18n } from 'react-i18nify';

export default class ViewObservationPage extends React.Component {

  static propTypes = {
    observations: PropTypes.arrayOf(PropTypes.object),
    doneDate: PropTypes.string,
    doneBy: PropTypes.string,
    registeredBy: PropTypes.string,
    registeredDate: PropTypes.string,
    params: PropTypes.object.isRequired,
    loadObservation: PropTypes.func.isRequired,
    rootNode: React.PropTypes.object
  }

  componentWillMount() {
    if (this.props.params.obsId) {
      this.props.loadObservation(this.props.params.id, this.props.params.obsId, this.props.user.museumId);
    }
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id, this.props.user.museumId);
    }
  }

  render() {
    if (!this.props.observations) {
      return null; // We need data to display. If there is no data, there is nothing to display. Maybe spin wheel?
    }
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.observation.page.titles.view')}</h4>
            <ObservationPage
              id={this.props.params.id}
              user={this.props.user}
              onSaveObservation={() => true} // disable save
              observations={this.props.observations}
              doneBy={this.props.doneBy}
              doneDate={this.props.doneDate}
              registeredBy={this.props.registeredBy}
              registeredDate={this.props.registeredDate}
              saveDisabled
              mode="VIEW"
            />
          </div>
        }
      />
    );
  }
}