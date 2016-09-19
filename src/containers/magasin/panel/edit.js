import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { load, update } from '../../../reducers/storageunit/panel';
import StorageUnitContainerImpl from './page'
import { loadPath } from '../../../reducers/storageunit/grid'

const mapStateToProps = (state) => {
  return {
    unit: state.storagePanelUnit.data
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
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EditStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    loadStorageUnit: PropTypes.func.isRequired,
    params: PropTypes.object,
    unit: PropTypes.object,
    loadPath: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.loadStorageUnit(this.props.params.id, {
      onSuccess: () => this.props.loadPath(this.props.params.id)
    })
  }

  render() {
    if (!this.props.unit) {
      return null; // We need data to display. If there is no data, there is nothing to display. Maybe spin wheel?
    }
    return (
      <StorageUnitContainerImpl
        unit={this.props.unit}
        onLagreClick={this.props.onLagreClick}
        params={this.props.params}
      />
    )
  }
}
