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
import './MoveHistoryModal.css';
import React, { Component, PropTypes } from 'react';
import ModalMoveHistoryGrid from './ModalMoveHistoryGrid';
import Modal from '../modal/MusitModal';
import CancelButton from '../buttons/cancel';
import { I18n } from 'react-i18nify';

export default class MoveHistoryModal extends Component {

  static propTypes = {
    moves: PropTypes.arrayOf(PropTypes.object),
    objectId: PropTypes.number.isRequired
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.clearMoveHistoryForObject();
    this.props.loadMoveHistoryForObject(this.props.objectId, {
      onSuccess: (result) => this.props.loadActorDetails({ data: result.filter((r) => r.doneBy).map(r => r.doneBy) })
    });
  }

  render() {
    const { moves } = this.props;
    return (
      <Modal
        className="my-modal"
        body={
          <ModalMoveHistoryGrid
            tableData={moves}
          />
        }
        footer={
          <CancelButton
            onClick={this.context.closeModal}
            label={I18n.t('musit.texts.close')}
          />
        }
      />
    );
  }
}