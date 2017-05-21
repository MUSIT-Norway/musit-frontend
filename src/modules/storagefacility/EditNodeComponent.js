import React from 'react';
import PropTypes from 'prop-types';
import StorageUnitContainer from './NodeDetails';
import inject from 'react-rxjs/dist/RxInject';
import { emitError, emitSuccess } from '../../shared/errors';
import nodeStore$, { clearNode$, loadNode$, updateState$ } from './nodeStore';
import MusitNode from '../../models/node';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';

export class EditStorageUnitContainer extends React.Component {
  static propTypes = {
    editNode: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    params: PropTypes.object,
    unit: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired,
    nodeStore: PropTypes.object.isRequired
  };

  componentWillMount() {
    const id = (this.props.location.state && this.props.location.state.uuid) ||
      this.props.params.id;
    const museumId = this.props.appSession.museumId;
    const token = this.props.appSession.accessToken;
    this.props.loadNode({ id, museumId, token });
  }

  componentWillReceiveProps(next) {
    if (next.nodeStore.rootNode && !this.props.nodeStore.rootNode) {
      this.props.updateState(next.nodeStore.rootNode);
    }
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        unit={this.props.nodeStore.unit}
        rootNode={this.props.nodeStore.rootNode}
        onLagreClick={data => {
          const id = this.props.params.id;
          const museumId = this.props.appSession.museumId;
          const token = this.props.appSession.accessToken;
          this.props
            .editNode({
              id,
              museumId,
              token,
              data,
              callback: {
                onComplete: () => {
                  hashHistory.goBack();
                  this.props.emitSuccess({
                    type: 'saveSuccess',
                    message: I18n.t('musit.storageUnits.messages.saveNodeSuccess')
                  });
                },
                onFailure: e => {
                  this.props.emitError({ ...e, type: 'network' });
                }
              }
            })
            .toPromise();
        }}
        loaded={!!this.props.nodeStore.unit && this.props.nodeStore.loaded}
      />
    );
  }
}

const data = {
  appSession$: { type: PropTypes.object.isRequired },
  nodeStore$
};

const commands = {
  loadNode$,
  clearNode$,
  updateState$
};

const props = {
  emitError,
  emitSuccess,
  editNode: MusitNode.editNode()
};

export default inject(data, commands, props)(EditStorageUnitContainer);
