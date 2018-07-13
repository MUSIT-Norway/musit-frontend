import React from 'react';
import PropTypes from 'prop-types';
import StorageUnitContainer from './NodeDetails';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch/';
import nodeStore$, { clearNode$, loadNode$, updateState$ } from './nodeStore';
import { emitError, emitSuccess } from '../../shared/errors';
import { I18n } from 'react-i18nify';
import MusitNode from '../../models/node';

export class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    nodeStore: PropTypes.object.isRequired,
    match: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    clearNode: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired,
    goBack: PropTypes.func
  };

  componentWillMount() {
    this.props.clearNode();
    this.props.loadNode({
      id: this.props.match.params.id,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        rootNode={this.props.nodeStore.rootNode}
        unit={this.props.nodeStore.unit}
        onLagreClick={data => {
          const id = this.props.nodeStore.rootNode
            ? this.props.nodeStore.rootNode.id
            : null;
          const museumId = this.props.appSession.museumId;
          const token = this.props.appSession.accessToken;
          this.props
            .addNode({
              id,
              museumId,
              token,
              data,
              callback: {
                onComplete: () => {
                  this.props.goBack();
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
        isAdd
        loaded={!!this.props.nodeStore.unit}
        goBack={this.props.goBack}
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

const props = props => ({
  ...props,
  emitError,
  emitSuccess,
  addNode: MusitNode.addNode(),
  goBack: props.history.goBack
});

export default inject(data, commands, props)(AddStorageUnitContainer);
