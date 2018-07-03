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
import './MoveHistoryComponent.css';
import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import ModalMoveHistoryGrid from './ModalMoveHistoryGrid';
import Modal from '../../components/modal/MusitModal';
import CancelButton from '../../components/buttons/cancel';
import { I18n } from 'react-i18nify';
import moveHistoryStore$, { clear$, loadMoveHistory$ } from './moveHistoryStore';
import { RxInjectLegacy as inject } from '../../shared/react-rxjs-patch/';
import { MUSTFIX } from '../../types/common';
import { AppSession } from '../../types/appSession';

interface MoveHistoryProps {
  moveHistoryStore: MUSTFIX;
  objectId: string;
  appSession: AppSession;
  loadMoveHistory: Function;
  clear: Function;
}
/* Old:
 static propTypes = {
    moveHistoryStore: PropTypes.object.isRequired,
    objectId: PropTypes.string.isRequired,
    appSession: PropTypes.object.isRequired,
    loadMoveHistory: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired
  };

*/
export class MoveHistoryComponent extends Component<MoveHistoryProps> {
  static contextTypes = {
    closeModal: PropTypes.func
  };

  componentDidMount() {
    this.props.clear();
    this.props.loadMoveHistory({
      objectId: this.props.objectId,
      museumId: this.props.appSession.museumId,
      token: this.props.appSession.accessToken
    });
  }

  render() {
    const moves = this.props.moveHistoryStore.data;
    return (
      <Modal
        className="moveHistory"
        body={<ModalMoveHistoryGrid tableData={moves} />}
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

const data = {
  moveHistoryStore$
};

const commands = {
  clear$,
  loadMoveHistory$
};

export default inject(data, commands)(MoveHistoryComponent);
