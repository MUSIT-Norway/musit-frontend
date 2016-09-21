/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React, { Component, PropTypes } from 'react'
import { Modal } from 'react-bootstrap';
import Language from '../../../components/language'
import { loadRoot, clearRoot, loadChildren, loadPath, setCurrent } from '../../../reducers/storageunit/modal'
import Breadcrumb from '../../../layout/Breadcrumb'
import { NodeGrid } from '../../../components/grid'
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  translate: (key, markdown) => Language.translate(key, markdown),
  children: state.storageUnitModal.data || [],
  rootNode: state.storageUnitModal.root,
  path: state.storageUnitModal.root.path,
  currentId: state.storageUnitModal.currentId
})

const mapDispatchToProps = (dispatch) => {
  return ({
    clearRoot: () => {
      dispatch(clearRoot())
    },
    loadChildren: (id, callback) => {
      dispatch(loadChildren(id, callback))
      dispatch(loadRoot(id))
    },
    loadPath: (id) => {
      dispatch(loadPath(id))
    },
    setCurrentId: (id) => dispatch(setCurrent(id))
  })
}


@connect(mapStateToProps, mapDispatchToProps)
export default class MusitModal extends Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    initialId: PropTypes.number.isRequired
  }

  componentWillMount() {
    this.props.clearRoot()
    this.props.loadChildren(this.props.currentId || this.props.initialId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === false && this.props.show === true) {
      this.props.clearRoot()
    }
    if (nextProps.show === true && this.props.show === false && this.props.currentId) {
      this.props.loadChildren(this.props.currentId || this.props.initialId)
    }
  }

  render() {
    const { children, path } = this.props
    const { data: rootNodeData } = this.props.rootNode
    debugger;
    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          bsSize="large"
          aria-labelledby="contained-modal-title-lg"
        >
          <Modal.Header closeButton>
            {"Flytt gjenstander"}
          </Modal.Header>
          <Modal.Body>
            <NodeGrid
              id={rootNodeData ? rootNodeData.id : null}
              translate={this.props.translate}
              tableData={children}
              onAction={() => true}
              onClick={(node) => this.props.setCurrentId(node.id)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Breadcrumb nodes={path} onClickCrumb={node => true} />
          </Modal.Footer>
        </Modal>
      </div>
  );
  }
}
