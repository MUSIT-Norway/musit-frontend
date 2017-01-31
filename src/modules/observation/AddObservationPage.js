import React, { PropTypes } from 'react';
import ObservationPage from './ObservationPage';
import Layout from '../../components/layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { I18n } from 'react-i18nify';
import inject from 'react-rxjs/dist/RxInject';

export class AddObservationPage extends React.Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    onSaveObservation: PropTypes.func.isRequired,
    actor: PropTypes.object,
    rootNode: React.PropTypes.object,
    appSession: PropTypes.object.isRequired
  }

  componentWillMount() {
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id, this.props.appSession.getMuseumId());
    }
  }

  render() {
    return (
      <Layout
        title={I18n.t('musit.storageUnits.title')}
        breadcrumb={<Breadcrumb node={this.props.rootNode} disabled />}
        content={
          <div>
            <h4 style={{ textAlign: 'center' }}>{I18n.t('musit.observation.page.titles.add')}</h4>
            <ObservationPage
              id={this.props.params.id}
              museumId={this.props.appSession.getMuseumId()}
              onSaveObservation={this.props.onSaveObservation}
              mode="ADD"
              doneBy={this.props.appSession.getActor()}
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

export default inject(data)(AddObservationPage);
