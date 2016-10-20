
import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { insert } from '../../../reducers/storageunit/panel';
import StorageUnitContainerImpl from './page'
import { clear as clearState, update as updateState } from '../../../reducers/storageunit/panel/state'

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (parentId, data) => {
      dispatch(insert(parentId, data, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => { alert('Kunne ikke lagre node') }
      }))
    },
    updateState: (data) => dispatch(updateState(data)),
    clearState: () => dispatch(clearState())
  }
};

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelState
  }
};

class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    params: PropTypes.object,
    updateState: PropTypes.func.isRequired,
    clearState: PropTypes.func.isRequired,
    unit: PropTypes.object
  };

  componentWillMount() {
    this.props.clearState()
  }

  render() {
    return (
      <StorageUnitContainerImpl
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

export default connect(mapStateToProps, mapDispatchToProps)(AddStorageUnitContainer)
