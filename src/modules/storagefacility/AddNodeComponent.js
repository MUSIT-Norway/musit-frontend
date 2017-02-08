import React, { PropTypes } from 'react';
import StorageUnitContainer from './NodeDetails';
import inject from 'react-rxjs/dist/RxInject';
import  nodeStore$, { clearNode$, loadNode$, addNode$, updateState$} from './nodeStore';
import { emitError, emitSuccess } from '../../shared/errors';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';

export class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired,
    params: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    clearNode: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    unit: PropTypes.object,
    appSession: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.clearNode();
    this.loadNode(this.props.params.id,this.props.appSession.getMuseumId(), this.props.appSession.getAccessToken());

  }


  loadNode(parentId, museumId, token) {
    const cmd = {parentId, museumId, token};
    this.props.loadNode(cmd);
  }

  addNode(parentId, museumId, token, data, callback) {
    const cmd = {nodeId: parentId, museumId, token, data, callback};
    this.props.addNode(cmd);
  }

  render() {
    console.log(this.props);
    return (
      <StorageUnitContainer
        {...this.props}
        unit={this.props.store}
        onLagreClick={(data) => {
          const parentId = this.props.params.id;
          const museumId = this.props.appSession.getMuseumId();
          const token = this.props.appSession.getAccessToken();
          const callback = {
            onSuccess: () => {
              hashHistory.goBack();
              emitSuccess(
                {
                  type: 'saveSuccess',
                  message:  I18n.t('musit.storageUnits.messages.saveNodeSuccess')
                }
                );
            },
            onFailure: (e) => {
              emitError({...e, type: 'network'});
            }
          };
          this.addNode(parentId, museumId,token, data, callback);
        }}
        isAdd
        loaded={!!this.props.unit}
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
  addNode$,
  updateState$
};

export default inject(data, commands)(AddStorageUnitContainer);
