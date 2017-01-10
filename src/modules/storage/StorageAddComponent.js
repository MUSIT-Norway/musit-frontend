import React, { PropTypes } from 'react';
import StorageUnitContainer from './StorageComponent';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../util/errors/emitter';

export default class AddNode extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    params: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    clearState: PropTypes.func.isRequired,
    unit: PropTypes.object
  };

  componentWillMount() {
    this.props.clearState();
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id, this.props.user.museumId);
    }
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        onLagreClick={(data, museumId) => {
          const parentId = this.props.params.id;
          this.props.onLagreClick(parentId, museumId, data, {
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
          });
        }}
        isAdd
        loaded={!!this.props.unit}
      />
    );
  }
}