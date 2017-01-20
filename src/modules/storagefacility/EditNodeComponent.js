import React, { PropTypes } from 'react';
import StorageUnitContainer from './NodeDetails';
import inject from '../../state/inject';

export class EditStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    loadStorageUnit: PropTypes.func.isRequired,
    params: PropTypes.object,
    unit: PropTypes.object,
    loaded: PropTypes.bool.isRequired,
    updateState: PropTypes.func.isRequired,
    appSession: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.loadStorageUnit(this.props.location.state || this.props.params.id, this.props.appSession.getMuseumId(), {
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
        loaded={!!this.props.unit}
      />
    );
  }
}

export default inject({
  provided: { appSession: { type: React.PropTypes.object.isRequired } }
})(EditStorageUnitContainer);