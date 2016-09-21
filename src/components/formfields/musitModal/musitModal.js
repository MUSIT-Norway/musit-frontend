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
import Breadcrumb from '../../../layout/Breadcrumb'
import { NodeGrid } from '../../../components/grid'

export default class MusitModal extends Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    loadChildren: PropTypes.func.isRequired,
    loadPath: PropTypes.func.isRequired,
    clearPath: PropTypes.func.isRequired,
    loadRoot: PropTypes.func.isRequired,
    setCurrentId: PropTypes.func.isRequired,
    clearCurrentId: PropTypes.func.isRequired,
    currentId: PropTypes.number,
    path: PropTypes.arrayOf(PropTypes.object),
    translate: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.object)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true && this.props.show === false) {
      this.props.loadRoot()
    }
    if (nextProps.currentId && nextProps.currentId !== this.props.currentId) {
      this.loadStuff(nextProps.currentId)
    }
  }

  loadStuff(initialId) {
    this.props.loadChildren(initialId)
    this.props.loadPath(initialId)
  }

  render() {
    const { children, path } = this.props
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
              translate={this.props.translate}
              tableData={children}
              onAction={() => true}
              onClick={(node) => this.props.setCurrentId(node.id)}
            />
          </Modal.Body>
          <Modal.Footer>
            <span
              onClick={() => {
                this.props.clearCurrentId()
                this.props.clearPath()
                this.props.loadRoot()
              }}
            >
              Go to top
            </span><Breadcrumb nodes={path} onClickCrumb={node => this.props.setCurrentId(node.id)} />
          </Modal.Footer>
        </Modal>
      </div>
  );
  }
}
