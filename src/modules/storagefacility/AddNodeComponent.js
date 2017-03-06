import React, { PropTypes } from 'react';
import StorageUnitContainer from './NodeDetails';
import inject from 'react-rxjs/dist/RxInject';
import  nodeStore$, { clearNode$, loadNode$, updateState$} from './nodeStore';
import { emitError, emitSuccess } from '../../shared/errors';
import { I18n } from 'react-i18nify';
import { hashHistory } from 'react-router';
import MusitNode from '../../models/node';

export class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired,
    params: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    clearNode: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.clearNode();
    this.props.loadNode({
      id: this.props.params.id,
      museumId: this.props.appSession.getMuseumId(),
      token: this.props.appSession.getAccessToken()
    });
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        rootNode={this.props.store.rootNode}
        unit={this.props.store.unit}
        onLagreClick={(data) => {
          const id = this.props.params.id;
          const museumId = this.props.appSession.getMuseumId();
          const token = this.props.appSession.getAccessToken();
          this.props.addNode({ id, museumId, token, data, callback: {
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
        isAdd
        loaded={!!this.props.store.unit}
      />
    );
  }
}


const data = {
  appSession$: { type: React.PropTypes.object.isRequired },
  store$: nodeStore$()
};

const commands = {
  loadNode$,
  clearNode$,
  updateState$
};

const addNode = (val) => MusitNode.addNode()(val).toPromise();

const props = {
  emitError,
  emitSuccess,
  addNode
};

export default inject(data, commands, props)(AddStorageUnitContainer);
