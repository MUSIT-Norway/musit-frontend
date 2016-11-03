import React, { PropTypes } from 'react';
import StorageUnitContainer from './index';

export default class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    params: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    clearState: PropTypes.func.isRequired,
    unit: PropTypes.object,
    translate: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.clearState();
    if (!this.props.rootNode.path) {
      this.props.loadStorageObj(this.props.params.id);
    }
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        onLagreClick={(data) => {
          const parentId = this.props.params.id;
          this.props.onLagreClick(parentId, data);
        }}
        isAdd
        loaded={!!this.props.unit}
      />
    );
  }
}