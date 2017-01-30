import React, { PropTypes } from 'react';
import StorageUnitContainer from './NodeDetails';
import inject from 'react-rxjs/dist/RxInject';

export class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    params: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    clearState: PropTypes.func.isRequired,
    unit: PropTypes.object,
    appSession: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.clearState();
    this.props.loadStorageObj(this.props.params.id, this.props.appSession.getMuseumId());
  }

  render() {
    return (
      <StorageUnitContainer
        {...this.props}
        onLagreClick={(data) => {
          const parentId = this.props.params.id;
          const museumId = this.props.appSession.getMuseumId();
          this.props.onLagreClick(parentId, museumId, data);
        }}
        isAdd
        loaded={!!this.props.unit}
      />
    );
  }
}

const data = {
  appSession$: { type: React.PropTypes.object.isRequired }
};

export default inject(data)(AddStorageUnitContainer);
