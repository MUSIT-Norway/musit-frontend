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
    onClose: PropTypes.func.isRequired,
    headerText: PropTypes.string.isRequired,
    loadChildren: PropTypes.func.isRequired,
    loadPath: PropTypes.func.isRequired,
    clearPath: PropTypes.func.isRequired,
    path: PropTypes.arrayOf(PropTypes.object),
    translate: PropTypes.func,
    moves: PropTypes.arrayOf(PropTypes.object)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true && this.props.show === false) {
      this.loadStuff()
    }
  }

  loadStuff() {
    this.props.loadChildren()
  }

  render() {
    const { moves, path } = this.props
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
              tableData={moves}
            />
          </Modal.Body>
          <Modal.Footer style={{ textAlign: 'center' }}>
            <Row style={{ textAlign: 'center' }}>
              <Col>
                {this.props.translate('musit.moveHistoryModal.currentDestination')}
              </Col>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              <Col>
                <Breadcrumb nodes={path} />
              </Col>
            </Row>
            <br />
            <Row style={{ textAlign: 'center' }}>
              <Col xs={4} sm={4} smOffset={4}>
                <SaveCancel
                  translate={this.props.translate}
                  saveLabel={this.props.translate('musit.moveHistoryModal.close')}
                  onClickSave={(e) => {
                    e.preventDefault()
                    this.props.onClose()
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
