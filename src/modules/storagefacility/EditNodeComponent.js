import React, { PropTypes } from 'react';
import StorageUnitContainer from './NodeDetails';
import inject from 'react-rxjs/dist/RxInject';
import { emitError, emitSuccess } from '../../shared/errors';
import  nodeStore$, { clearNode$, loadNode$, updateState$} from './nodeStore';
import MusitNode from '../../models/node';
import MusitActor from '../../models/actor';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';

export class EditStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    getActorName: PropTypes.func.isRequired,
    loadStorageUnit: PropTypes.func.isRequired,
    params: PropTypes.object,
    unit: PropTypes.object,
    loaded: PropTypes.bool.isRequired,
    updateState: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired
  };

  componentWillMount() {
    const id = (this.props.location.state && this.props.location.state.id) || this.props.params.id;
    const museumId = this.props.appSession.getMuseumId();
    const token = this.props.appSession.getAccessToken();
    this.props.loadNode({ id, museumId, token, callback: {
      onComplete: (node) => {
        this.props.getActor({ token, actorId: node.response.updatedBy, callback: {
          onComplete: (name) => this.props.updateState({...node.response, updatedByName: name.response.fn}),
          onFailure: () => this.props.updateState(node.response)
        }});
      }
    }});
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        unit={this.props.store.unit}
        rootNode={this.props.store.rootNode}
        onLagreClick={(data) => {
          const id = this.props.params.id;
          const museumId = this.props.appSession.getMuseumId();
          const token = this.props.appSession.getAccessToken();
          this.props.editNode({ id, museumId, token, data, callback: {
            onComplete: () => {
              hashHistory.goBack();
              this.props.emitSuccess({
                type: 'saveSuccess',
                message:  I18n.t('musit.storageUnits.messages.saveNodeSuccess')
              });
            },
            onFailure: (e) => {
              this.props.emitError({...e, type: 'network'});
            }
          }});
        }}
        loaded={!!this.props.store.unit}
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$: nodeStore$
};

const commands = {
  loadNode$,
  clearNode$,
  updateState$
};

const props = {
  emitError,
  emitSuccess,
  editNode: (val) => MusitNode.editNode()(val).toPromise(),
  getActor: (val) => MusitActor.getActor()(val).toPromise()
};

export default inject(data, commands, props)(EditStorageUnitContainer);
