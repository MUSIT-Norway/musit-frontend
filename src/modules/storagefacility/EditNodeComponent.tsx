import * as React from 'react';
import * as PropTypes from 'prop-types';
import StorageUnitContainer from './NodeDetails';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch/';
import { emitError, emitSuccess } from '../../shared/errors';
import nodeStore$, { clearNode$, loadNode$, updateState$ } from './nodeStore';
import MusitNode from '../../models/node';
import { I18n } from 'react-i18nify';
import { Match } from '../../types/Routes';
import { TODO, TODO_NodeStore } from '../../types/common';
import { AppSession } from '../../types/appSession';
import { History } from 'history';

interface EditStorageUnitContainerProps {
  editNode: Function;
  loadNode: Function;
  clearNode: Function; //TODO, sjekk om denne behøves
  match: Match<TODO>;
  unit?: object;
  updateState: Function;
  appSession: AppSession;
  nodeStore: TODO_NodeStore;
  goBack: Function;
  emitSuccess: Function;
  emitError: Function;
  history: History;
}
/* Old:
  static propTypes = {
    editNode: PropTypes.func.isRequired,
    loadNode: PropTypes.func.isRequired,
    match: PropTypes.object,
    unit: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired,
    nodeStore: PropTypes.object.isRequired,
    goBack: PropTypes.func
  };

*/

export class EditStorageUnitContainer extends React.Component<
  EditStorageUnitContainerProps
> {
  componentWillMount() {
    this.props.clearNode();
    this.props.loadNode({
      id: this.props.match.params.id,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
  }

  componentWillReceiveProps(next: EditStorageUnitContainerProps) {
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
        onLagreClick={(data: TODO) => {
          const id = this.props.match.params.id;
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
                  this.props.goBack();
                  this.props.emitSuccess({
                    type: 'saveSuccess',
                    message: I18n.t('musit.storageUnits.messages.saveNodeSuccess')
                  });
                },
                onFailure: (e: TODO) => {
                  this.props.emitError({ ...e, type: 'network' });
                }
              }
            })
            .toPromise();
        }}
        loaded={!!this.props.nodeStore.unit && this.props.nodeStore.loaded}
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

const props = (props: EditStorageUnitContainerProps) => ({
  ...props,
  emitError,
  emitSuccess,
  editNode: MusitNode.editNode(),
  goBack: props.history.goBack
});

export default inject(data, commands, props)(EditStorageUnitContainer);
