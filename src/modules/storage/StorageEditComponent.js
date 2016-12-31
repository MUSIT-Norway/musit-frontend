import React, { PropTypes } from 'react';
import StorageUnitContainer from './StorageComponent';
import { hashHistory } from 'react-router';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../util/errors/emitter';

export default class EditNode extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    loadStorageUnit: PropTypes.func.isRequired,
    params: PropTypes.object,
    unit: PropTypes.object,
    loaded: PropTypes.bool.isRequired,
    updateState: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.loadStorageUnit(this.props.params.id, this.props.user.museumId, {
      onSuccess: (result) => {
        this.props.updateState(result);
      }
    });
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        onLagreClick={(data, museumId) => {
          this.props.onLagreClick(data, museumId, {
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
        rootNode={this.props.unit}
        loaded={this.props.loaded && !!this.props.unit}
      />
    );
  }
}