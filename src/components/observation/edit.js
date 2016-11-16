import React, { PropTypes } from 'react';
import ObservationPage from './index';
import Layout from '../../layout';
import Breadcrumb from '../../layout/Breadcrumb';
import { I18n } from 'react-i18nify';

export default class EditObservationPage extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    rootNode: React.PropTypes.object
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id);
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

  render() {
    return (
      <Layout
        title={'Magasin'}
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.observation.page.titles.edit')}</h4>
            <ObservationPage
              id={this.props.params.id}
              observations={this.getObservationsFromLocationState()}
              doneDate={this.props.location.state.doneDate}
              doneBy={this.props.location.state.doneBy}
              onSaveObservation={this.props.onSaveObservation(this.props.location.state)}
              mode="EDIT"
            />
          </div>
        }
      />
    );
  }
}