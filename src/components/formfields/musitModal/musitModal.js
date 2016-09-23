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
import { Modal, Row, Col } from 'react-bootstrap'
import Breadcrumb from '../../../layout/Breadcrumb'
import { ModalNodeGrid } from '../../../components/grid'
import { SaveCancel } from '../../../components/formfields'

export default class MusitModal extends Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    headerText: PropTypes.string.isRequired,
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
          bsSize="modal"
          aria-labelledby="contained-modal-title-sm"
        >
          <Modal.Header closeButton style={{ border: 'none' }}>
            <Modal.Title id="title" style={{ textAlign: 'center' }}>
              {this.props.headerText}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: 300, overflow: 'auto' }}>
            <ModalNodeGrid
              tableData={children}
              onClick={(node) => this.props.setCurrentId(node.id)}
            />
          </Modal.Body>
          <Modal.Footer style={{ textAlign: 'center' }}>
            <Row style={{ textAlign: 'center' }}>
              <Col>
                {this.props.translate('musit.moveModal.currentDestination')}
              </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              <Col>
                <Breadcrumb nodes={path} onClickCrumb={node => this.props.setCurrentId(node.id)} />
              </Col>
            </Row>
            <br />
            <Row style={{ textAlign: 'center' }}>
              <Col xs={4} sm={4} smOffset={4}>
                <SaveCancel
                  translate={this.props.translate}
                  saveLabel={this.props.translate('musit.moveModal.move')}
                  onClickSave={(e) => {
                    e.preventDefault()
                    this.props.onMove(this.props.currentId)
                  }
                  }
                  onClickCancel={this.props.onHide}
                />
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </div>
  );
  }
}
