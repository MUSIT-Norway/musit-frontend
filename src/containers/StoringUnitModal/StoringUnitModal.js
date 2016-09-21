
import React from 'react'
// import { loadObjects } from '../../reducers/storageobject/grid'
// import { add } from '../../reducers/picklist'
// import { hashHistory } from 'react-router'
// import Breadcrumb from '../../layout/Breadcrumb'
import MusitModal from '../../components/formfields'

export default class StoringUnitModal extends React.Component {
  render() {
    return (
      <span>
        <MusitModal
          valueHeader="Hi"
          valueBody="dfsdf"
          valueFooter="dfsdfsd"
          show
          onHide
        />
      </span>
    )
  }
}
