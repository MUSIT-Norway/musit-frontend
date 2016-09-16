import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { load, update } from '../../../reducers/storageunit/panel';
import StorageUnitContainerImpl from './page'

const mapStateToProps = (state) => {
  return {
    unit: (state.storagePanelUnit && state.storagePanelUnit.data) ? state.storagePanelUnit.data : {}
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
    loadStorageUnit: (id) => {
      dispatch(load(id))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EditStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    loadStorageUnit: PropTypes.func.isRequired,
    params: PropTypes.object,
    unit: PropTypes.object
  }

  componentWillMount() {
    this.props.loadStorageUnit(this.props.params.id)
  }

  render() {
    return (
      <StorageUnitContainerImpl
        unit={this.props.unit}
        onLagreClick={data => this.props.onLagreClick(data)}
        params={this.props.params}
      />
    )
  }
}
