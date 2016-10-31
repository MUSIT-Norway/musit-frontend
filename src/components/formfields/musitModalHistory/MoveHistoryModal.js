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
import './MoveHistoryModal.css'
import React, { Component, PropTypes } from 'react'
import ModalMoveHistoryGrid from '../../../components/grid/ModalMoveHistoryGrid'
import Modal from '../../modal/MusitModal'
import CancelButton from '../../buttons/cancel'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux';
import { loadMoveHistoryForObject, clearMoveHistoryForObject, loadActor } from '../../../reducers/grid/move'

const mapStateToProps = (state) => {
  return {
    moves: state.movehistory.data || []
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadMoveHistoryForObject: (objectId, cb) => {
      dispatch(loadMoveHistoryForObject(objectId, cb))
    },
    clearMoveHistoryForObject: (objectId) => {
      dispatch(clearMoveHistoryForObject(objectId))
    },
    loadActorDetails: (data) => {
      dispatch(loadActor(data))
    }
  }
}

class MoveHistoryModal extends Component {

  static propTypes = {
    moves: PropTypes.arrayOf(PropTypes.object),
    objectId: PropTypes.number.isRequired
  };

  static contextTypes = {
    closeModal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.clearMoveHistoryForObject()
    this.props.loadMoveHistoryForObject(this.props.objectId, {
      onSuccess: (result) => this.props.loadActorDetails({ data: result.filter((r) => r.doneBy).map(r => r.doneBy) })
    })
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

export default connect(mapStateToProps, mapDispatchToProps)(MoveHistoryModal)
