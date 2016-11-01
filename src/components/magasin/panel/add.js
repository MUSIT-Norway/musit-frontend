import React, { PropTypes } from 'react'
import StorageUnitContainer from './index'

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
    this.props.clearState()
  }

  render() {
    return (
      <StorageUnitContainer
        translate={this.props.translate}
        onLagreClick={(data) => {
          const parentId = this.props.params.parentId;
          this.props.onLagreClick(parentId, data)
        }}
        updateState={this.props.updateState}
        unit={this.props.unit}
        params={this.props.params}
        isAdd
        loaded={!!this.props.unit}
      />
    )
  }
}