import React, { PropTypes } from 'react';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import Actor from '../../models/actor';
import inject from 'react-rxjs/dist/RxInject';

export class EditObservationPage extends React.Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    rootNode: React.PropTypes.object,
    appSession: PropTypes.object.isRequired
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id, this.props.appSession.getMuseumId());
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

  getDoneByFromLocationState() {
    return new Actor(this.props.location.state.doneBy);
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
              museumId={this.props.appSession.getMuseumId()}
              observations={this.getObservationsFromLocationState()}
              doneDate={this.props.location.state.doneDate}
              doneBy={this.getDoneByFromLocationState()}
              onSaveObservation={this.props.onSaveObservation(this.props.location.state, this.props.appSession.getMuseumId())}
              mode="EDIT"
            />
          </div>
        }
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.object.isRequired }
};

export default inject(data)(EditObservationPage);
