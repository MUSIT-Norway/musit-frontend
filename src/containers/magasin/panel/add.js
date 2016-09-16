import React, { PropTypes } from 'react'
import { connect } from 'react-redux';
import { hashHistory } from 'react-router'
import { insert } from '../../../reducers/storageunit/panel';
import StorageUnitContainerImpl from './page'
import { loadPath } from '../../../reducers/storageunit/grid'

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
    }
  }
}

@connect(null, mapDispatchToProps)
export default class AddStorageUnitContainer extends React.Component {
  static propTypes = {
    onLagreClick: PropTypes.func.isRequired,
    params: PropTypes.object,
    loadPath: PropTypes.func.isRequired
  }

  componentWillMount() {
    if (this.props.params.parentId) {
      this.props.loadPath(this.props.params.parentId)
    }
  }

  render() {
    return (
      <StorageUnitContainerImpl
        onLagreClick={data => this.props.onLagreClick(this.props.params.parentId, data)}
        params={this.props.params}
        isAdd
      />
    )
  }
}
