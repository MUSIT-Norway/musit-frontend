import React, { PropTypes } from 'react';
import StorageUnitContainer from './StorageComponent';

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
        rootNode={this.props.unit}
        loaded={this.props.loaded && !!this.props.unit}
      />
    );
  }
}