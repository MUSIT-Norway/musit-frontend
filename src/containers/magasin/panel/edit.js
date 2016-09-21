import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { load, update } from '../../../reducers/storageunit/panel';
import StorageUnitContainerImpl from './page'
import { loadPath } from '../../../reducers/storageunit/grid'
import { update as updateState } from '../../../reducers/storageunit/panel/state'

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelState,
    loaded: !!state.storagePanelUnit.loaded
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLagreClick: (data) => {
      dispatch(update(data, {
        onSuccess: () => hashHistory.goBack(),
        onFailure: () => { alert('Kunne ikke lagre node') }
      }))
    },
    loadStorageUnit: (id, callback) => {
      dispatch(load(id, callback))
    },
    loadPath: (id) => {
      dispatch(loadPath(id))
    },
    updateState: data => dispatch(updateState(data))
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EditStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    loadStorageUnit: PropTypes.func.isRequired,
    params: PropTypes.object,
    unit: PropTypes.object,
    loadPath: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    updateState: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.loadStorageUnit(this.props.params.id, {
      onSuccess: (result) => {
        this.props.updateState(result)
        this.props.loadPath(this.props.params.id)
      }
    })
  }

  render() {
    return (
      <StorageUnitContainerImpl
        unit={this.props.unit}
        update={this.props.updateState}
        onLagreClick={this.props.onLagreClick}
        params={this.props.params}
        loaded={!!this.props.loaded && !!this.props.unit}
      />
    )
  }
}
