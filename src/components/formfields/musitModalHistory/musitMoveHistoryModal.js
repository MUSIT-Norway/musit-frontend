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
import './modalStyling.css'
import React, { Component, PropTypes } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import ModalMoveHistoryGrid from '../../../components/grid/ModalMoveHistoryGrid'
import { I18n } from 'react-i18nify'

export default class MusitHistoryModal extends Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    headerText: PropTypes.string.isRequired,
    object: PropTypes.object,
    translate: PropTypes.func,
    moves: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const { moves, translate, object } = this.props;
    let objstr = object && object.museumNo ?  `${object.museumNo}`: null
    objstr = objstr && object.subNo ? `${objstr} - ${object.subNo}` : objstr
    objstr = objstr && object.term ? `${objstr} - ${object.term}` : objstr


    return (
      <div>
        <Modal
          dialogClassName="my-modal"
          show={this.props.show}
          onHide={this.props.onHide}
          bsSize="large"
          aria-labelledby="contained-modal-title-sm"
        >
          <Modal.Header closeButton style={{ border: 'none' }}>
            <Modal.Title id="title" style={{ textAlign: 'center' }}>
              {`${this.props.headerText} ${objstr}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: 300, overflow: 'auto' }}>
            <ModalMoveHistoryGrid
              tableData={moves}
              translate={translate}
            />
          </Modal.Body>
          <Modal.Footer style={{ textAlign: 'center' }}>
            <br />
            <Row style={{ textAlign: 'center' }}>
              <Col xs={4} sm={4} smOffset={4}>
                <Button onClick={this.props.onClose}>
                  {I18n.t('musit.texts.close')}
                </Button>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </div>
  );
  }
}
