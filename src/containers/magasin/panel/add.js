import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { insert } from '../../../reducers/storageunit/panel';
import StorageUnitContainerImpl from './page'
import { loadPath } from '../../../reducers/storageunit/grid'
import { clear as clearState, update as updateState } from '../../../reducers/storageunit/panel/state'

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (parentId, data) => {
      dispatch(insert(parentId, data, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => { alert('Kunne ikke lagre node') }
      }))
    },
    loadPath: (id) => {
      dispatch(loadPath(id))
    },
    updateState: data => dispatch(updateState(data)),
    clearState: () => dispatch(clearState())
  }
}

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelState
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    params: PropTypes.object,
    loadPath: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    clearState: PropTypes.func.isRequired,
    unit: PropTypes.object
  }

  componentWillMount() {
    if (this.props.params.parentId) {
      this.props.loadPath(this.props.params.parentId)
    }
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
